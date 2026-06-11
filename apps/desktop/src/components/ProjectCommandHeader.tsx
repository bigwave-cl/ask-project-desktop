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
    <header className="apm-command">
      <div className="apm-command__substrate" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="apm-command__identity">
        <div className="apm-command__sigil" aria-hidden="true">
          <Image
            className="apm-command__sigil-logo"
            src="/logo.svg"
            alt=""
            width={54}
            height={54}
            draggable={false}
            priority
          />
        </div>
        <div>
          <div className="apm-command__eyebrow">Ling Shu Console</div>
          <h1 className="apm-command__sr-title">灵枢控制台</h1>
          <Image
            className="apm-command__brush-title"
            src="/brush-title.svg"
            alt="灵枢控制台"
            width={242}
            height={45}
            draggable={false}
          />
        </div>
      </div>
      <div className="apm-command__search">
        <div className="apm-command__search-field">
          <Search className="apm-command__search-icon" size={18} aria-hidden="true" />
          <input
            id="apm-command-search"
            name="apm-command-search"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
            placeholder="搜索项目、路径、分组"
            aria-label="搜索项目、路径、分组"
          />
          {searchKeyword ? (
            <button
              className="apm-command__search-clear"
              onClick={() => onSearchKeywordChange("")}
              aria-label="清空搜索"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>
      <div className="apm-command__actions">
        <div className="apm-import-control">
          <button
            className="apm-import-control__primary"
            onClick={() => emitToolbarClick("chooseWorkspace")}
          >
            <BookPlus size={18} />
            导入工作区
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="apm-import-control__toggle" aria-label="展开导入选项">
                <ChevronDown size={18} />
              </button>
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
            <button className="apm-command__icon-button" aria-label="打开更多操作">
              <LayoutGrid size={18} />
            </button>
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
