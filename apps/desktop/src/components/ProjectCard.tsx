"use client";

import { Copy, Edit3, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { CSSProperties } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
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

const cardClass =
  "relative aspect-square w-full min-w-[140px] max-w-40 cursor-pointer overflow-hidden rounded-[18px] border border-seal-primary-32 shadow-[0_18px_44px_rgba(0,0,0,.28),inset_0_0_0_1px_rgba(255,255,255,.08)] backdrop-blur-[4px] transition-[transform,border-color,box-shadow] duration-[180ms] will-change-[transform,border-color,box-shadow] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_0_0,var(--card-color-tl,rgba(97,191,173,.28)),transparent_58%),radial-gradient(circle_at_100%_0,var(--card-color-tr,rgba(23,142,150,.26)),transparent_58%),radial-gradient(circle_at_100%_100%,var(--card-color-br,rgba(203,160,170,.22)),transparent_62%),radial-gradient(circle_at_0_100%,var(--card-color-bl,rgba(79,58,75,.28)),transparent_62%),linear-gradient(var(--card-angle,135deg),var(--card-color-tr,rgba(23,142,150,.2))_0%,var(--card-color-tl,rgba(97,191,173,.18))_32%,var(--card-color-br,rgba(203,160,170,.16))_68%,var(--card-color-bl,rgba(79,58,75,.2))_100%)] before:opacity-[.34] before:mix-blend-soft-light before:[mask-composite:add] before:[mask-image:radial-gradient(circle_at_82%_12%,black_0_30px,rgba(0,0,0,.78)_58px,transparent_104px),linear-gradient(135deg,transparent_0_12%,rgba(0,0,0,.9)_34%,rgba(0,0,0,.72)_64%,transparent_90%)] before:[-webkit-mask-composite:source-over] before:[-webkit-mask-image:radial-gradient(circle_at_82%_12%,black_0_30px,rgba(0,0,0,.78)_58px,transparent_104px),linear-gradient(135deg,transparent_0_12%,rgba(0,0,0,.9)_34%,rgba(0,0,0,.72)_64%,transparent_90%)] after:pointer-events-none after:absolute after:right-[-34px] after:top-[-36px] after:h-[92px] after:w-[92px] after:rounded-full after:border after:border-seal-primary-34 after:bg-[conic-gradient(from_0deg,transparent_0_16%,color-mix(in_srgb,var(--seal-primary)_40%,transparent)_18%,transparent_20%_48%,color-mix(in_srgb,var(--seal-secondary)_42%,transparent)_50%,transparent_52%_100%)] after:opacity-[.16] hover:-translate-y-1 hover:border-seal-primary-66 hover:shadow-[0_24px_56px_rgba(0,0,0,.36),0_0_26px_color-mix(in_srgb,var(--seal-primary)_22%,transparent)]";
const currentCardClass =
  "border-seal-primary shadow-[0_20px_52px_rgba(0,0,0,.32),0_0_30px_color-mix(in_srgb,var(--seal-primary)_32%,transparent)]";
const cardBoxClass = "relative flex h-full w-full flex-col gap-[5px] p-2";
const cardHaloClass =
  "absolute right-[-42px] top-[-44px] h-24 w-24 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--seal-secondary)_34%,transparent),transparent_68%)] blur-[2px]";
const cardTopClass = "relative z-[1] flex items-center gap-1.5";
const cardSealClass =
  "relative grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[14px] border border-seal-primary-52 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--seal-primary)_22%,transparent),transparent_58%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02))] text-[#f4ffff] shadow-[inset_0_0_18px_color-mix(in_srgb,var(--seal-primary)_16%,transparent)]";
const cardSealTextClass = "relative z-[1] text-[11px] font-extrabold";
const cardSealInnerClass =
  "absolute inset-1.5 rotate-45 border border-seal-secondary-70";
const cardMetaClass = "min-w-0 flex-1";
const cardMetaKindClass =
  "block overflow-hidden text-ellipsis whitespace-nowrap text-[8px] tracking-[.04em] text-[rgba(225,255,249,.48)]";
const cardMetaRuneClass =
  "mt-px block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-[650] text-[color-mix(in_srgb,var(--seal-primary)_78%,white)]";
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
const cardMainClass =
  "relative z-[1] flex min-h-[58px] min-w-0 flex-auto flex-col justify-center";
const cardTitleClass =
  "m-0 line-clamp-3 min-h-[46px] overflow-hidden text-ellipsis text-[13px] font-[680] leading-[1.18] tracking-normal text-[#f4ffff]";
const cardPathClass =
  "mt-[3px] overflow-hidden text-ellipsis whitespace-nowrap text-[8px] leading-[1.15] text-[rgba(225,255,249,.46)]";
const cardBottomClass =
  "relative z-[1] mt-auto flex items-center justify-between gap-2.5";
const cardBadgeClass =
  "min-w-0 max-w-[60%] overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.04)] px-[5px] py-0.5 text-[9px] text-[rgba(235,255,250,.68)]";
const cardStatusClass =
  "border-transparent bg-[linear-gradient(90deg,var(--seal-primary),var(--seal-secondary))] font-bold text-[#061211]";

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
    background:
      "radial-gradient(circle at 0 0, var(--card-color-tl, rgba(97, 191, 173, .26)), transparent 62%), radial-gradient(circle at 100% 0, var(--card-color-tr, rgba(23, 142, 150, .26)), transparent 62%), radial-gradient(circle at 100% 100%, var(--card-color-br, rgba(203, 160, 170, .26)), transparent 66%), radial-gradient(circle at 0 100%, var(--card-color-bl, rgba(79, 58, 75, .26)), transparent 66%), linear-gradient(var(--card-angle, 135deg), var(--card-color-tr, rgba(23, 142, 150, .26)) 0%, var(--card-color-tl, rgba(97, 191, 173, .26)) 34%, var(--card-color-br, rgba(203, 160, 170, .26)) 68%, var(--card-color-bl, rgba(79, 58, 75, .26)) 100%), rgba(10, 17, 19, .24)",
  } as CSSProperties;

  return (
    <article
      className={cn(cardClass, item.isCurrent && currentCardClass)}
      style={style}
      onClick={() => onOpen(item)}
    >
      <div className={cardBoxClass}>
        <div className={cardHaloClass} />
        <div className={cardTopClass}>
          <div className={cardSealClass} aria-hidden="true">
            <span className={cardSealTextClass}>{sealText(item.name)}</span>
            <i className={cardSealInnerClass} />
          </div>
          <div className={cardMetaClass}>
            <span className={cardMetaKindClass}>{item.type === "workspace" ? "WORKSPACE" : "FOLDER"}</span>
            <strong className={cardMetaRuneClass}>{runeName(item, palette.element)}</strong>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="项目操作"
                className={moreButtonClass}
                size="projectPlain"
                title="项目操作"
                type="button"
                variant="projectPlain"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreVertical size={14} />
              </Button>
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

        <div className={cardMainClass}>
          <h2 className={cardTitleClass}>{item.name}</h2>
          <p className={cardPathClass}>{shortPath(item.path, item.source)}</p>
        </div>

        <div className={cardBottomClass}>
          <span className={cardBadgeClass}>{item.groupLabel}</span>
          {item.isCurrent ? (
            <span className={cn(cardBadgeClass, cardStatusClass)}>当前窗口</span>
          ) : (
            <span className={cardBadgeClass}>{item.type === "workspace" ? "阵盘" : "玉简"}</span>
          )}
        </div>
      </div>
    </article>
  );
}
