"use client";

import { BookOpen, Copy, Edit3, ExternalLink, FolderCog, MoreVertical, Orbit, Trash2, VectorSquare } from "lucide-react";
import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { ProjectCommandHeader, type ProjectToolbarAction } from "@/components/ProjectCommandHeader";
import { ProjectEmpty } from "@/components/ProjectEmpty";
import { ProjectManageBackground } from "@/components/ProjectManageBackground";
import { ProjectManageTab } from "@/components/ProjectManageTab";
import { ProjectOnboardingGuide } from "@/components/ProjectOnboardingGuide";
import { ProjectPreferenceSetting, type ProjectPreferencesModel } from "@/components/ProjectPreferenceSetting";
import { copyText } from "@/hooks/useCopyText";
import { projectConfirm } from "@/hooks/useProjectConfirm";
import { projectInfoDialog } from "@/hooks/useProjectInfoDialog";
import { projectToast } from "@/hooks/useProjectToast";
import { invokeDesktop, isDesktopRuntime } from "@/lib/desktopRuntime";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

type ProjectType = "workspace" | "folder";
type ProjectHudMetricKey = "project" | "folder" | "workspace" | "group";

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

type RenderProjectItem = ProjectItem & {
  groupKey: string;
  groupLabel: string;
  isCurrent: boolean;
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
  "inline-flex h-[var(--apm-command-control-height,40px)] min-h-[var(--apm-command-control-height,40px)] min-w-32 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-[color-mix(in_srgb,currentColor_22%,transparent)] bg-[linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02)),rgba(5,13,18,.68)] px-4 font-extrabold text-[var(--apm-radio-silence)] tracking-normal shadow-[0_0_18px_color-mix(in_srgb,currentColor_14%,transparent),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,0,0,.24),0_0_24px_color-mix(in_srgb,currentColor_22%,transparent),inset_0_1px_0_rgba(255,255,255,.12)]";

const emptySecondaryActionButtonClass =
  "border-[color-mix(in_srgb,var(--apm-mamas-new-bag)_40%,transparent)] text-[var(--apm-mamas-new-bag)]";

const shellStickyClass =
  "absolute left-6 right-6 top-[22px] z-10 flex flex-col gap-4 bg-transparent pb-4 backdrop-blur-[4px] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--apm-radio-silence)_28%,transparent),color-mix(in_srgb,var(--apm-riviera)_18%,transparent),transparent)] after:opacity-70 after:shadow-[0_10px_24px_rgba(0,0,0,.26)]";

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

const palettes = [
  { primary: "var(--apm-radio-silence)", secondary: "var(--apm-faded-letter)", element: "青木" },
  { primary: "var(--apm-riviera)", secondary: "var(--apm-swan-dive)", element: "赤金" },
  { primary: "var(--apm-late-homework)", secondary: "var(--apm-radio-silence)", element: "玄水" },
  { primary: "var(--apm-spring-awakening)", secondary: "var(--apm-swan-dive)", element: "灵木" },
  { primary: "var(--apm-our-little-secret)", secondary: "var(--apm-dinner-party)", element: "离火" },
  { primary: "var(--apm-mamas-new-bag)", secondary: "var(--apm-riviera)", element: "幻雷" },
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

const hashText = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const sealText = (value: string) =>
  (value || "AP")
    .split(/[-_\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const runeName = (item: RenderProjectItem, element: string) => {
  const lower = `${item.name}-${item.path}-${item.groupLabel}`.toLocaleLowerCase();
  if (/ai|llm|cursor|claude|bot/.test(lower)) return "灵识";
  if (/sdk|lib|tools|router|publish/.test(lower)) return "器修";
  if (/h5|app|mobile|portal/.test(lower)) return "疾行";
  if (/cms|admin|finance|manage/.test(lower)) return "中枢";
  if (/video|image|studio|media/.test(lower)) return "幻象";
  return element;
};

const shortPath = (path: string, source: string) =>
  (path || source || "").split("/").filter(Boolean).slice(-3).join(" / ") || path;

const isSamePath = (currentPath: string, itemPath: string) => {
  if (!currentPath || !itemPath) {
    return false;
  }
  return currentPath === itemPath || currentPath.endsWith(itemPath) || itemPath.endsWith(currentPath);
};

const cardGradient = (index: number) => {
  const gradients = [
    ["rgba(97, 191, 173, .26)", "rgba(23, 142, 150, .26)", "rgba(203, 160, 170, .26)", "rgba(79, 58, 75, .26)"],
    ["rgba(255, 139, 139, .24)", "rgba(97, 191, 173, .22)", "rgba(23, 142, 150, .24)", "rgba(203, 160, 170, .22)"],
    ["rgba(23, 142, 150, .28)", "rgba(79, 58, 75, .28)", "rgba(97, 191, 173, .2)", "rgba(231, 81, 83, .2)"],
    ["rgba(203, 160, 170, .25)", "rgba(249, 247, 232, .16)", "rgba(97, 191, 173, .22)", "rgba(23, 142, 150, .22)"],
  ];
  const current = gradients[index % gradients.length];
  return {
    "--card-color-tl": current[0],
    "--card-color-tr": current[1],
    "--card-color-br": current[2],
    "--card-color-bl": current[3],
    "--card-angle": "135deg",
  } as CSSProperties;
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

function ProjectCard({
  item,
  index,
  onOpen,
  onCopy,
  onEdit,
  onRemove,
}: {
  item: RenderProjectItem;
  index: number;
  onOpen: (item: RenderProjectItem) => void;
  onCopy: (item: RenderProjectItem) => void;
  onEdit: (item: RenderProjectItem) => void;
  onRemove: (item: RenderProjectItem) => void;
}) {
  const palette = palettes[hashText(`${item.name}-${item.path}-${item.groupLabel}`) % palettes.length];
  const style = {
    "--seal-primary": palette.primary,
    "--seal-secondary": palette.secondary,
    ...cardGradient(index),
  } as CSSProperties;

  return (
    <article
      className={item.isCurrent ? "ask-project-manage-card ask-project-manage-card--current" : "ask-project-manage-card"}
      style={style}
      onClick={() => onOpen(item)}
    >
      <div className="ask-project-manage-card__box">
        <div className="ask-project-manage-card__halo" />
        <div className="ask-project-manage-card__top">
          <div className="ask-project-manage-card__seal" aria-hidden="true">
            <span>{sealText(item.name)}</span>
            <i />
          </div>
          <div className="ask-project-manage-card__meta">
            <span>{item.type === "workspace" ? "WORKSPACE" : "FOLDER"}</span>
            <strong>{runeName(item, palette.element)}</strong>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="项目操作"
                className="ask-project-manage-card__more"
                title="项目操作"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreVertical size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="ask-project-manage-card__menu"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem
                className="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--mint"
                onSelect={() => onOpen(item)}
              >
                <ExternalLink size={16} />
                <span className="ask-project-manage-card__menu-title">打开项目</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--mauve"
                onSelect={() => onEdit(item)}
              >
                <Edit3 size={16} />
                <span className="ask-project-manage-card__menu-title">编辑符名</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--fog"
                onSelect={() => onCopy(item)}
              >
                <Copy size={16} />
                <span className="ask-project-manage-card__menu-title">复制路径</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="ask-project-manage-card__menu-item ask-project-manage-card__menu-item--danger"
                onSelect={() => onRemove(item)}
              >
                <Trash2 size={16} />
                <span className="ask-project-manage-card__menu-title">删除项目</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ask-project-manage-card__main">
          <h2>{item.name}</h2>
          <p>{shortPath(item.path, item.source)}</p>
        </div>

        <div className="ask-project-manage-card__bottom">
          <span>{item.groupLabel}</span>
          {item.isCurrent ? (
            <span className="ask-project-manage-card__status">当前窗口</span>
          ) : (
            <span>{item.type === "workspace" ? "阵盘" : "玉简"}</span>
          )}
        </div>
      </div>
    </article>
  );
}

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

  const metricItems = [
    { key: "project" as const, label: "项目总数", value: totals.project, icon: VectorSquare },
    { key: "folder" as const, label: "文件夹", value: totals.folder, icon: FolderCog },
    { key: "workspace" as const, label: "工作区", value: totals.workspace, icon: BookOpen },
    { key: "group" as const, label: "分组", value: totals.group, icon: Orbit },
  ].filter((item) => visibleMetricKeys.includes(item.key));
  const maxMetric = Math.max(1, ...metricItems.map((item) => item.value));

  return (
    <main className="ask-project-manage-wrap">
      <ProjectManageBackground />
      <div className="apm-shell">
        <div className={shellStickyClass}>
          <ProjectCommandHeader
            searchKeyword={keyword}
            canEditGroup={resolvedActiveGroup !== "all"}
            removeGroupTitle={resolvedActiveGroup === "all" ? "删除全部分组" : "删除当前分组"}
            onSearchKeywordChange={setKeyword}
            onToolbarClick={handleToolbarClick}
          />
          <input
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

        <div className={renderedProjects.length === 0 ? "apm-list apm-list--empty" : "apm-list"}>
          {groups.length === 0 ? (
            <ProjectEmpty text={<div>当前还没有分组数据，可以先添加分组，也可以直接从顶部导入项目</div>}>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                <button className={emptyActionButtonClass} onClick={addGroup}>
                  添加分组
                </button>
                <button
                  className={cn(emptyActionButtonClass, emptySecondaryActionButtonClass)}
                  onClick={() => importInputRef.current?.click()}
                >
                  导入配置
                </button>
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
                <button className={emptyActionButtonClass} onClick={() => addProjects("folder")}>
                  导入文件夹
                </button>
                <button
                  className={cn(emptyActionButtonClass, emptySecondaryActionButtonClass)}
                  onClick={() => addProjects("workspace")}
                >
                  导入工作区
                </button>
              </div>
              <div className="mt-3.5 text-xs leading-[1.6] text-[color-mix(in_srgb,var(--apm-faded-letter)_56%,transparent)]">
                也可以使用顶部搜索清空关键词，查看当前分组的全部项目。
              </div>
            </ProjectEmpty>
          ) : (
            <div className="ask-project-manage-list">
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
              {preferences.hud.visible ? <div className="ask-project-manage-list__hud-spacer" aria-hidden="true" /> : null}
            </div>
          )}
        </div>

        {preferences.hud.visible ? (
          <section className="apm-cockpit" aria-label="项目统计仪表盘">
            <div className="apm-cockpit__panel">
              <div className="apm-cockpit__scan" aria-hidden="true" />
              <div className="apm-cockpit__body">
                <div className="apm-cockpit__metrics" style={{ "--hud-metric-count": metricItems.length || 1 } as CSSProperties}>
                  {metricItems.map((metric) => {
                    const Icon = metric.icon;
                    const level = Math.max(0.18, Math.min(1, metric.value / maxMetric)).toFixed(3);
                    return (
                      <article
                        className={`apm-hud-card apm-hud-card--${metric.key}`}
                        key={metric.key}
                        style={{ "--metric-level": level } as CSSProperties}
                        onClick={() => updateMetric(metric.key)}
                      >
                        <div className="apm-hud-card__icon">
                          <Icon size={18} />
                        </div>
                        <div className="apm-hud-card__content">
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                        </div>
                        <div className="apm-hud-card__bar" aria-hidden="true">
                          <span />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
              <footer className="apm-cockpit__footer" aria-hidden="true">
                <span />
                <span />
                <span />
              </footer>
            </div>
          </section>
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
