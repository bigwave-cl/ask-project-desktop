use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    env,
    fs,
    io::{self, Read},
    path::PathBuf,
    process::Command,
};

// 这个 native 程序是 Electron 的 Rust sidecar。
// Electron 主进程通过 stdin 传入 JSON，通过 stdout 接收 JSON 结果。
// 这样 React 不直接碰 Node，也不需要绑定某个 WebView 框架。

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct NativeInput {
    store_dir: PathBuf,
    args: Value,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct ProjectItem {
    name: String,
    key: String,
    source: String,
    path: String,
    // Rust 里 type 是关键字，不能直接作为字段名。
    // serde(rename = "type") 让 JSON 仍然和前端的 { type: "folder" } 保持一致。
    #[serde(rename = "type")]
    item_type: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct ProjectGroup {
    key: String,
    label: String,
    children: Vec<ProjectItem>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct ConfigStore {
    list: Vec<ProjectGroup>,
}

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
    #[serde(rename = "autoOpenPanel")]
    auto_open_panel: bool,
    hud: HudPreferences,
    onboarding: OnboardingPreferences,
}

#[derive(Debug, Deserialize)]
struct UpdateProjectListArgs {
    list: Vec<ProjectGroup>,
}

#[derive(Debug, Deserialize)]
struct UpdatePreferencesArgs {
    preferences: ProjectPreferences,
}

#[derive(Debug, Deserialize)]
struct OpenProjectPathArgs {
    path: String,
}

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

fn ensure_store_dir(store_dir: &PathBuf) -> Result<(), String> {
    fs::create_dir_all(store_dir).map_err(|error| error.to_string())
}

fn config_path(store_dir: &PathBuf) -> PathBuf {
    store_dir.join("ask-project-manage.config.json")
}

fn preferences_path(store_dir: &PathBuf) -> PathBuf {
    store_dir.join("ask-project-manage.preferences.json")
}

fn get_config_list(store_dir: &PathBuf) -> Result<Vec<ProjectGroup>, String> {
    ensure_store_dir(store_dir)?;
    let path = config_path(store_dir);
    if !path.exists() {
        return Ok(Vec::new());
    }
    let content = fs::read_to_string(path).map_err(|error| error.to_string())?;
    let store: ConfigStore = serde_json::from_str(&content).map_err(|error| error.to_string())?;
    Ok(store.list)
}

fn update_project_list_all(store_dir: &PathBuf, args: Value) -> Result<(), String> {
    ensure_store_dir(store_dir)?;
    let args: UpdateProjectListArgs = serde_json::from_value(args).map_err(|error| error.to_string())?;
    let content = serde_json::to_string_pretty(&ConfigStore { list: args.list }).map_err(|error| error.to_string())?;
    fs::write(config_path(store_dir), content).map_err(|error| error.to_string())
}

fn get_preferences(store_dir: &PathBuf) -> Result<ProjectPreferences, String> {
    ensure_store_dir(store_dir)?;
    let path = preferences_path(store_dir);
    if !path.exists() {
        return Ok(ProjectPreferences::default());
    }
    let content = fs::read_to_string(path).map_err(|error| error.to_string())?;
    serde_json::from_str(&content).map_err(|error| error.to_string())
}

fn update_preferences(store_dir: &PathBuf, args: Value) -> Result<ProjectPreferences, String> {
    ensure_store_dir(store_dir)?;
    let args: UpdatePreferencesArgs = serde_json::from_value(args).map_err(|error| error.to_string())?;
    let content = serde_json::to_string_pretty(&args.preferences).map_err(|error| error.to_string())?;
    fs::write(preferences_path(store_dir), content).map_err(|error| error.to_string())?;
    Ok(args.preferences)
}

fn open_project_path(args: Value) -> Result<(), String> {
    let args: OpenProjectPathArgs = serde_json::from_value(args).map_err(|error| error.to_string())?;
    let path = args.path.trim();
    if path.is_empty() {
        return Err("路径不能为空".to_string());
    }

    #[cfg(target_os = "macos")]
    {
        // 优先尝试 VS Code。这里保留和旧桌面端原生实现一致的行为。
        let code_result = Command::new("code").arg("-n").arg(path).status();
        if matches!(code_result, Ok(status) if status.success()) {
            return Ok(());
        }
        Command::new("open")
            .arg(path)
            .status()
            .map_err(|error| error.to_string())?;
        return Ok(());
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", path])
            .status()
            .map_err(|error| error.to_string())?;
        return Ok(());
    }

    #[cfg(all(not(target_os = "macos"), not(target_os = "windows")))]
    {
        Command::new("xdg-open")
            .arg(path)
            .status()
            .map_err(|error| error.to_string())?;
        Ok(())
    }
}

fn read_input() -> Result<NativeInput, String> {
    let mut input = String::new();
    io::stdin()
        .read_to_string(&mut input)
        .map_err(|error| error.to_string())?;
    serde_json::from_str(&input).map_err(|error| error.to_string())
}

fn run() -> Result<Value, String> {
    let command = env::args()
        .nth(1)
        .ok_or_else(|| "缺少 native command".to_string())?;
    let input = read_input()?;

    match command.as_str() {
        "get_config_list" => Ok(json!(get_config_list(&input.store_dir)?)),
        "update_project_list_all" => {
            update_project_list_all(&input.store_dir, input.args)?;
            Ok(Value::Null)
        }
        "get_preferences" => Ok(json!(get_preferences(&input.store_dir)?)),
        "update_preferences" => Ok(json!(update_preferences(&input.store_dir, input.args)?)),
        "open_project_path" => {
            open_project_path(input.args)?;
            Ok(Value::Null)
        }
        other => Err(format!("未知 native command: {other}")),
    }
}

fn main() {
    match run() {
        Ok(data) => println!("{}", json!({ "ok": true, "data": data })),
        Err(error) => {
            println!("{}", json!({ "ok": false, "error": error }));
            std::process::exit(1);
        }
    }
}
