"use client";

import { Check, ChevronLeft, ChevronRight, Compass, Dock, Rocket, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ProjectOnboardingGuideProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void | Promise<void>;
};

const slides = [
  {
    key: "activation",
    accentClass: "[--slide-accent:var(--apm-radio-silence)]",
    icon: Rocket,
    title: "面板可以自动唤起，也可以保持安静",
    description: "默认会在打开项目后自动进入控制台。偏好设置里可以关闭它，之后项目启动时不会主动打开 Panel。",
  },
  {
    key: "statusbar",
    accentClass: "[--slide-accent:var(--apm-mamas-new-bag)]",
    icon: Dock,
    title: "右下角有快捷入口",
    description: "状态栏右下角的 Ask Project Manage 可以快速打开或关闭面板，适合临时切换，不必每次打开命令面板。",
    image: "/statusbar-guide.png",
  },
  {
    key: "replay",
    accentClass: "[--slide-accent:var(--apm-riviera)]",
    icon: Compass,
    title: "之后也能再次查看",
    description: "右上角设置按钮里保留了新手引导入口。看过一次后不会自动弹出，但你随时可以从设置里重新打开。",
  },
];

export function ProjectOnboardingGuide({
  open,
  onOpenChange,
  onFinish,
}: ProjectOnboardingGuideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGuideMounted, setIsGuideMounted] = useState(open);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const isLastSlide = currentIndex === slides.length - 1;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (open) {
        setIsGuideMounted(true);
        setCurrentIndex(0);
        setPreviewImage("");
        setPreviewOpen(false);
        return;
      }
      setIsGuideMounted(false);
    }, open ? 0 : 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (previewOpen || !previewImage) return;
    const timer = window.setTimeout(() => {
      setPreviewImage("");
    }, 220);
    return () => window.clearTimeout(timer);
  }, [previewImage, previewOpen]);

  const finishGuide = async () => {
    await onFinish();
    onOpenChange(false);
  };

  return (
    <>
      {isGuideMounted ? (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          forceMount
          variant="custom"
          className={cn(
            "fixed left-1/2 top-1/2 z-[72] grid max-h-[calc(100vh-48px)] w-[min(760px,calc(100vw-48px))] grid-rows-[auto_286px_auto_auto] overflow-hidden rounded-[22px_9px_22px_9px] border border-apm-radio-38 bg-[linear-gradient(180deg,rgba(11,24,31,.98),rgba(3,8,15,.98))] text-[var(--apm-text-main)] shadow-[0_30px_74px_rgba(0,0,0,.62),0_0_42px_color-mix(in_srgb,var(--apm-radio-silence)_16%,transparent),inset_0_1px_0_rgba(255,255,255,.12)] outline-none [contain:layout_paint]",
            "before:pointer-events-none before:absolute before:inset-x-[-16%] before:top-[-34%] before:h-[260px] before:bg-[radial-gradient(ellipse_at_50%_78%,rgba(120,240,224,.2),transparent_42%),repeating-linear-gradient(90deg,rgba(255,255,255,.05)_0_1px,transparent_1px_30px)] before:opacity-70 before:[filter:blur(.4px)] before:[transform:perspective(540px)_rotateX(62deg)]"
          )}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />

          <DialogHeader className="relative z-[1] flex items-center justify-between gap-4 border-b border-apm-radio-20 px-7 pb-[18px] pt-[26px]">
            <div>
              <span className="mb-[5px] block text-[11px] font-black uppercase tracking-[.1em] text-[color-mix(in_srgb,var(--apm-radio-silence)_72%,transparent)]">
                First Flight
              </span>
              <DialogTitle asChild>
                <h2 className="m-0 text-[26px] leading-[1.2] tracking-normal">欢迎来到灵枢控制台</h2>
              </DialogTitle>
              <DialogDescription className="sr-only">
                新手引导会介绍面板自动唤起、状态栏快捷入口和再次查看入口。
              </DialogDescription>
            </div>
            <div className="min-w-[68px] rounded-[12px_6px_12px_6px] border border-apm-radio-26 bg-[rgba(5,14,18,.62)] px-3 py-2 text-center font-extrabold text-[var(--apm-radio-silence)]">
              {currentIndex + 1} / {slides.length}
            </div>
          </DialogHeader>

          <div className="relative z-[1] h-[286px] overflow-hidden p-7 [contain:layout_paint]">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <article
                  aria-hidden={index !== currentIndex}
                  className={cn(
                    "absolute inset-7 grid grid-cols-[220px_minmax(0,1fr)] items-center gap-7 transition-opacity duration-200 ease-out will-change-[opacity] max-[720px]:grid-cols-1 max-[720px]:content-center max-[720px]:gap-[18px]",
                    index === currentIndex
                      ? "pointer-events-auto opacity-100"
                      : "pointer-events-none opacity-0"
                  )}
                  key={slide.key}
                >
                  <div
                    className={cn(
                      slide.accentClass,
                      "relative grid min-h-[188px] place-items-center rounded-full border border-slide-accent-34 bg-[radial-gradient(circle_at_50%_44%,color-mix(in_srgb,var(--slide-accent)_22%,transparent),transparent_38%),linear-gradient(180deg,rgba(255,255,255,.07),rgba(0,0,0,.08))] text-[var(--slide-accent)] shadow-[0_18px_42px_rgba(0,0,0,.32),0_0_28px_color-mix(in_srgb,var(--slide-accent)_18%,transparent),inset_0_1px_0_rgba(255,255,255,.1)] max-[720px]:min-h-[148px] max-[720px]:w-[180px] max-[720px]:max-w-[180px] max-[720px]:justify-self-center"
                    )}
                  >
                    <Icon className="relative z-[2] drop-shadow-[0_0_18px_currentColor]" size={58} />
                    <span className="absolute inset-[26px] rounded-full border border-slide-accent-36 animate-spin" />
                    <span className="absolute inset-[52px] rounded-full border border-slide-accent-36 animate-[spin_6s_linear_infinite_reverse]" />
                  </div>
                  <div className="max-[720px]:text-center">
                    <h3 className="mb-3 mt-0 text-[28px] leading-[1.18] tracking-normal">{slide.title}</h3>
                    <p className="m-0 max-w-[420px] text-[15px] leading-[1.8] text-[color-mix(in_srgb,var(--apm-faded-letter)_76%,transparent)] max-[720px]:max-w-none">
                      {slide.description}
                    </p>
                    {slide.image ? (
                      <Button
                        aria-label="查看状态栏快捷入口大图"
                        className="relative mt-[14px] block w-[min(320px,100%)] cursor-zoom-in overflow-hidden rounded-[14px_7px_14px_7px] border border-apm-mauve-36 bg-[rgba(3,8,15,.72)] p-0 shadow-[0_16px_34px_rgba(0,0,0,.32),0_0_22px_color-mix(in_srgb,var(--apm-mamas-new-bag)_12%,transparent),inset_0_1px_0_rgba(255,255,255,.08)] max-[720px]:mx-auto [&_img]:aspect-[16/6] [&_img]:w-full [&_img]:object-cover [&_img]:object-right-bottom [&_img]:opacity-90 [&_img]:transition [&_img]:duration-200 hover:[&_img]:scale-[1.035] hover:[&_img]:opacity-100"
                        size="projectPlain"
                        type="button"
                        variant="projectPlain"
                        onClick={() => {
                          setPreviewImage(slide.image);
                          setPreviewOpen(true);
                        }}
                      >
                        <Image
                          alt="状态栏快捷入口位置示意图"
                          draggable={false}
                          height={1380}
                          src={slide.image}
                          width={2560}
                        />
                        <span className="absolute bottom-2 right-2 inline-flex items-center gap-[5px] rounded-full border border-apm-mauve-28 bg-[rgba(5,8,14,.78)] px-2 py-1.5 text-[11px] font-extrabold leading-none text-[var(--apm-text-main)] shadow-[0_0_16px_color-mix(in_srgb,var(--apm-mamas-new-bag)_14%,transparent)]">
                          <Search size={15} />
                          点击查看大图
                        </span>
                      </Button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="relative z-[1] flex justify-center gap-[9px] px-7 pb-[18px]" aria-label="引导进度">
            {slides.map((slide, index) => (
              <Button
                aria-label={`查看第 ${index + 1} 页`}
                className={cn(
                  "h-1.5 w-11 rounded-full border-0 bg-[color-mix(in_srgb,var(--apm-faded-letter)_24%,transparent)] transition-[background,box-shadow] duration-150",
                  index === currentIndex &&
                    "bg-[var(--apm-radio-silence)] shadow-[0_0_14px_color-mix(in_srgb,var(--apm-radio-silence)_42%,transparent)]"
                )}
                key={slide.key}
                size="projectPlain"
                type="button"
                variant="projectPlain"
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <footer className="relative z-[1] flex items-center justify-between gap-4 border-t border-apm-radio-18 px-7 pb-[26px] pt-[18px]">
            <Button
              className="inline-flex min-h-[38px] min-w-[96px] items-center justify-center gap-1.5 rounded-[12px_6px_12px_6px] border border-apm-current-22 bg-transparent px-[14px] text-sm font-extrabold text-[color-mix(in_srgb,var(--apm-swan-dive)_76%,transparent)] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={currentIndex === 0}
              size="projectPlain"
              type="button"
              variant="projectPlain"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            >
              <ChevronLeft size={18} />
              上一页
            </Button>
            <div className="flex gap-2.5">
              {isLastSlide ? (
                <Button
                  className="inline-flex min-h-[38px] min-w-[104px] items-center justify-center gap-1.5 rounded-[12px_6px_12px_6px] border border-apm-current-22 bg-[linear-gradient(135deg,var(--apm-radio-silence),var(--apm-swan-dive))] px-[14px] text-sm font-extrabold text-[#061211] shadow-[0_0_18px_color-mix(in_srgb,var(--apm-radio-silence)_24%,transparent),inset_0_1px_0_rgba(255,255,255,.34)]"
                  size="projectPlain"
                  type="button"
                  variant="projectPlain"
                  onClick={finishGuide}
                >
                  我知道了
                  <Check size={18} />
                </Button>
              ) : (
                <Button
                  className="inline-flex min-h-[38px] min-w-[104px] items-center justify-center gap-1.5 rounded-[12px_6px_12px_6px] border border-apm-current-22 bg-[linear-gradient(135deg,var(--apm-radio-silence),var(--apm-swan-dive))] px-[14px] text-sm font-extrabold text-[#061211] shadow-[0_0_18px_color-mix(in_srgb,var(--apm-radio-silence)_24%,transparent),inset_0_1px_0_rgba(255,255,255,.34)]"
                  size="projectPlain"
                  type="button"
                  variant="projectPlain"
                  onClick={() => setCurrentIndex((index) => Math.min(slides.length - 1, index + 1))}
                >
                  下一页
                  <ChevronRight size={18} />
                </Button>
              )}
            </div>
          </footer>
        </DialogContent>
      </Dialog>
      ) : null}

      {previewImage ? (
      <Dialog open={previewOpen} onOpenChange={(nextOpen) => setPreviewOpen(nextOpen)}>
        <DialogContent forceMount variant="custom" className="fixed left-1/2 top-1/2 z-[74] w-[min(980px,calc(100vw-48px))] overflow-hidden rounded-[18px_8px_18px_8px] border border-apm-radio-34 bg-[linear-gradient(180deg,rgba(11,24,31,.98),rgba(3,8,15,.98))] shadow-[0_28px_70px_rgba(0,0,0,.64),0_0_34px_color-mix(in_srgb,var(--apm-radio-silence)_14%,transparent)] outline-none">
          <header className="flex items-center justify-between border-b border-apm-radio-20 px-[18px] py-3 pr-[14px] text-[var(--apm-text-main)]">
            <DialogTitle asChild>
              <span className="text-[11px] font-black uppercase tracking-[.1em] text-[color-mix(in_srgb,var(--apm-radio-silence)_78%,transparent)]">
                Quick Toggle
              </span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              状态栏 Ask Project Manage 快捷入口大图
            </DialogDescription>
            <DialogClose asChild>
              <Button
                aria-label="关闭大图"
                className="inline-grid h-9 w-9 place-items-center rounded-[10px_5px_10px_5px] text-[var(--apm-text-muted)] hover:bg-[color-mix(in_srgb,var(--apm-radio-silence)_10%,transparent)] hover:text-[var(--apm-text-main)]"
                size="projectPlain"
                type="button"
                variant="projectPlain"
              >
                <X size={18} />
              </Button>
            </DialogClose>
          </header>
          {previewImage ? (
            <Image
              className="max-h-[72vh] w-full bg-[rgba(0,0,0,.28)] object-contain"
              alt="状态栏 Ask Project Manage 快捷入口大图"
              draggable={false}
              height={1380}
              src={previewImage}
              width={2560}
            />
          ) : null}
        </DialogContent>
      </Dialog>
      ) : null}
    </>
  );
}
