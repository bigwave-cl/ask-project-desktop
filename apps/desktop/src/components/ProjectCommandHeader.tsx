"use client";

import {
  BookPlus,
  ChevronDown,
  ChevronRight,
  DatabaseBackup,
  DatabaseZap,
  FileCode,
  FolderPlus,
  Grid2X2Plus,
  PencilLine,
  LayoutGrid,
  ListPlus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export type ProjectToolbarAction =
  | "chooseWorkspace"
  | "chooseFolder"
  | "importConfig"
  | "exportConfigJson"
  | "exportConfigYml"
  | "addGroup"
  | "editGroup"
  | "setting"
  | "preferences"
  | "removeGroup";

type ProjectCommandHeaderProps = {
  searchKeyword: string;
  canEditGroup?: boolean;
  removeGroupTitle?: string;
  onSearchKeywordChange: (value: string) => void;
  onToolbarClick: (type: ProjectToolbarAction) => void | Promise<void>;
};

const importMenuClass = "w-[198px] min-w-[198px] overflow-visible";
const exportMenuClass = "w-[138px] min-w-[138px]";
const moreMenuClass = "min-w-[188px]";
const menuItemMintClass = "text-[var(--apm-radio-silence)]";
const menuItemMauveClass = "text-[var(--apm-mamas-new-bag)]";
const menuItemCoralClass = "text-[var(--apm-riviera)]";
const menuItemTitleClass =
  "text-[15px] font-bold tracking-normal text-[color-mix(in_srgb,var(--apm-swan-dive)_88%,transparent)] group-hover:text-[var(--apm-swan-dive)] group-data-[highlighted]:text-[var(--apm-swan-dive)]";
const menuItemArrowClass = "justify-self-end";
const commandClass =
  "relative isolate grid min-h-16 grid-cols-[minmax(220px,320px)_minmax(260px,1fr)_auto] items-center gap-4 px-2.5 py-1.5 [--apm-command-control-height:40px] max-[980px]:grid-cols-1 after:pointer-events-none after:absolute after:left-1/2 after:top-[-1px] after:h-px after:w-[min(960px,82%)] after:-translate-x-1/2 after:animate-[apm-command-line-breathe_5.6s_ease-in-out_infinite] after:bg-apm-line-command-breathe after:opacity-[.58] after:shadow-apm-command-breathe-line";
const identityClass = "relative z-[1] flex min-w-0 items-center gap-3.5 py-1 pl-0 pr-2.5";
const sigilClass =
  "relative grid h-12 w-12 rotate-[-3deg] place-items-center animate-[apm-command-sigil_8.4s_ease-in-out_infinite]";
const sigilLogoClass =
  "relative z-[1] block h-[54px] w-[54px] max-w-none select-none object-contain pointer-events-none [filter:drop-shadow(0_0_12px_color-mix(in_srgb,var(--apm-radio-silence)_42%,transparent))_drop-shadow(0_8px_18px_rgba(0,0,0,.38))]";
const eyebrowClass =
  "text-[11px] uppercase tracking-[.06em] text-[var(--apm-text-muted)]";
const brushTitleClass = "mt-[-5px] block h-[45px] w-[242px] overflow-clip";
const searchWrapClass = "relative z-[1]";
const searchFieldClass =
  "relative flex h-[var(--apm-command-control-height)] min-h-[var(--apm-command-control-height)] items-center gap-2 rounded-[16px_8px_16px_8px] border border-apm-radio-30 bg-apm-command-field px-3 shadow-apm-command-field before:absolute before:bottom-0 before:left-[18px] before:right-[18px] before:h-px before:bg-apm-line-command-field before:opacity-[.82]";
const searchIconClass =
  "shrink-0 text-[color-mix(in_srgb,var(--apm-radio-silence)_82%,transparent)] [filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--apm-radio-silence)_28%,transparent))]";
const searchInputClass =
  "h-auto w-full min-w-0 border-0 bg-transparent px-0 py-0 text-sm text-[var(--apm-text-main)] shadow-none outline-0 placeholder:text-[var(--apm-text-muted)] focus-visible:border-0 focus-visible:ring-0 focus-visible:shadow-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden";
const searchClearClass =
  "relative z-[1] inline-grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[color-mix(in_srgb,var(--apm-radio-silence)_10%,transparent)] text-[var(--apm-text-muted)] hover:bg-[color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent)] hover:text-[var(--apm-text-main)]";
const actionsClass =
  "relative z-[1] flex min-h-[var(--apm-command-control-height)] items-center justify-end gap-2 max-[980px]:flex-wrap max-[980px]:justify-start";
const commandButtonBaseClass =
  "inline-flex h-[var(--apm-command-control-height)] min-h-[var(--apm-command-control-height)] cursor-pointer items-center justify-center gap-1.5 border border-apm-current-22 bg-apm-command-control text-[var(--apm-radio-silence)] shadow-apm-command-control backdrop-blur-lg transition-[transform,box-shadow,border-color] duration-[180ms] hover:shadow-apm-command-control-hover";
const importControlClass =
  "inline-flex h-[var(--apm-command-control-height)] min-h-[var(--apm-command-control-height)] items-center rounded-[16px_8px_16px_8px] shadow-apm-import-control";
const importPrimaryClass = `${commandButtonBaseClass} m-0 min-w-[132px] self-stretch rounded-[14px_0_0_7px] apm-border-r-mauve-18 text-[var(--apm-mamas-new-bag)]`;
const importToggleClass = `${commandButtonBaseClass} m-0 w-[38px] min-w-[38px] self-stretch rounded-[0_7px_14px_0] px-0 text-[var(--apm-mamas-new-bag)]`;
const iconButtonClass = `${commandButtonBaseClass} h-10 w-10 min-w-10 rounded-[14px_7px_14px_7px] hover:-translate-y-0.5`;

export function ProjectCommandHeader({
  searchKeyword,
  canEditGroup = false,
  removeGroupTitle = "删除当前分组",
  onSearchKeywordChange,
  onToolbarClick,
}: ProjectCommandHeaderProps) {
  const emitToolbarClick = (type: ProjectToolbarAction) => {
    void onToolbarClick(type);
  };

  return (
    <header className={commandClass}>
      <div className={identityClass}>
        <div className={sigilClass} aria-hidden="true">
          <Image
            className={sigilLogoClass}
            src="/logo.svg"
            alt=""
            width={54}
            height={54}
            draggable={false}
            priority
          />
        </div>
        <div>
          <div className={eyebrowClass}>Ling Shu Console</div>
          <h1 className="sr-only">灵枢控制台</h1>
          <Image
            className={brushTitleClass}
            src="/brush-title.svg"
            alt="灵枢控制台"
            width={242}
            height={45}
            draggable={false}
          />
        </div>
      </div>
      <div className={searchWrapClass}>
        <div className={searchFieldClass}>
          <Search className={searchIconClass} size={18} aria-hidden="true" />
          <Input
            className={searchInputClass}
            id="apm-command-search"
            name="apm-command-search"
            type="search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="搜索项目、路径、分组"
            aria-label="搜索项目、路径、分组"
          />
          {searchKeyword ? (
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className={searchClearClass}
              onClick={() => onSearchKeywordChange("")}
              aria-label="清空搜索"
            >
              <X size={16} />
            </Button>
          ) : null}
        </div>
      </div>
      <div className={actionsClass}>
        <div className={importControlClass}>
          <Button
            type="button"
            variant="projectPlain"
            size="projectPlain"
            className={importPrimaryClass}
            onClick={() => emitToolbarClick("chooseWorkspace")}
          >
            <BookPlus size={18} />
            导入工作区
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="projectPlain"
                size="projectPlain"
                className={importToggleClass}
                aria-label="展开导入选项"
              >
                <ChevronDown size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={importMenuClass}>
              <DropdownMenuItem
                className={menuItemMauveClass}
                onSelect={() => emitToolbarClick("chooseWorkspace")}
              >
                <BookPlus size={18} />
                <span className={menuItemTitleClass}>导入工作区</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={menuItemMintClass}
                onSelect={() => emitToolbarClick("chooseFolder")}
              >
                <FolderPlus size={18} />
                <span className={menuItemTitleClass}>导入文件夹</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={menuItemMintClass}
                onSelect={() => emitToolbarClick("importConfig")}
              >
                <DatabaseZap size={18} />
                <span className={menuItemTitleClass}>导入配置</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className={menuItemCoralClass}>
                  <DatabaseBackup size={18} />
                  <span className={menuItemTitleClass}>导出配置</span>
                  <ChevronRight className={menuItemArrowClass} size={17} />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className={exportMenuClass}>
                  <DropdownMenuItem
                    className={menuItemMauveClass}
                    onSelect={() => emitToolbarClick("exportConfigJson")}
                  >
                    <FileCode size={18} />
                    <span className={menuItemTitleClass}>JSON</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={menuItemMintClass}
                    onSelect={() => emitToolbarClick("exportConfigYml")}
                  >
                    <FileCode size={18} />
                    <span className={menuItemTitleClass}>YML</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className={iconButtonClass}
              aria-label="打开更多操作"
            >
              <LayoutGrid size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={moreMenuClass}>
            <DropdownMenuItem
              className={menuItemMintClass}
              onSelect={() => emitToolbarClick("addGroup")}
            >
              <Grid2X2Plus size={18} />
              <span className={menuItemTitleClass}>添加分组</span>
            </DropdownMenuItem>
            {canEditGroup ? (
              <DropdownMenuItem
                className={menuItemMauveClass}
                onSelect={() => emitToolbarClick("editGroup")}
              >
                <PencilLine size={18} />
                <span className={menuItemTitleClass}>编辑当前分组</span>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              className={menuItemMauveClass}
              onSelect={() => emitToolbarClick("setting")}
            >
              <ListPlus size={18} />
              <span className={menuItemTitleClass}>批量管理</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemMauveClass}
              onSelect={() => emitToolbarClick("preferences")}
            >
              <Settings2 size={18} />
              <span className={menuItemTitleClass}>设置</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemCoralClass}
              onSelect={() => emitToolbarClick("removeGroup")}
            >
              <Trash2 size={18} />
              <span className={menuItemTitleClass}>{removeGroupTitle}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
