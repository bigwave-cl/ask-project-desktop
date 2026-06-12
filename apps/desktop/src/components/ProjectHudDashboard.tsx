"use client";

import { BookOpen, FolderCog, Orbit, VectorSquare } from "lucide-react";
import { CSSProperties, PointerEvent } from "react";

import { cn } from "@/lib/utils";

export type ProjectHudMetricKey = "project" | "folder" | "workspace" | "group";

type ProjectHudDashboardProps = {
  totals: Record<ProjectHudMetricKey, number>;
  visibleMetricKeys: ProjectHudMetricKey[];
  onMetricClick: (key: ProjectHudMetricKey) => void;
};

const rootClass =
  "pointer-events-none absolute bottom-3 left-1/2 z-[4] w-[980px] max-w-[calc(100%_-_64px)] -translate-x-1/2 scale-[var(--cockpit-scale,1)] origin-bottom overflow-visible [perspective-origin:50%_92%] [perspective:1080px] max-[860px]:bottom-1 max-[860px]:max-w-[calc(100%_-_24px)]";
const panelClass =
  "pointer-events-auto relative isolate min-h-[130px] px-[38px] [transform-style:preserve-3d]";
const stageLayerClass =
  "pointer-events-none absolute left-1/2 top-1/2 h-[166px] w-[760px]";
const scanClass = cn(
  stageLayerClass,
  "z-[-1] animate-[apm-hud-scan_5.8s_linear_infinite] rounded-t-[130px] rounded-b-[32px] bg-apm-hud-scan opacity-[.34]"
);
const bodyClass =
  "relative z-[2] mx-auto grid min-h-[118px] w-[min(540px,100%)] translate-y-3 grid-cols-[minmax(0,1fr)] items-stretch [transform-style:preserve-3d]";
const metricsClass =
  "grid grid-cols-[repeat(var(--hud-metric-count,4),minmax(0,1fr))] items-end gap-3 max-[860px]:gap-2";
const cardClass =
  "relative grid min-h-[94px] min-w-0 cursor-pointer grid-cols-[34px_minmax(0,1fr)] grid-rows-[1fr_6px] items-center gap-2.5 overflow-hidden rounded-xl border border-apm-card-accent-34 bg-apm-hud-card p-3 shadow-apm-hud-card backdrop-blur-md transition-[transform,border-color,box-shadow] duration-[220ms] before:pointer-events-none before:absolute before:inset-0 before:bg-apm-hud-card-overlay before:opacity-[.56] hover:-translate-y-1.5 hover:border-apm-card-accent-58 hover:shadow-apm-hud-card-hover";
const iconClass =
  "relative z-[1] grid h-[34px] w-[34px] place-items-center rounded-[10px] border border-apm-card-accent-42 bg-apm-hud-icon text-[var(--card-accent)] shadow-apm-hud-icon";
const contentClass = "relative z-[1] grid min-w-0 gap-0.5";
const labelClass =
  "overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-[1.2] text-[color-mix(in_srgb,var(--apm-faded-letter)_68%,transparent)]";
const valueClass =
  "text-[clamp(24px,2.7vw,34px)] font-[780] leading-none text-[var(--apm-swan-dive)] [font-variant-numeric:tabular-nums] [text-shadow:0_0_18px_color-mix(in_srgb,var(--card-accent)_28%,transparent)]";
const barClass =
  "relative z-[1] col-span-full h-1.5 overflow-hidden rounded-full bg-[rgba(0,0,0,.28)]";
const barValueClass =
  "block h-full w-[calc(var(--metric-level)*100%)] rounded-[inherit] bg-apm-hud-meter shadow-apm-hud-meter transition-[width] duration-[360ms]";
const footerClass =
  "relative z-[2] mx-auto mt-2 grid w-[min(560px,76%)] grid-cols-[1fr_90px_1fr] gap-3";
const footerLineClass =
  "h-0.5 rounded-full bg-apm-line-hud-mint";
const footerCenterLineClass =
  "bg-apm-line-hud-riviera";

const metricOptions = [
  { key: "project", label: "项目总数", icon: VectorSquare, accent: "var(--apm-radio-silence)" },
  { key: "folder", label: "文件夹", icon: FolderCog, accent: "var(--apm-riviera)" },
  { key: "workspace", label: "工作区", icon: BookOpen, accent: "var(--apm-mamas-new-bag)" },
  { key: "group", label: "分组", icon: Orbit, accent: "var(--apm-spring-awakening)" },
] satisfies {
  key: ProjectHudMetricKey;
  label: string;
  icon: typeof VectorSquare;
  accent: string;
}[];

const stageLayerStyle = {
  maskImage:
    "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
  WebkitMaskComposite: "source-in",
} as CSSProperties;

const panelBaseStyle = {
  ...stageLayerStyle,
  background:
    "radial-gradient(ellipse at 50% -18%, rgba(128, 214, 255, .2), transparent 56%), radial-gradient(ellipse at 50% 108%, color-mix(in srgb, var(--apm-riviera) 18%, transparent), transparent 58%), linear-gradient(180deg, rgba(7, 16, 30, .5), rgba(3, 8, 18, .82)), repeating-linear-gradient(90deg, rgba(112, 225, 255, .035) 0 1px, transparent 1px 22px)",
  boxShadow:
    "0 24px 58px rgba(0, 0, 0, .38), 0 0 34px rgba(82, 151, 255, .12), 0 0 52px color-mix(in srgb, var(--apm-riviera) 12%, transparent), inset 0 1px 0 rgba(255, 255, 255, .12), inset 0 18px 36px rgba(106, 226, 255, .05), inset 0 0 42px rgba(81, 184, 255, .08)",
  transform: "translate3d(-50%, var(--cockpit-stage-y, 38px), -116px) rotateX(58deg) skewX(-4deg)",
} as CSSProperties;

const panelGlowStyle = {
  ...stageLayerStyle,
  background:
    "radial-gradient(circle at var(--cockpit-x, 50%) var(--cockpit-y, 20%), rgba(145, 233, 255, .18), transparent 22%), linear-gradient(90deg, transparent 10%, rgba(104, 221, 255, .38), color-mix(in srgb, var(--apm-riviera) 30%, transparent), transparent 90%)",
  backgroundSize: "auto, 100% 1px",
  backgroundPosition: "center, bottom",
  backgroundRepeat: "no-repeat",
  mixBlendMode: "screen",
  opacity: 0.78,
  boxShadow: "inset 0 -18px 28px rgba(0, 0, 0, .28), 0 22px 42px rgba(0, 0, 0, .36)",
  transform: "translate3d(-50%, var(--cockpit-stage-y, 38px), -104px) rotateX(58deg) skewX(-4deg)",
} as CSSProperties;

const scanStyle = {
  ...stageLayerStyle,
  transform: "translate3d(-50%, var(--cockpit-stage-y, 38px), -96px) rotateX(58deg) skewX(-4deg)",
} as CSSProperties;

const panelStyle = {
  "--cockpit-x": "50%",
  "--cockpit-y": "20%",
  "--cockpit-stage-y": "38px",
} as CSSProperties;

const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  target.style.setProperty("--cockpit-x", `${x * 100}%`);
  target.style.setProperty("--cockpit-y", `${y * 100}%`);
};

const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
  const target = event.currentTarget;
  target.style.setProperty("--cockpit-x", "50%");
  target.style.setProperty("--cockpit-y", "18%");
};

export function ProjectHudDashboard({
  totals,
  visibleMetricKeys,
  onMetricClick,
}: ProjectHudDashboardProps) {
  const metricItems = metricOptions
    .map((item) => ({ ...item, value: totals[item.key] }))
    .filter((item) => visibleMetricKeys.includes(item.key));
  const maxMetric = Math.max(1, ...metricItems.map((item) => item.value));

  return (
    <section className={rootClass} aria-label="项目统计仪表盘">
      <div
        className={panelClass}
        style={panelStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={stageLayerClass} style={panelBaseStyle} aria-hidden="true" />
        <div className={stageLayerClass} style={panelGlowStyle} aria-hidden="true" />
        <div className={scanClass} style={scanStyle} aria-hidden="true" />

        <div className={bodyClass}>
          <div
            className={metricsClass}
            style={{ "--hud-metric-count": metricItems.length || 1 } as CSSProperties}
          >
            {metricItems.map((metric) => {
              const Icon = metric.icon;
              const level = Math.max(0.18, Math.min(1, metric.value / maxMetric)).toFixed(3);
              return (
                <article
                  className={cardClass}
                  key={metric.key}
                  style={
                    {
                      "--card-accent": metric.accent,
                      "--metric-level": level,
                    } as CSSProperties
                  }
                  onClick={() => onMetricClick(metric.key)}
                >
                  <div className={iconClass}>
                    <Icon size={18} />
                  </div>
                  <div className={contentClass}>
                    <span className={labelClass}>{metric.label}</span>
                    <strong className={valueClass}>{metric.value}</strong>
                  </div>
                  <div className={barClass} aria-hidden="true">
                    <span className={barValueClass} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <footer className={footerClass} aria-hidden="true">
          <span className={footerLineClass} />
          <span className={cn(footerLineClass, footerCenterLineClass)} />
          <span className={footerLineClass} />
        </footer>
      </div>
    </section>
  );
}
