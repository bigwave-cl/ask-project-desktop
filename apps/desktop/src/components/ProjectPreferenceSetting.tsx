"use client";

import { CheckSquare, Compass, LayoutDashboard, PlayCircle, Rocket, Square, X } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

export type ProjectHudMetricKey = "project" | "folder" | "workspace" | "group";

export type ProjectPreferencesModel = {
  autoOpenPanel: boolean;
  hud: {
    visible: boolean;
    metrics: Record<ProjectHudMetricKey, boolean>;
  };
  onboarding: {
    seen: boolean;
  };
};

type ProjectPreferenceSettingProps = {
  open: boolean;
  preferences: ProjectPreferencesModel;
  onOpenChange: (open: boolean) => void;
  onSavePreferences: (preferences: ProjectPreferencesModel) => void | Promise<void>;
  onOpenGuide?: () => void;
};

const defaultPreferences: ProjectPreferencesModel = {
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

const hudMetricOptions: { key: ProjectHudMetricKey; label: string }[] = [
  { key: "project", label: "项目总数" },
  { key: "folder", label: "文件夹" },
  { key: "workspace", label: "工作区" },
  { key: "group", label: "分组" },
];

const preferencesDialogClass =
  "grid max-h-[calc(100vh-48px)] w-[min(620px,calc(100vw-48px))] overflow-hidden rounded-[18px_8px_18px_8px] border border-[color-mix(in_srgb,var(--apm-radio-silence)_34%,transparent)] bg-[radial-gradient(circle_at_18%_0%,color-mix(in_srgb,var(--apm-radio-silence)_20%,transparent),transparent_38%),radial-gradient(circle_at_92%_100%,color-mix(in_srgb,var(--apm-mamas-new-bag)_14%,transparent),transparent_42%),linear-gradient(180deg,rgba(11,24,28,.98),rgba(4,8,14,.98))] text-[var(--apm-text-main)] shadow-[0_26px_64px_rgba(0,0,0,.58),0_0_32px_color-mix(in_srgb,var(--apm-radio-silence)_16%,transparent),inset_0_1px_0_rgba(255,255,255,.1)]";

const preferencesHeaderClass =
  "relative z-[1] flex items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--apm-radio-silence)_22%,transparent)] px-6 pb-4 pt-[22px]";

const preferencesEyebrowClass =
  "mb-1 block text-[11px] font-extrabold uppercase leading-[1.2] tracking-[.08em] text-[color-mix(in_srgb,var(--apm-radio-silence)_72%,transparent)]";

const preferencesTitleClass = "m-0 text-2xl leading-[1.2] tracking-normal";

const preferencesCloseButtonClass =
  "inline-grid h-[38px] w-[38px] place-items-center rounded-[12px_6px_12px_6px] border-0 bg-transparent text-[var(--apm-text-muted)] shadow-none hover:bg-[color-mix(in_srgb,var(--apm-radio-silence)_10%,transparent)] hover:text-[var(--apm-text-main)] focus-visible:border-transparent focus-visible:bg-[color-mix(in_srgb,var(--apm-radio-silence)_10%,transparent)] focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_color-mix(in_srgb,var(--apm-radio-silence)_28%,transparent),0_0_18px_color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent)]";

const preferencesBodyClass = "relative z-[1] grid gap-[14px] overflow-y-auto px-6 pb-5 pt-[18px]";

const preferenceCardClass =
  "flex min-h-[86px] items-center justify-between gap-[18px] rounded-[12px_6px_12px_6px] border border-[color-mix(in_srgb,var(--apm-radio-silence)_22%,transparent)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--apm-radio-silence)_8%,transparent),transparent_42%),rgba(255,255,255,.035)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]";

const preferenceCopyClass = "grid min-w-0 grid-cols-[34px_minmax(0,1fr)] items-center gap-3";

const preferenceStackCopyClass = "grid-cols-[34px_minmax(0,1fr)_auto]";

const preferenceIconClass =
  "grid h-[34px] w-[34px] place-items-center rounded-[10px_5px_10px_5px] border border-[color-mix(in_srgb,var(--apm-radio-silence)_34%,transparent)] bg-[rgba(3,10,12,.58)] text-[var(--apm-radio-silence)] [filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--apm-radio-silence)_32%,transparent))]";

const preferenceHeadingClass = "mb-1 mt-0 text-base leading-[1.3] tracking-normal";

const preferenceDescriptionClass =
  "m-0 text-[13px] leading-[1.55] text-[color-mix(in_srgb,var(--apm-faded-letter)_72%,transparent)]";

const hudOptionsClass =
  "grid grid-cols-4 gap-2.5 pl-[46px] pr-[66px] transition-opacity duration-[160ms]";

const hudOptionClass =
  "inline-grid min-h-[42px] w-full min-w-0 grid-cols-[18px_minmax(0,1fr)] items-center gap-[7px] rounded-[9px_5px_9px_5px] border border-[color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent)] bg-[rgba(5,13,18,.48)] px-3 text-[color-mix(in_srgb,var(--apm-faded-letter)_78%,transparent)] shadow-none transition-[border-color,color,background,box-shadow] duration-[160ms] hover:border-[color-mix(in_srgb,var(--apm-radio-silence)_38%,transparent)] hover:bg-[color-mix(in_srgb,var(--apm-radio-silence)_10%,rgba(5,13,18,.62))] hover:text-[var(--apm-text-main)] disabled:cursor-not-allowed disabled:opacity-100";

const hudOptionActiveClass =
  "border-[color-mix(in_srgb,var(--apm-radio-silence)_46%,transparent)] ![background:linear-gradient(90deg,color-mix(in_srgb,var(--apm-radio-silence)_13%,transparent),transparent_70%),rgba(5,13,18,.62)] text-[var(--apm-text-main)] shadow-[0_0_16px_color-mix(in_srgb,var(--apm-radio-silence)_12%,transparent)]";

const hudOptionTextClass = "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-extrabold tracking-normal";

const preferenceActionButtonClass =
  "inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[12px_6px_12px_6px] border border-[color-mix(in_srgb,currentColor_22%,transparent)] ![background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02)),rgba(5,13,18,.68)] px-3.5 text-[var(--apm-mamas-new-bag)] shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_color-mix(in_srgb,currentColor_26%,transparent),0_0_18px_color-mix(in_srgb,currentColor_18%,transparent)]";

const preferencesFooterClass =
  "relative z-[1] flex items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent)] px-6 pb-[22px] pt-4";

const clonePreferences = (preferences: ProjectPreferencesModel) =>
  JSON.parse(JSON.stringify(preferences)) as ProjectPreferencesModel;

export function ProjectPreferenceSetting({
  open,
  preferences,
  onOpenChange,
  onSavePreferences,
  onOpenGuide,
}: ProjectPreferenceSettingProps) {
  const [draft, setDraft] = useState<ProjectPreferencesModel>(() => clonePreferences(preferences));

  const resetDraft = () => {
    setDraft(clonePreferences(defaultPreferences));
  };

  const updateAutoOpenPanel = () => {
    setDraft((current) => ({
      ...current,
      autoOpenPanel: !current.autoOpenPanel,
    }));
  };

  const updateHudVisible = () => {
    setDraft((current) => {
      const visible = !current.hud.visible;
      return {
        ...current,
        hud: {
          visible,
          metrics: visible ? clonePreferences(defaultPreferences).hud.metrics : current.hud.metrics,
        },
      };
    });
  };

  const toggleHudMetric = (key: ProjectHudMetricKey) => {
    setDraft((current) => ({
      ...current,
      hud: {
        ...current.hud,
        metrics: {
          ...current.hud.metrics,
          [key]: !current.hud.metrics[key],
        },
      },
    }));
  };

  const openGuide = () => {
    onOpenChange(false);
    onOpenGuide?.();
  };

  const savePreferences = async () => {
    await onSavePreferences(clonePreferences(draft));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent forceMount variant="custom" className={preferencesDialogClass}>
        <DialogHeader className={preferencesHeaderClass}>
          <div>
            <span className={preferencesEyebrowClass}>Console Preferences</span>
            <DialogTitle asChild>
              <h2 className={preferencesTitleClass}>设置</h2>
            </DialogTitle>
            <DialogDescription className="sr-only">
              管理项目控制台启动行为、底部 HUD 与新手引导。
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className={preferencesCloseButtonClass}
              aria-label="关闭设置"
            >
              <X size={18} />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className={preferencesBodyClass}>
          <article className={preferenceCardClass}>
            <div className={preferenceCopyClass}>
              <span className={preferenceIconClass} aria-hidden="true">
                <Rocket size={18} />
              </span>
              <div>
                <h3 className={preferenceHeadingClass}>默认激活 Panel</h3>
                <p className={preferenceDescriptionClass}>打开 Cursor / VS Code 项目时自动唤起项目控制台。</p>
              </div>
            </div>
            <Switch
              variant="project"
              tone="mint"
              aria-label="默认激活 Panel"
              checked={draft.autoOpenPanel}
              onCheckedChange={updateAutoOpenPanel}
            />
          </article>

          <article className={cn(preferenceCardClass, "grid")}>
            <div className={cn(preferenceCopyClass, preferenceStackCopyClass)}>
              <span className={preferenceIconClass} aria-hidden="true">
                <LayoutDashboard size={18} />
              </span>
              <div>
                <h3 className={preferenceHeadingClass}>底部 HUD</h3>
                <p className={preferenceDescriptionClass}>控制底部统计仪表是否显示，以及保留哪些统计项。</p>
              </div>
              <Switch
                variant="project"
                tone="cyan"
                aria-label="显示底部 HUD"
                checked={draft.hud.visible}
                onCheckedChange={updateHudVisible}
              />
            </div>

            <div className={cn(hudOptionsClass, !draft.hud.visible && "opacity-[.42]")}>
              {hudMetricOptions.map((option) => {
                const active = draft.hud.metrics[option.key];
                const Icon = active ? CheckSquare : Square;
                return (
                  <Button
                    key={option.key}
                    type="button"
                    variant="projectPlain"
                    size="projectPlain"
                    className={cn(hudOptionClass, active && hudOptionActiveClass)}
                    disabled={!draft.hud.visible}
                    onClick={() => toggleHudMetric(option.key)}
                  >
                    <Icon size={18} />
                    <span className={hudOptionTextClass}>{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </article>

          <article className={preferenceCardClass}>
            <div className={preferenceCopyClass}>
              <span className={preferenceIconClass} aria-hidden="true">
                <Compass size={18} />
              </span>
              <div>
                <h3 className={preferenceHeadingClass}>新手引导</h3>
                <p className={preferenceDescriptionClass}>重新查看面板自动打开、状态栏快捷入口和设置入口说明。</p>
              </div>
            </div>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className={cn(preferenceActionButtonClass, "min-w-[118px] flex-none")}
              onClick={openGuide}
            >
              <PlayCircle size={17} />
              查看引导
            </Button>
          </article>
        </div>

        <DialogFooter className={preferencesFooterClass}>
          <Button
            type="button"
            variant="projectPlain"
            size="projectPlain"
            className={preferenceActionButtonClass}
            onClick={resetDraft}
          >
            恢复默认
          </Button>
          <div className="flex gap-2.5">
            <DialogClose asChild>
              <Button type="button" variant="projectPlain" size="projectPlain" className={preferenceActionButtonClass}>
                取消
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className={cn(preferenceActionButtonClass, "text-[var(--apm-radio-silence)]")}
              onClick={savePreferences}
            >
              保存
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
