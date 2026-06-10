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
      <DialogContent className="apm-preferences">
        <DialogHeader className="apm-preferences__header">
          <div>
            <span>Console Preferences</span>
            <DialogTitle asChild>
              <h2>设置</h2>
            </DialogTitle>
            <DialogDescription className="apm-preferences__description">
              管理项目控制台启动行为、底部 HUD 与新手引导。
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className="apm-preferences__icon-button"
              aria-label="关闭设置"
            >
              <X size={18} />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="apm-preferences__body">
          <article className="apm-preference-card">
            <div className="apm-preference-card__copy">
              <span className="apm-preference-card__icon" aria-hidden="true">
                <Rocket size={18} />
              </span>
              <div>
                <h3>默认激活 Panel</h3>
                <p>打开 Cursor / VS Code 项目时自动唤起项目控制台。</p>
              </div>
            </div>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className={draft.autoOpenPanel ? "apm-switch apm-switch--checked" : "apm-switch"}
              aria-label="默认激活 Panel"
              aria-pressed={draft.autoOpenPanel}
              onClick={updateAutoOpenPanel}
            >
              <span />
            </Button>
          </article>

          <article className="apm-preference-card apm-preference-card--stack">
            <div className="apm-preference-card__copy">
              <span className="apm-preference-card__icon" aria-hidden="true">
                <LayoutDashboard size={18} />
              </span>
              <div>
                <h3>底部 HUD</h3>
                <p>控制底部统计仪表是否显示，以及保留哪些统计项。</p>
              </div>
              <Button
                type="button"
                variant="projectPlain"
                size="projectPlain"
                className={draft.hud.visible ? "apm-switch apm-switch--checked" : "apm-switch"}
                aria-label="显示底部 HUD"
                aria-pressed={draft.hud.visible}
                onClick={updateHudVisible}
              >
                <span />
              </Button>
            </div>

            <div className={draft.hud.visible ? "apm-hud-options" : "apm-hud-options apm-hud-options--disabled"}>
              {hudMetricOptions.map((option) => {
                const active = draft.hud.metrics[option.key];
                const Icon = active ? CheckSquare : Square;
                return (
                  <Button
                    key={option.key}
                    type="button"
                    variant="projectPlain"
                    size="projectPlain"
                    className={active ? "apm-hud-option apm-hud-option--active" : "apm-hud-option"}
                    disabled={!draft.hud.visible}
                    onClick={() => toggleHudMetric(option.key)}
                  >
                    <Icon size={18} />
                    <span>{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </article>

          <article className="apm-preference-card">
            <div className="apm-preference-card__copy">
              <span className="apm-preference-card__icon" aria-hidden="true">
                <Compass size={18} />
              </span>
              <div>
                <h3>新手引导</h3>
                <p>重新查看面板自动打开、状态栏快捷入口和设置入口说明。</p>
              </div>
            </div>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className="apm-preference-card__action"
              onClick={openGuide}
            >
              <PlayCircle size={17} />
              查看引导
            </Button>
          </article>
        </div>

        <DialogFooter className="apm-preferences__footer">
          <Button
            type="button"
            variant="projectPlain"
            size="projectPlain"
            className="apm-preferences__text-button"
            onClick={resetDraft}
          >
            恢复默认
          </Button>
          <div>
            <DialogClose asChild>
              <Button type="button" variant="projectPlain" size="projectPlain" className="apm-preferences__text-button">
                取消
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="projectPlain"
              size="projectPlain"
              className="apm-preferences__save-button"
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
