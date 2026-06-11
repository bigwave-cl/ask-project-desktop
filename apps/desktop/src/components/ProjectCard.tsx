"use client";

import { Copy, Edit3, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { CSSProperties } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

export type RenderProjectItem = {
  name: string;
  key: string;
  source: string;
  path: string;
  type: "workspace" | "folder";
  groupKey: string;
  groupLabel: string;
  isCurrent: boolean;
};

type ProjectCardProps = {
  item: RenderProjectItem;
  index: number;
  onOpen: (item: RenderProjectItem) => void;
  onCopy: (item: RenderProjectItem) => void;
  onEdit: (item: RenderProjectItem) => void;
  onRemove: (item: RenderProjectItem) => void;
};

const palettes = [
  { primary: "var(--apm-radio-silence)", secondary: "var(--apm-faded-letter)", element: "青木" },
  { primary: "var(--apm-riviera)", secondary: "var(--apm-swan-dive)", element: "赤金" },
  { primary: "var(--apm-late-homework)", secondary: "var(--apm-radio-silence)", element: "玄水" },
  { primary: "var(--apm-spring-awakening)", secondary: "var(--apm-swan-dive)", element: "灵木" },
  { primary: "var(--apm-our-little-secret)", secondary: "var(--apm-dinner-party)", element: "离火" },
  { primary: "var(--apm-mamas-new-bag)", secondary: "var(--apm-riviera)", element: "幻雷" },
];

const cardMenuClass = "min-w-[172px]";
const cardMenuItemClass = "min-h-10 rounded-lg";
const cardMenuTitleClass =
  "text-[15px] font-bold tracking-normal text-[color-mix(in_srgb,currentColor_88%,transparent)] group-hover:text-[var(--apm-swan-dive)] group-data-[highlighted]:text-[var(--apm-swan-dive)]";
const cardMenuDangerTitleClass =
  "text-[15px] font-bold tracking-normal text-[color-mix(in_srgb,currentColor_88%,transparent)] group-hover:text-[var(--apm-riviera)] group-data-[highlighted]:text-[var(--apm-riviera)]";
const cardMenuMintClass = "text-[var(--apm-radio-silence)]";
const cardMenuMauveClass = "text-[var(--apm-mamas-new-bag)]";
const cardMenuFogClass = "text-[var(--apm-faded-letter)]";
const cardMenuDangerClass = "text-[var(--apm-riviera)]";
const moreButtonClass =
  "grid h-[22px] w-[22px] min-w-[22px] cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[rgba(239,255,252,.72)] hover:bg-[color-mix(in_srgb,var(--seal-primary)_12%,transparent)] hover:text-[var(--apm-swan-dive)] data-[state=open]:bg-[color-mix(in_srgb,var(--seal-primary)_12%,transparent)] data-[state=open]:text-[var(--apm-swan-dive)]";

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

export function ProjectCard({
  item,
  index,
  onOpen,
  onCopy,
  onEdit,
  onRemove,
}: ProjectCardProps) {
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
                className={moreButtonClass}
                title="项目操作"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreVertical size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cardMenuClass}
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem
                className={cn(cardMenuItemClass, cardMenuMintClass)}
                onSelect={() => onOpen(item)}
              >
                <ExternalLink size={16} />
                <span className={cardMenuTitleClass}>打开项目</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(cardMenuItemClass, cardMenuMauveClass)}
                onSelect={() => onEdit(item)}
              >
                <Edit3 size={16} />
                <span className={cardMenuTitleClass}>编辑符名</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(cardMenuItemClass, cardMenuFogClass)}
                onSelect={() => onCopy(item)}
              >
                <Copy size={16} />
                <span className={cardMenuTitleClass}>复制路径</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(cardMenuItemClass, cardMenuDangerClass)}
                onSelect={() => onRemove(item)}
              >
                <Trash2 size={16} />
                <span className={cardMenuDangerTitleClass}>删除项目</span>
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
