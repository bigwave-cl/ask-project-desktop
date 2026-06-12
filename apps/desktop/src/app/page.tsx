"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { ProjectCommandHeader, type ProjectToolbarAction } from "@/components/ProjectCommandHeader";
import { ProjectEmpty } from "@/components/ProjectEmpty";
import { ProjectHudDashboard, type ProjectHudMetricKey } from "@/components/ProjectHudDashboard";
import { ProjectManageBackground } from "@/components/ProjectManageBackground";
import { ProjectManageTab } from "@/components/ProjectManageTab";
import { ProjectOnboardingGuide } from "@/components/ProjectOnboardingGuide";
import { ProjectPreferenceSetting, type ProjectPreferencesModel } from "@/components/ProjectPreferenceSetting";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copyText } from "@/hooks/useCopyText";
import { projectConfirm } from "@/hooks/useProjectConfirm";
import { projectInfoDialog } from "@/hooks/useProjectInfoDialog";
import { projectToast } from "@/hooks/useProjectToast";
import { invokeDesktop, isDesktopRuntime } from "@/lib/desktopRuntime";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/ProjectCard";

type ProjectType = "workspace" | "folder";

type ProjectItem = {
  name: string;
  key: string;
  source: string;
  path: string;
  type: ProjectType;
};

type ProjectGroup = {
  key: string;
  label: string;
  children: ProjectItem[];
};

type Preferences = {
  autoOpenPanel: boolean;
  hud: {
    visible: boolean;
    metrics: Record<ProjectHudMetricKey, boolean>;
  };
  onboarding: {
    seen: boolean;
  };
};

type ConfigPayload = {
  name: "ask-project-manage";
  version: 1;
  exportedAt: string;
  config: {
    list: ProjectGroup[];
  };
};

const configStorageKey = "ask-project-manage.config";
const preferencesStorageKey = "ask-project-manage.preferences";
const currentWindowPathStorageKey = "ask-project-manage.currentWindowPath";
const updateWindowInfoEvent = "ask-project-manage.updateWindowInfo";

const emptyActionButtonClass =
  "inline-flex h-[var(--apm-command-control-height,40px)] min-h-[var(--apm-command-control-height,40px)] min-w-32 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-apm-current-22 bg-apm-command-control px-4 font-extrabold text-[var(--apm-radio-silence)] tracking-normal shadow-apm-command-control backdrop-blur transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-apm-command-control-hover";

const emptySecondaryActionButtonClass =
  "border-apm-mauve-40 text-[var(--apm-mamas-new-bag)]";

const manageWrapClass =
  "relative h-screen w-full overflow-hidden bg-apm-app-shell text-[var(--apm-text-main)] before:pointer-events-none before:absolute before:inset-0 before:bg-apm-app-grid before:bg-[length:44px_44px] before:[mask-image:radial-gradient(circle_at_center,black,transparent_78%)] before:content-['']";

const shellClass =
  "relative z-[1] flex h-full flex-col overflow-hidden px-6 pt-[22px] [--apm-sticky-safe-space:122px] max-[980px]:[--apm-sticky-safe-space:220px]";

const shellStickyClass =
  "absolute left-6 right-6 top-[22px] z-10 flex flex-col gap-4 bg-transparent pb-4 backdrop-blur-[4px] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-apm-line-header-divider after:opacity-70 after:shadow-apm-header-divider after:content-['']";

const projectListScrollClass =
  "relative -mx-5 ml-[-24px] min-h-0 min-w-[300px] flex-1 overflow-y-auto px-5 pb-6 pl-6 pt-[var(--apm-sticky-safe-space)] [scrollbar-color:color-mix(in_srgb,var(--apm-radio-silence)_26%,transparent)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-apm-scroll-thumb [&::-webkit-scrollbar-thumb]:shadow-apm-scroll-thumb [&::-webkit-scrollbar-track]:bg-transparent max-[860px]:px-6 max-[860px]:pb-[168px]";

const projectListEmptyClass =
  "grid place-items-center overflow-hidden pb-[280px] max-[860px]:pb-[168px]";

const projectGridClass =
  "grid w-full grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[18px] py-1 pb-6";

const hudSpacerClass = "pointer-events-none col-span-full h-[174px]";

const defaultPreferences: Preferences = {
  autoOpenPanel: true,
  hud: {
    visible: true,
    metrics: {
      project: true,
      folder: true,
      workspace: true,
      group: true,
    },
  },
  onboarding: {
    seen: false,
  },
};

const starterGroups: ProjectGroup[] = [
  {
    key: "group-starter",
    label: "默认分组",
    children: [
      {
        name: "ask-project-manage",
        key: "project-starter-1",
        source: "/Users/bobo/Desktop/joyme/ask/ask-project-manage",
        path: "/Users/bobo/Desktop/joyme/ask/ask-project-manage",
        type: "folder",
      },
      {
        name: "ask-project-desktop",
        key: "project-starter-2",
        source: "/Users/bobo/Desktop/joyme/ask/ask-project-desktop",
        path: "/Users/bobo/Desktop/joyme/ask/ask-project-desktop",
        type: "folder",
      },
    ],
  },
];

const createKey = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const basename = (path: string) => {
  const clean = path.replace(/\\/g, "/").replace(/\/$/, "");
  const last = clean.split("/").pop() || clean;
  return last.replace(/\.code-workspace$/i, "") || "未命名项目";
};

const buildProject = (path: string, type: ProjectType): ProjectItem => ({
  name: basename(path),
  key: createKey("project"),
  source: path,
  path,
  type,
});

const isSamePath = (currentPath: string, itemPath: string) => {
  if (!currentPath || !itemPath) {
    return false;
  }
  return currentPath === itemPath || currentPath.endsWith(itemPath) || itemPath.endsWith(currentPath);
};

const normalizePreferences = (value?: Partial<Preferences>): Preferences => ({
  autoOpenPanel: value?.autoOpenPanel ?? defaultPreferences.autoOpenPanel,
  hud: {
    visible: value?.hud?.visible ?? defaultPreferences.hud.visible,
    metrics: {
      project: value?.hud?.metrics?.project ?? true,
      folder: value?.hud?.metrics?.folder ?? true,
      workspace: value?.hud?.metrics?.workspace ?? true,
      group: value?.hud?.metrics?.group ?? true,
    },
  },
  onboarding: {
    seen: value?.onboarding?.seen ?? false,
  },
});

const normalizeGroups = (value: unknown): ProjectGroup[] => {
  const payload = value as Partial<ConfigPayload> & {
    list?: unknown;
    "ask-project-manage.config"?: { list?: unknown };
  };
  const list =
    payload?.config?.list ||
    payload?.list ||
    payload?.["ask-project-manage.config"]?.list;

  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((group, groupIndex) => {
    const candidate = group as Partial<ProjectGroup>;
    const children = Array.isArray(candidate.children) ? candidate.children : [];
    return {
      key: candidate.key || createKey(`group-${groupIndex}`),
      label: candidate.label || `分组${groupIndex + 1}`,
      children: children
        .map((item, itemIndex) => {
          const project = item as Partial<ProjectItem>;
          if (!project.path) return null;
          return {
            name: project.name || basename(project.path),
            key: project.key || createKey(`project-${itemIndex}`),
            source: project.source || project.path,
            path: project.path,
            type: project.type === "folder" ? "folder" : "workspace",
          };
        })
        .filter(Boolean) as ProjectItem[],
    };
  });
};

const readGroups = async () => {
  if (isDesktopRuntime()) {
    return invokeDesktop<ProjectGroup[]>("get_config_list");
  }
  const raw = window.localStorage.getItem(configStorageKey);
  if (!raw) return starterGroups;
  return normalizeGroups(JSON.parse(raw));
};

const writeGroups = async (groups: ProjectGroup[]) => {
  if (isDesktopRuntime()) {
    await invokeDesktop("update_project_list_all", { list: groups });
    return;
  }
  window.localStorage.setItem(configStorageKey, JSON.stringify({ list: groups }));
};

const readPreferences = async () => {
  if (isDesktopRuntime()) {
    return invokeDesktop<Preferences>("get_preferences");
  }
  const raw = window.localStorage.getItem(preferencesStorageKey);
  return normalizePreferences(raw ? JSON.parse(raw) : undefined);
};

const writePreferences = async (preferences: Preferences) => {
  const next = normalizePreferences(preferences);
  if (isDesktopRuntime()) {
    await invokeDesktop("update_preferences", { preferences: next });
    return next;
  }
  window.localStorage.setItem(preferencesStorageKey, JSON.stringify(next));
  return next;
};

export default function Home() {
  const [groups, setGroups] = useState<ProjectGroup[]>([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [hasBootstrappedPreferences, setHasBootstrappedPreferences] = useState(false);
  const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);
  const [isPreferenceMounted, setIsPreferenceMounted] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [currentItemPath, setCurrentItemPath] = useState("");
  const importInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const [storedGroups, storedPreferences] = await Promise.all([
        readGroups(),
        readPreferences(),
      ]);
      setGroups(storedGroups);
      setActiveGroup((current) =>
        current !== "all" && !storedGroups.some((group) => group.key === current) ? "all" : current
      );
      setPreferences(storedPreferences);
      setHasBootstrappedPreferences(true);
    };
    bootstrap().catch((error) => {
      projectToast.error(error instanceof Error ? error.message : "初始化失败");
      setGroups(starterGroups);
    });
  }, []);

  useEffect(() => {
    if (!hasBootstrappedPreferences || preferences.onboarding.seen) {
      return;
    }
    const timer = window.setTimeout(() => {
      setIsOnboardingOpen(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hasBootstrappedPreferences, preferences.onboarding.seen]);

  useEffect(() => {
    if (isPreferenceOpen || !isPreferenceMounted) return;

    const timer = window.setTimeout(() => {
      setIsPreferenceMounted(false);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [isPreferenceMounted, isPreferenceOpen]);

  useEffect(() => {
    const applyCurrentPath = (value: unknown) => {
      const path = typeof value === "string" ? value : (value as { path?: unknown } | null)?.path;
      if (typeof path === "string") {
        setCurrentItemPath(path);
        if (!isDesktopRuntime()) {
          window.localStorage.setItem(currentWindowPathStorageKey, path);
        }
      }
    };

    if (!isDesktopRuntime()) {
      applyCurrentPath(window.localStorage.getItem(currentWindowPathStorageKey) || "");
    }

    const handleMessage = (event: MessageEvent) => {
      const message = event.data as { command?: string; data?: unknown };
      if (message?.command === updateWindowInfoEvent) {
        applyCurrentPath(message.data);
      }
    };

    const handleCustomEvent = (event: Event) => {
      applyCurrentPath((event as CustomEvent<{ path?: string }>).detail);
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener(updateWindowInfoEvent, handleCustomEvent);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener(updateWindowInfoEvent, handleCustomEvent);
    };
  }, []);

  const totals = useMemo(() => {
    const project = groups.reduce((total, group) => total + group.children.length, 0);
    const workspace = groups.reduce(
      (total, group) =>
        total + group.children.filter((item) => item.type === "workspace").length,
      0
    );
    return {
      project,
      workspace,
      folder: project - workspace,
      group: groups.length,
    };
  }, [groups]);

  const resolvedActiveGroup =
    activeGroup !== "all" && groups.some((group) => group.key === activeGroup)
      ? activeGroup
      : "all";

  const renderedProjects = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const visibleGroups =
      resolvedActiveGroup === "all"
        ? groups
        : groups.filter((group) => group.key === resolvedActiveGroup);

    return visibleGroups.flatMap((group) =>
      group.children
        .map((item) => ({
          ...item,
          groupKey: group.key,
          groupLabel: group.label,
          isCurrent: isSamePath(currentItemPath, item.path),
        }))
        .filter((item) => {
          if (!normalizedKeyword) return true;
          return [item.name, item.path, item.source, item.groupLabel, item.type]
            .join(" ")
            .toLowerCase()
            .includes(normalizedKeyword);
        })
    );
  }, [currentItemPath, groups, keyword, resolvedActiveGroup]);

  const saveGroups = async (nextGroups: ProjectGroup[], message = "已保存") => {
    setGroups(nextGroups);
    setActiveGroup((current) =>
      current !== "all" && !nextGroups.some((group) => group.key === current) ? "all" : current
    );
    await writeGroups(nextGroups);
    projectToast.success(message);
  };

  const addGroup = async () => {
    const label = await projectInfoDialog({
      title: "添加分组",
      nameLabel: "分组名称",
      name: "新分组",
    });
    if (!label) return;
    const group = { key: createKey("group"), label, children: [] };
    await saveGroups([...groups, group], `已添加分组：${label}`);
    setActiveGroup(group.key);
  };

  const editActiveGroup = async () => {
    if (resolvedActiveGroup === "all") {
      projectToast.warning("请先选择一个具体分组");
      return;
    }
    const group = groups.find((item) => item.key === resolvedActiveGroup);
    if (!group) return;

    const nextLabel = await projectInfoDialog({
      title: "编辑分组",
      nameLabel: "分组名称",
      name: group.label,
    });
    if (!nextLabel || nextLabel === group.label) return;

    await saveGroups(
      groups.map((item) => (item.key === group.key ? { ...item, label: nextLabel } : item)),
      "分组名称已更新"
    );
  };

  const removeActiveGroup = async () => {
    if (groups.length === 0) {
      projectToast.warning("当前没有可删除的分组");
      return;
    }
    if (resolvedActiveGroup === "all") {
      const confirmed = await projectConfirm({
        title: "清空全部分组",
        content: "确认清空全部分组和项目吗？\n这个操作会移除当前所有分组和项目配置。",
        confirmText: "清空全部",
      });
      if (confirmed) await saveGroups([], "全部分组已清空");
      return;
    }
    const group = groups.find((item) => item.key === resolvedActiveGroup);
    if (!group) return;
    const confirmed = await projectConfirm({
      title: "删除分组",
      content: `确认删除「${group.label}」分组吗？\n分组内 ${group.children.length} 个项目也会一起移除。`,
      confirmText: "删除分组",
    });
    if (!confirmed) return;
    await saveGroups(
      groups.filter((item) => item.key !== resolvedActiveGroup),
      `已删除分组：${group.label}`
    );
  };

  const addProjects = async (type: ProjectType) => {
    const raw = await projectInfoDialog({
      title: type === "folder" ? "导入文件夹" : "导入工作区",
      nameLabel: type === "folder" ? "文件夹路径" : "工作区路径",
      placeholder:
        type === "folder"
          ? "输入文件夹路径，多个路径用换行分隔"
          : "输入 .code-workspace 路径，多个路径用换行分隔",
      multiline: true,
    });
    if (!raw) return;
    const paths = raw
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (paths.length === 0) return;

    let nextGroups = groups.slice();
    let targetKey = resolvedActiveGroup;
    if (nextGroups.length === 0 || targetKey === "all") {
      const fallback = nextGroups[0] || {
        key: createKey("group"),
        label: "默认分组",
        children: [],
      };
      if (nextGroups.length === 0) nextGroups = [fallback];
      targetKey = fallback.key;
      setActiveGroup(targetKey);
    }

    let importedCount = 0;
    nextGroups = nextGroups.map((group) => {
      if (group.key !== targetKey) return group;
      const existing = new Set(group.children.map((item) => item.path));
      const children = paths
        .filter((path) => !existing.has(path))
        .map((path) => buildProject(path, type));
      importedCount = children.length;
      return {
        ...group,
        children: [...group.children, ...children],
      };
    });
    await saveGroups(nextGroups, importedCount > 0 ? `已导入 ${importedCount} 个项目` : "当前分组已存在这些项目");
  };

  const removeProject = async (groupKey: string, projectKey: string) => {
    const project = renderedProjects.find((item) => item.key === projectKey);
    if (!project) return;
    const confirmed = await projectConfirm({
      title: "删除项目",
      content: `确认删除「${project.name}」吗？\n该项目会从「${project.groupLabel}」分组移除。`,
      confirmText: "删除项目",
    });
    if (!confirmed) return;
    await saveGroups(
      groups.map((group) =>
        group.key === groupKey
          ? {
              ...group,
              children: group.children.filter((item) => item.key !== projectKey),
            }
          : group
      ),
      `已删除项目：${project.name}`
    );
  };

  const startEdit = async (editing: ProjectItem) => {
    const nextName = await projectInfoDialog({
      title: "编辑项目符名",
      nameLabel: "项目名称",
      name: editing.name,
    });
    if (!nextName) return;
    await saveGroups(
      groups.map((group) => ({
        ...group,
        children: group.children.map((item) =>
          item.key === editing.key ? { ...item, name: nextName } : item
        ),
      })),
      "项目名称已更新"
    );
  };

  const copyPath = async (path: string) => {
    const copied = await copyText(path);
    if (copied) {
      projectToast.success("路径已复制");
      return;
    }
    projectToast.error("路径复制失败");
  };

  const openProject = async (item: ProjectItem) => {
    if (isDesktopRuntime()) {
      await invokeDesktop("open_project_path", { path: item.path });
      projectToast.success(`已打开：${item.name}`);
      return;
    }
    projectToast.info("浏览器调试模式下不会打开本地路径，Electron 中会调用 Rust 原生命令");
  };

  const exportConfig = (format: "json" | "yml") => {
    const payload: ConfigPayload = {
      name: "ask-project-manage",
      version: 1,
      exportedAt: new Date().toISOString(),
      config: { list: groups },
    };
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ask-project-manage.config.${format === "json" ? "json" : "yml"}`;
    link.click();
    URL.revokeObjectURL(url);
    projectToast.success(`配置已导出为 ${format.toUpperCase()}`);
  };

  const importConfig = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const imported = normalizeGroups(JSON.parse(text));
      if (imported.length === 0) {
        projectToast.warning("没有找到可导入的分组");
        return;
      }
      await saveGroups([...groups, ...imported], `已导入 ${imported.length} 个分组`);
    } catch {
      projectToast.error("当前 React 版先支持 JSON 导入，YML 导入会放到 Rust 原生层处理");
    }
  };

  const updateMetric = async (key: ProjectHudMetricKey) => {
    const next = await writePreferences({
      ...preferences,
      hud: {
        ...preferences.hud,
        metrics: {
          ...preferences.hud.metrics,
          [key]: !preferences.hud.metrics[key],
        },
      },
    });
    setPreferences(next);
    projectToast.success("设置已保存");
  };

  const savePreferences = async (nextPreferences: ProjectPreferencesModel) => {
    const next = await writePreferences(nextPreferences);
    setPreferences(next);
    projectToast.success("设置已保存");
  };

  const finishOnboardingGuide = async () => {
    const next = await writePreferences({
      ...preferences,
      onboarding: {
        seen: true,
      },
    });
    setPreferences(next);
    projectToast.success("新手引导已完成");
  };

  const handleToolbarClick = async (type: ProjectToolbarAction) => {
    switch (type) {
      case "chooseWorkspace":
        await addProjects("workspace");
        break;
      case "chooseFolder":
        await addProjects("folder");
        break;
      case "importConfig":
        importInputRef.current?.click();
        break;
      case "exportConfigJson":
        exportConfig("json");
        break;
      case "exportConfigYml":
        exportConfig("yml");
        break;
      case "addGroup":
        await addGroup();
        break;
      case "editGroup":
        await editActiveGroup();
        break;
      case "setting":
        projectToast.info("批量管理会在下一步迁移");
        break;
      case "preferences":
        setIsPreferenceMounted(true);
        setIsPreferenceOpen(true);
        break;
      case "removeGroup":
        await removeActiveGroup();
        break;
    }
  };

  const groupList = [{ key: "all", label: "全部" }, ...groups.map(({ key, label }) => ({ key, label }))];
  const visibleMetricKeys = (Object.keys(preferences.hud.metrics) as ProjectHudMetricKey[]).filter(
    (key) => preferences.hud.metrics[key]
  );

  return (
    <main className={manageWrapClass}>
      <ProjectManageBackground />
      <div className={shellClass}>
        <div className={shellStickyClass}>
          <ProjectCommandHeader
            searchKeyword={keyword}
            canEditGroup={resolvedActiveGroup !== "all"}
            removeGroupTitle={resolvedActiveGroup === "all" ? "删除全部分组" : "删除当前分组"}
            onSearchKeywordChange={setKeyword}
            onToolbarClick={handleToolbarClick}
          />
          <Input
            ref={importInputRef}
            className="hidden"
            type="file"
            accept="application/json,.json"
            onChange={importConfig}
          />

          {groups.length > 1 ? (
            <ProjectManageTab activeKey={resolvedActiveGroup} list={groupList} onActiveChange={setActiveGroup} />
          ) : null}
        </div>

        <div className={cn(projectListScrollClass, renderedProjects.length === 0 && projectListEmptyClass)}>
          {groups.length === 0 ? (
            <ProjectEmpty text={<div>当前还没有分组数据，可以先添加分组，也可以直接从顶部导入项目</div>}>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  variant="projectPlain"
                  size="projectPlain"
                  className={emptyActionButtonClass}
                  onClick={addGroup}
                >
                  添加分组
                </Button>
                <Button
                  type="button"
                  variant="projectPlain"
                  size="projectPlain"
                  className={cn(emptyActionButtonClass, emptySecondaryActionButtonClass)}
                  onClick={() => importInputRef.current?.click()}
                >
                  导入配置
                </Button>
              </div>
            </ProjectEmpty>
          ) : renderedProjects.length === 0 ? (
            <ProjectEmpty
              text={
                <div className="grid max-w-[min(560px,86vw)] justify-items-center gap-2 text-center">
                  <strong className="text-lg font-extrabold leading-[1.35] tracking-normal text-[var(--apm-text-main)] [text-shadow:0_0_18px_color-mix(in_srgb,var(--apm-radio-silence)_22%,transparent)]">
                    当前分组还没有项目符牌
                  </strong>
                  <span className="text-sm leading-[1.7] text-[color-mix(in_srgb,var(--apm-faded-letter)_78%,transparent)]">
                    先导入一个文件夹或工作区，项目会自动收纳到当前分组。
                  </span>
                </div>
              }
            >
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  variant="projectPlain"
                  size="projectPlain"
                  className={emptyActionButtonClass}
                  onClick={() => addProjects("folder")}
                >
                  导入文件夹
                </Button>
                <Button
                  type="button"
                  variant="projectPlain"
                  size="projectPlain"
                  className={cn(emptyActionButtonClass, emptySecondaryActionButtonClass)}
                  onClick={() => addProjects("workspace")}
                >
                  导入工作区
                </Button>
              </div>
              <div className="mt-3.5 text-xs leading-[1.6] text-[color-mix(in_srgb,var(--apm-faded-letter)_56%,transparent)]">
                也可以使用顶部搜索清空关键词，查看当前分组的全部项目。
              </div>
            </ProjectEmpty>
          ) : (
            <div className={projectGridClass}>
              {renderedProjects.map((item, index) => (
                <ProjectCard
                  item={item}
                  index={index}
                  key={item.key}
                  onOpen={openProject}
                  onCopy={(project) => copyPath(project.path)}
                  onEdit={startEdit}
                  onRemove={(project) => removeProject(project.groupKey, project.key)}
                />
              ))}
              {preferences.hud.visible ? <div className={hudSpacerClass} aria-hidden="true" /> : null}
            </div>
          )}
        </div>

        {preferences.hud.visible ? (
          <ProjectHudDashboard
            totals={totals}
            visibleMetricKeys={visibleMetricKeys}
            onMetricClick={updateMetric}
          />
        ) : null}
      </div>

      {isPreferenceMounted ? (
        <ProjectPreferenceSetting
          open={isPreferenceOpen}
          preferences={preferences}
          onOpenChange={setIsPreferenceOpen}
          onSavePreferences={savePreferences}
          onOpenGuide={() => setIsOnboardingOpen(true)}
        />
      ) : null}
      <ProjectOnboardingGuide
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        onFinish={finishOnboardingGuide}
      />
    </main>
  );
}
