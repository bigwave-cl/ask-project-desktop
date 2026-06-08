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
} from "@/components/ui/dropdown-menu";

export type ProjectToolbarAction =
  | "chooseWorkspace"
  | "chooseFolder"
  | "importConfig"
  | "exportConfigJson"
  | "exportConfigYml"
  | "addGroup"
  | "setting"
  | "preferences"
  | "removeGroup";

type ProjectCommandHeaderProps = {
  searchKeyword: string;
  removeGroupTitle?: string;
  onSearchKeywordChange: (value: string) => void;
  onToolbarClick: (type: ProjectToolbarAction) => void | Promise<void>;
};

export function ProjectCommandHeader({
  searchKeyword,
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
            <DropdownMenuContent className="apm-import-menu">
              <DropdownMenuItem
                className="apm-menu__item--mauve"
                onSelect={() => emitToolbarClick("chooseWorkspace")}
              >
                <BookPlus size={18} />
                <span className="apm-menu__item-title">导入工作区</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="apm-menu__item--mint"
                onSelect={() => emitToolbarClick("chooseFolder")}
              >
                <FolderPlus size={18} />
                <span className="apm-menu__item-title">导入文件夹</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="apm-menu__item--mint"
                onSelect={() => emitToolbarClick("importConfig")}
              >
                <DatabaseZap size={18} />
                <span className="apm-menu__item-title">导入配置</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="apm-menu__item--coral">
                  <DatabaseBackup size={18} />
                  <span className="apm-menu__item-title">导出配置</span>
                  <ChevronRight className="apm-menu__item-arrow" size={17} />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="apm-export-menu">
                  <DropdownMenuItem
                    className="apm-menu__item--mauve"
                    onSelect={() => emitToolbarClick("exportConfigJson")}
                  >
                    <FileCode size={18} />
                    <span className="apm-menu__item-title">JSON</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="apm-menu__item--mint"
                    onSelect={() => emitToolbarClick("exportConfigYml")}
                  >
                    <FileCode size={18} />
                    <span className="apm-menu__item-title">YML</span>
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
          <DropdownMenuContent className="apm-command__more-menu">
            <DropdownMenuItem
              className="apm-menu__item--mint"
              onSelect={() => emitToolbarClick("addGroup")}
            >
              <Grid2X2Plus size={18} />
              <span className="apm-menu__item-title">添加分组</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="apm-menu__item--mauve"
              onSelect={() => emitToolbarClick("setting")}
            >
              <ListPlus size={18} />
              <span className="apm-menu__item-title">批量管理</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="apm-menu__item--mauve"
              onSelect={() => emitToolbarClick("preferences")}
            >
              <Settings2 size={18} />
              <span className="apm-menu__item-title">设置</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="apm-menu__item--coral"
              onSelect={() => emitToolbarClick("removeGroup")}
            >
              <Trash2 size={18} />
              <span className="apm-menu__item-title">{removeGroupTitle}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
