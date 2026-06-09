import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const createNextConfig = (phase: string): NextConfig => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next" : "dist/dist-web",
  output: "export",
  images: {
    unoptimized: true,
  },
});

export default createNextConfig;
