use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf, process::Command};
use tauri::{AppHandle, Manager};

// 这些 struct 是前端 TypeScript 数据模型在 Rust 侧的镜像。
// Serialize / Deserialize 由 serde 提供，用来在 JSON、JS 对象和 Rust 类型之间转换。
#[derive(Clone, Debug, Deserialize, Serialize)]
struct ProjectItem {
    name: String,
    key: String,
    source: String,
    path: String,
    // Rust 里 type 是关键字，所以字段名不能直接叫 type。
    // serde(rename = "type") 表示和前端通信/保存 JSON 时仍然使用 "type" 这个字段名。
    #[serde(rename = "type")]
    item_type: String,
}

// 一个分组包含多个项目，等价于前端的 ProjectConfigItemModel。
#[derive(Clone, Debug, Deserialize, Serialize)]
struct ProjectGroup {
    key: String,
    label: String,
    children: Vec<ProjectItem>,
}

// 存到磁盘时包一层 { list: [...] }，这样后续加版本号、迁移字段会更容易。
#[derive(Clone, Debug, Deserialize, Serialize)]
struct ConfigStore {
    list: Vec<ProjectGroup>,
}

// 下面几个偏好设置 struct 对应前端 Preferences。
// Rust 通常会把嵌套 JSON 拆成多个小 struct，这样类型更清楚。
#[derive(Clone, Debug, Deserialize, Serialize)]
struct HudMetrics {
    project: bool,
    folder: bool,
    workspace: bool,
    group: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct HudPreferences {
    visible: bool,
    metrics: HudMetrics,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct OnboardingPreferences {
    seen: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct ProjectPreferences {
    // 前端用 camelCase，Rust 惯例用 snake_case。
    // 这里用 rename 保持 JSON 字段兼容前端的 autoOpenPanel。
    #[serde(rename = "autoOpenPanel")]
    auto_open_panel: bool,
    hud: HudPreferences,
    onboarding: OnboardingPreferences,
}

// 实现 Default 后，就可以用 ProjectPreferences::default() 生成默认偏好。
// 这是 Rust 里很常见的“默认配置”写法。
impl Default for ProjectPreferences {
    fn default() -> Self {
        Self {
            auto_open_panel: true,
            hud: HudPreferences {
                visible: true,
                metrics: HudMetrics {
                    project: true,
                    folder: true,
                    workspace: true,
                    group: true,
                },
            },
            onboarding: OnboardingPreferences { seen: false },
        }
    }
}

// Result<T, String> 表示：成功返回 T，失败返回 String 错误信息。
// AppHandle 是 Tauri 给后端命令使用的应用句柄，可以拿到应用数据目录等运行时信息。
fn store_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        // map_err 把原始错误转换成 String，方便传回前端显示。
        .map_err(|error| error.to_string())?;
    // ? 的含义：如果前一步是 Err，就立刻返回这个错误；如果是 Ok，就取出里面的值继续执行。
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    Ok(dir)
}

// 配置文件路径：~/Library/Application Support/<bundle id>/ask-project-manage.config.json
// macOS 上大致会落在应用支持目录；Windows/Linux 会由 Tauri 映射到对应系统目录。
fn config_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(store_dir(app)?.join("ask-project-manage.config.json"))
}

fn preferences_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(store_dir(app)?.join("ask-project-manage.preferences.json"))
}

// #[tauri::command] 会把这个 Rust 函数暴露给前端：
// 前端可以通过 invoke("get_config_list") 调用它。
#[tauri::command]
fn get_config_list(app: AppHandle) -> Result<Vec<ProjectGroup>, String> {
    let path = config_path(&app)?;
    if !path.exists() {
        return Ok(Vec::new());
    }
    let content = fs::read_to_string(path).map_err(|error| error.to_string())?;
    let store: ConfigStore = serde_json::from_str(&content).map_err(|error| error.to_string())?;
    Ok(store.list)
}

// 保存整个项目分组列表。
// 当前 React 端会直接提交完整 list，这比逐条 diff 更简单，适合作为第一版桌面端。
#[tauri::command]
fn update_project_list_all(app: AppHandle, list: Vec<ProjectGroup>) -> Result<(), String> {
    let path = config_path(&app)?;
    let content = serde_json::to_string_pretty(&ConfigStore { list }).map_err(|error| error.to_string())?;
    fs::write(path, content).map_err(|error| error.to_string())
}

// 读取偏好设置；如果用户还没有保存过，就返回默认值。
#[tauri::command]
fn get_preferences(app: AppHandle) -> Result<ProjectPreferences, String> {
    let path = preferences_path(&app)?;
    if !path.exists() {
        return Ok(ProjectPreferences::default());
    }
    let content = fs::read_to_string(path).map_err(|error| error.to_string())?;
    serde_json::from_str(&content).map_err(|error| error.to_string())
}

// 保存偏好设置，并把保存后的值返回给前端。
// 这样前端可以用后端返回值刷新 state，保持单一可信来源。
#[tauri::command]
fn update_preferences(app: AppHandle, preferences: ProjectPreferences) -> Result<ProjectPreferences, String> {
    let path = preferences_path(&app)?;
    let content = serde_json::to_string_pretty(&preferences).map_err(|error| error.to_string())?;
    fs::write(path, content).map_err(|error| error.to_string())?;
    Ok(preferences)
}

// 打开项目路径。
// 浏览器页面不能随便打开本机路径；桌面端可以在 Rust 后端调用系统命令完成这件事。
#[tauri::command]
fn open_project_path(path: String) -> Result<(), String> {
    if path.trim().is_empty() {
        return Err("路径不能为空".to_string());
    }

    // cfg 是“条件编译”：只有在目标系统是 macOS 时，这块代码才会进入编译产物。
    #[cfg(target_os = "macos")]
    {
        // 先尝试用 VS Code 打开。-n 表示新窗口，比较接近原 VS Code 扩展里的行为。
        let code_result = Command::new("code").arg("-n").arg(&path).status();
        if matches!(code_result, Ok(status) if status.success()) {
            return Ok(());
        }
        // 如果用户没有安装 code 命令，就降级为 macOS 的 open。
        Command::new("open")
            .arg(&path)
            .status()
            .map_err(|error| error.to_string())?;
        return Ok(());
    }

    // Windows 下通过 cmd /C start 调系统默认打开方式。
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", &path])
            .status()
            .map_err(|error| error.to_string())?;
        return Ok(());
    }

    // Linux / 其他 Unix 桌面环境通常用 xdg-open。
    #[cfg(all(not(target_os = "macos"), not(target_os = "windows")))]
    {
        Command::new("xdg-open")
            .arg(&path)
            .status()
            .map_err(|error| error.to_string())?;
        Ok(())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Tauri 应用入口：注册插件、注册前端可调用命令，然后启动应用。
    tauri::Builder::default()
        .setup(|app| {
            // 开发调试时自动打开 WebView DevTools。
            // #[cfg(debug_assertions)] 只在 `tauri dev` 或 debug build 中编译，
            // 正式打包不会自动弹出调试窗口。
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                }
            }
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        // generate_handler! 会把多个 #[tauri::command] 函数集中注册给前端 invoke。
        .invoke_handler(tauri::generate_handler![
            get_config_list,
            update_project_list_all,
            get_preferences,
            update_preferences,
            open_project_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
