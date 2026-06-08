"use client";

import { useRef } from "react";

import { useProjectBackground } from "@/components/use-project-background";

export function ProjectManageBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useProjectBackground(canvasRef);

  return (
    <div
      className="ask-project-manage-background"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        className="ask-project-manage-background__aura"
        style={{
          position: "absolute",
          zIndex: 0,
          width: "max(200%, 1500px)",
          aspectRatio: "1 / 1",
          left: "50%",
          top: "52%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 20% 18%, color-mix(in srgb, var(--apm-mamas-new-bag) 48%, transparent), transparent 20%), radial-gradient(circle at 76% 26%, color-mix(in srgb, var(--apm-radio-silence) 52%, transparent), transparent 22%), radial-gradient(circle at 66% 72%, color-mix(in srgb, var(--apm-riviera) 28%, transparent), transparent 24%), radial-gradient(circle at 32% 78%, color-mix(in srgb, var(--apm-late-homework) 34%, transparent), transparent 28%), radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--apm-faded-letter) 16%, transparent), transparent 48%)",
          filter: "blur(36px) saturate(1.24)",
          opacity: 0.22,
          mixBlendMode: "screen",
          willChange: "transform",
          transform: "translate(-50%, -50%) rotate(0deg)",
          animation: "background-aura-field 52s ease-in-out infinite",
        }}
      />
      <canvas
        ref={canvasRef}
        className="ask-project-manage-background__canvas"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          opacity: 1,
          mixBlendMode: "normal",
        }}
      />
      <style>{`
        @keyframes background-aura-field {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }

          50% {
            transform: translate(-48%, -52%) rotate(180deg) scale(1.04);
          }

          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
