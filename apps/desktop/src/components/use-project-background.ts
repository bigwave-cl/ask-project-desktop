import { useEffect, type RefObject } from "react";

type NebulaStar = {
    radius: number;
    theta: number;
    arm: number;
    lane: number;
    jitter: number;
    lift: number;
    size: number;
    alpha: number;
    hue: number;
    speed: number;
    twinkle: number;
    depth: number;
};

type FieldStar = {
    radius: number;
    theta: number;
    drift: number;
    wobble: number;
    size: number;
    alpha: number;
    hue: number;
};

type FlameTongue = {
    arm: number;
    radius: number;
    laneOffset: number;
    phase: number;
    length: number;
    alpha: number;
    hue: number;
    width: number;
};

type DriftParticle = {
    arm: number;
    radius: number;
    laneOffset: number;
    speed: number;
    phase: number;
    size: number;
    alpha: number;
    hue: number;
    role: "head" | "tail";
};

const TAU = Math.PI * 2;
const MAX_CANVAS_DPR = 1;
const TARGET_FRAME_MS = 1000 / 12;
const ARM_COUNT = 6;
const NEBULA_STAR_COUNT = 2600;
const FIELD_STAR_COUNT = 420;
const ORBIT_LINE_COUNT = 32;
const FLAME_TONGUE_COUNT = 42;
const DRIFT_PARTICLE_COUNT = 120;
const CENTER_X_RATIO = 0.52;
const CENTER_Y_RATIO = 0.58;
const SPIRAL_TWIST = 9.35;

const nebulaStars: NebulaStar[] = [];
const fieldStars: FieldStar[] = [];
const flameTongues: FlameTongue[] = [];
const driftParticles: DriftParticle[] = [];

const getNoise = (seed: number) => {
    return (Math.sin(seed * 12.9898 + 78.233) * 43758.5453) % 1;
};

const getPositiveNoise = (seed: number) => {
    const value = getNoise(seed);
    return value < 0 ? value + 1 : value;
};

const getPaletteHue = (seed: number, warmBias = 0) => {
    const palette = warmBias > 0.64 ? [22, 30, 38, 350] : [190, 202, 216, 232, 264, 288];
    return palette[Math.floor(getPositiveNoise(seed) * palette.length)] + (getPositiveNoise(seed + 8) - 0.5) * 10;
};

const ensureNebulaStars = () => {
    if (nebulaStars.length) {
        return;
    }

    for (let i = 0; i < NEBULA_STAR_COUNT; i++) {
        const seed = i * 17.73;
        const radius = 0.05 + Math.pow(getPositiveNoise(seed), 0.78) * 1.02;
        const innerGlow = Math.pow(Math.max(0, 1 - radius), 1.7);
        const lane = Math.floor(getPositiveNoise(seed + 6) * 3);
        const laneOffset = (lane - 1) * (0.09 + radius * 0.035);
        const outerScatter = Math.max(0, radius - 0.68);

        nebulaStars.push({
            radius,
            theta: laneOffset + (getPositiveNoise(seed + 4) - 0.5) * (0.06 + outerScatter * 0.16),
            arm: i % ARM_COUNT,
            lane,
            jitter: (getPositiveNoise(seed + 10) - 0.5) * (0.08 + outerScatter * 0.08),
            lift: (getPositiveNoise(seed + 12) - 0.5) * (0.04 + radius * 0.025 + innerGlow * 0.018),
            size: 0.16 + Math.pow(getPositiveNoise(seed + 14), 2.8) * 1.25 + innerGlow * 0.28,
            alpha: 0.048 + getPositiveNoise(seed + 16) * 0.2 + innerGlow * 0.09,
            hue: getPaletteHue(seed + 18, getPositiveNoise(seed + 2)),
            speed: 0.016 + innerGlow * 0.075 + getPositiveNoise(seed + 20) * 0.02,
            twinkle: getPositiveNoise(seed + 22) * TAU,
            depth: getPositiveNoise(seed + 24),
        });
    }
};

const ensureFieldStars = () => {
    if (fieldStars.length) {
        return;
    }

    for (let i = 0; i < FIELD_STAR_COUNT; i++) {
        const seed = i * 29.91;
        const foreground = getPositiveNoise(seed + 2) > 0.78;
        const warm = getPositiveNoise(seed + 4) > 0.68;

        fieldStars.push({
            radius: Math.pow(getPositiveNoise(seed + 6), 0.72) * 1.42,
            theta: getPositiveNoise(seed + 8) * TAU,
            drift: (getPositiveNoise(seed + 26) > 0.5 ? 1 : -1) * (0.006 + getPositiveNoise(seed + 28) * 0.035),
            wobble: getPositiveNoise(seed + 30) * TAU,
            size: foreground
                ? 1.8 + Math.pow(getPositiveNoise(seed + 10), 1.7) * 5.4
                : 0.28 + Math.pow(getPositiveNoise(seed + 12), 2.3) * 1.9,
            alpha: foreground
                ? 0.12 + getPositiveNoise(seed + 14) * 0.26
                : 0.1 + getPositiveNoise(seed + 16) * 0.46,
            hue: warm ? 22 + getPositiveNoise(seed + 18) * 34 : 188 + getPositiveNoise(seed + 20) * 84,
        });
    }
};

const ensureFlameTongues = () => {
    if (flameTongues.length) {
        return;
    }

    for (let i = 0; i < FLAME_TONGUE_COUNT; i++) {
        const seed = i * 37.19;
        const arm = i % ARM_COUNT;
        const warm = getPositiveNoise(seed + 2) > 0.44;

        flameTongues.push({
            arm,
            radius: 0.18 + Math.pow(getPositiveNoise(seed + 4), 0.72) * 0.82,
            laneOffset: (getPositiveNoise(seed + 6) - 0.5) * 0.26,
            phase: getPositiveNoise(seed + 8) * TAU,
            length: 0.035 + getPositiveNoise(seed + 10) * 0.08,
            alpha: 0.035 + getPositiveNoise(seed + 12) * 0.08,
            hue: warm ? 20 + getPositiveNoise(seed + 14) * 34 : 188 + getPositiveNoise(seed + 16) * 46,
            width: 0.0025 + getPositiveNoise(seed + 18) * 0.005,
        });
    }
};

const ensureDriftParticles = () => {
    if (driftParticles.length) {
        return;
    }

    for (let i = 0; i < DRIFT_PARTICLE_COUNT; i++) {
        const seed = i * 53.41;
        const warm = getPositiveNoise(seed + 2) > 0.62;

        driftParticles.push({
            arm: i % ARM_COUNT,
            radius: getPositiveNoise(seed + 4),
            laneOffset: (getPositiveNoise(seed + 6) - 0.5) * 0.36,
            speed: 0.018 + getPositiveNoise(seed + 8) * 0.05,
            phase: getPositiveNoise(seed + 10) * TAU,
            size: 0.55 + Math.pow(getPositiveNoise(seed + 12), 1.8) * 1.8,
            alpha: 0.08 + getPositiveNoise(seed + 14) * 0.18,
            hue: warm ? 24 + getPositiveNoise(seed + 16) * 36 : 178 + getPositiveNoise(seed + 18) * 86,
            role: getPositiveNoise(seed + 20) > 0.46 ? "tail" : "head",
        });
    }
};

const project = (radius: number, theta: number, jitter: number, lift: number, width: number, height: number, seconds: number) => {
    const scene = Math.max(width, height);
    const cx = width * CENTER_X_RATIO;
    const cy = height * CENTER_Y_RATIO;
    const spiral = theta + radius * SPIRAL_TWIST + jitter;
    const diskX = Math.cos(spiral) * radius * scene * 0.56;
    const diskY = Math.sin(spiral) * radius * scene * 0.23 + lift * scene;
    const pitch = -0.34;
    const shear = -0.04;
    const ripple = Math.sin(seconds * 0.22 + radius * 8.4 + theta) * scene * 0.0038 * radius;

    return {
        x: cx + diskX * Math.cos(pitch) - (diskY + ripple) * Math.sin(pitch) + diskY * shear,
        y: cy + diskX * Math.sin(pitch) + (diskY + ripple) * Math.cos(pitch),
    };
};

const getArmPoint = (
    arm: number,
    radius: number,
    laneOffset: number,
    jitter: number,
    lift: number,
    width: number,
    height: number,
    seconds: number,
) => {
    return project(
        radius,
        (arm / ARM_COUNT) * TAU + laneOffset - seconds * 0.018,
        jitter,
        lift,
        width,
        height,
        seconds,
    );
};

const resizeCanvas = (canvas: HTMLCanvasElement, width: number, height: number, dpr: number) => {
    const targetWidth = Math.max(1, Math.round(width * dpr));
    const targetHeight = Math.max(1, Math.round(height * dpr));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }
};

const drawSpaceBackdrop = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const scene = Math.max(width, height);
    const cx = width * CENTER_X_RATIO;
    const cy = height * CENTER_Y_RATIO;
    const base = ctx.createRadialGradient(cx, cy, 0, cx, cy, scene * 0.86);
    base.addColorStop(0, "rgba(6, 18, 34, .9)");
    base.addColorStop(0.44, "rgba(3, 10, 24, .94)");
    base.addColorStop(1, "rgba(1, 3, 10, .98)");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    const blueVolume = ctx.createRadialGradient(cx - scene * 0.18, cy - scene * 0.1, 0, cx - scene * 0.16, cy - scene * 0.08, scene * 0.58);
    blueVolume.addColorStop(0, "hsla(212, 100%, 58%, .14)");
    blueVolume.addColorStop(0.5, "hsla(228, 100%, 44%, .05)");
    blueVolume.addColorStop(1, "hsla(228, 100%, 44%, 0)");
    ctx.fillStyle = blueVolume;
    ctx.fillRect(0, 0, width, height);
};

const drawFieldStars = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    const scene = Math.max(width, height);
    const cx = width * CENTER_X_RATIO;
    const cy = height * CENTER_Y_RATIO;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    fieldStars.forEach(star => {
        const swirl = -seconds * star.drift * (1.18 - Math.min(star.radius, 1.18) * 0.38);
        const wobble = Math.sin(seconds * 0.17 + star.wobble) * 0.015 + Math.sin(seconds * 0.071 + star.wobble * 1.7) * 0.012;
        const theta = star.theta + swirl + wobble;
        const parallax = 0.62 + Math.min(star.radius, 1.3) * 0.38;
        const x = cx + Math.cos(theta) * star.radius * scene * 0.58 * parallax;
        const y = cy + Math.sin(theta) * star.radius * scene * 0.32 * parallax;

        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) {
            return;
        }

        ctx.fillStyle = `hsla(${star.hue}, 100%, 76%, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, TAU);
        ctx.fill();
    });
    ctx.restore();
};

const drawSpiralArmBands = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    const scene = Math.max(width, height);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let arm = 0; arm < ARM_COUNT; arm++) {
        for (let band = 0; band < 4; band++) {
            const hue = [196, 208, 224, 256, 286, 32][arm];
            const laneOffset = (band - 1.5) * 0.075;
            const alpha = [0.075, 0.055, 0.04, 0.026][band];
            const lineWidth = scene * (0.014 + band * 0.006);
            const start = getArmPoint(arm, 0.08, laneOffset, -0.035, (band - 1.5) * 0.01, width, height, seconds);
            const end = getArmPoint(arm, 1.03, laneOffset, 0.05, (band - 1.5) * 0.012, width, height, seconds);
            const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);

            gradient.addColorStop(0, `hsla(${hue + 20}, 100%, 78%, 0)`);
            gradient.addColorStop(0.18, `hsla(${hue}, 100%, 68%, ${alpha * 0.55})`);
            gradient.addColorStop(0.52, `hsla(${hue + 18}, 100%, 76%, ${alpha})`);
            gradient.addColorStop(0.84, `hsla(${hue + 42}, 100%, 70%, ${alpha * 0.4})`);
            gradient.addColorStop(1, `hsla(${hue + 60}, 100%, 72%, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();

            for (let i = 0; i <= 86; i++) {
                const t = i / 86;
                const radius = 0.06 + t * 0.98;
                const flameWave =
                    Math.sin(t * TAU * 2.8 + arm * 0.7 - seconds * 0.78) * 0.017 +
                    Math.sin(t * TAU * 6.2 + band + seconds * 1.15) * 0.009;
                const breathing = Math.sin(t * TAU * 1.1 + arm + seconds * 0.18) * 0.012 + flameWave;
                const point = getArmPoint(
                    arm,
                    radius,
                    laneOffset,
                    breathing + Math.sin(t * Math.PI + band) * 0.025,
                    (band - 1.5) * 0.012,
                    width,
                    height,
                    seconds,
                );

                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }

            ctx.stroke();
        }
    }

    ctx.restore();
};

const drawFlameRibbons = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    const scene = Math.max(width, height);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    flameTongues.forEach(tongue => {
        const flicker = 0.68 + Math.sin(seconds * 2.1 + tongue.phase) * 0.22 + Math.sin(seconds * 4.4 + tongue.phase * 1.7) * 0.1;
        const startRadius = tongue.radius;
        const endRadius = Math.min(1.1, tongue.radius + tongue.length * (0.8 + flicker * 0.35));
        const start = getArmPoint(
            tongue.arm,
            startRadius,
            tongue.laneOffset,
            Math.sin(seconds * 1.4 + tongue.phase) * 0.018,
            0,
            width,
            height,
            seconds,
        );
        const end = getArmPoint(
            tongue.arm,
            endRadius,
            tongue.laneOffset + Math.sin(seconds * 1.8 + tongue.phase) * 0.045,
            Math.sin(seconds * 2.2 + tongue.phase) * 0.035,
            0,
            width,
            height,
            seconds,
        );
        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        const alpha = tongue.alpha * Math.max(0.25, flicker);

        gradient.addColorStop(0, `hsla(${tongue.hue}, 100%, 72%, 0)`);
        gradient.addColorStop(0.38, `hsla(${tongue.hue}, 100%, 68%, ${alpha})`);
        gradient.addColorStop(0.72, `hsla(${tongue.hue + 24}, 100%, 76%, ${alpha * 0.72})`);
        gradient.addColorStop(1, `hsla(${tongue.hue + 44}, 100%, 80%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = scene * tongue.width * (0.72 + flicker * 0.42);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        const midRadius = (startRadius + endRadius) / 2;
        const mid = getArmPoint(
            tongue.arm,
            midRadius,
            tongue.laneOffset + Math.sin(seconds * 2.6 + tongue.phase) * 0.06,
            Math.cos(seconds * 1.9 + tongue.phase) * 0.03,
            0,
            width,
            height,
            seconds,
        );

        ctx.quadraticCurveTo(mid.x, mid.y, end.x, end.y);
        ctx.stroke();
    });

    ctx.restore();
};

const drawDriftParticles = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    driftParticles.forEach(particle => {
        const progress = (particle.radius + seconds * particle.speed) % 1;
        const radius = particle.role === "head"
            ? 0.12 + progress * 0.42
            : 0.36 + progress * 0.72;
        const fade = Math.sin(progress * Math.PI);
        const headFocus = particle.role === "head" ? Math.pow(1 - progress, 1.4) : 0;
        const tailSpread = particle.role === "tail" ? Math.pow(progress, 1.35) : 0;
        const turbulence =
            Math.sin(seconds * 1.7 + particle.phase + progress * TAU * 2.2) * (0.018 + tailSpread * 0.11) +
            Math.sin(seconds * 0.53 + particle.phase * 1.8) * (0.012 + tailSpread * 0.055);
        const laneConverge = particle.role === "head"
            ? particle.laneOffset * (0.28 + progress * 0.34)
            : particle.laneOffset + Math.sin(seconds * 0.7 + particle.phase) * tailSpread * 0.16;
        const point = getArmPoint(
            particle.arm,
            radius,
            laneConverge + turbulence,
            Math.cos(seconds * 1.1 + particle.phase) * (0.012 + tailSpread * 0.055),
            Math.sin(seconds * 0.9 + particle.phase) * (0.008 + tailSpread * 0.032),
            width,
            height,
            seconds,
        );
        const alpha = particle.alpha * fade * (particle.role === "head" ? 1.25 + headFocus * 0.8 : 0.8 + tailSpread * 0.8);
        const size = particle.size * (particle.role === "head" ? 0.72 + headFocus * 0.58 : 0.52 + fade * 0.42);

        ctx.fillStyle = `hsla(${particle.hue}, 100%, 76%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, TAU);
        ctx.fill();

        if (particle.role === "head" && headFocus > 0.18) {
            ctx.fillStyle = `hsla(${particle.hue + 18}, 100%, 82%, ${alpha * 0.34})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 2.2, 0, TAU);
            ctx.fill();
        }

        if (particle.role === "tail" && fade > 0.35) {
            const tail = getArmPoint(
                particle.arm,
                Math.max(0.12, radius - 0.035 - tailSpread * 0.04),
                laneConverge - turbulence * 0.5,
                0,
                0,
                width,
                height,
                seconds,
            );
            const gradient = ctx.createLinearGradient(tail.x, tail.y, point.x, point.y);
            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 0)`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 76%, ${alpha * 0.52})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(0.42, particle.size * (0.32 + tailSpread * 0.22));
            ctx.beginPath();
            ctx.moveTo(tail.x, tail.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    });

    ctx.restore();
};

const drawDustLanes = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    const scene = Math.max(width, height);
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let arm = 0; arm < ARM_COUNT; arm++) {
        for (let lane = 0; lane < 2; lane++) {
            const laneOffset = lane === 0 ? -0.135 : 0.13;
            ctx.strokeStyle = lane === 0 ? "rgba(0, 5, 15, .2)" : "rgba(2, 12, 24, .16)";
            ctx.lineWidth = scene * (0.0038 + lane * 0.002);
            ctx.beginPath();

            for (let i = 0; i <= 74; i++) {
                const t = i / 74;
                const radius = 0.12 + t * 0.88;
                const point = getArmPoint(
                    arm,
                    radius,
                    laneOffset,
                    Math.sin(t * TAU + arm) * 0.014,
                    (lane - 0.5) * 0.012,
                    width,
                    height,
                    seconds,
                );

                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }

            ctx.stroke();
        }
    }

    ctx.restore();
};

const drawOrbitLines = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    for (let i = 0; i < ORBIT_LINE_COUNT; i++) {
        const seed = i * 41.29;
        const arm = i % ARM_COUNT;
        const hue = [194, 210, 230, 266, 304, 28][i % 6];
        const offset = (arm / ARM_COUNT) * TAU + getPositiveNoise(seed + 2) * 0.5 - seconds * (0.014 + getPositiveNoise(seed + 4) * 0.022);
        const startRadius = 0.1 + getPositiveNoise(seed + 6) * 0.18;
        const endRadius = 0.42 + getPositiveNoise(seed + 8) * 0.5;
        const start = project(startRadius, offset, -0.03, 0, width, height, seconds);
        const end = project(endRadius, offset + 0.9, 0.03, 0, width, height, seconds);
        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        const alpha = 0.06 + getPositiveNoise(seed + 10) * 0.12;

        gradient.addColorStop(0, `hsla(${hue}, 100%, 76%, 0)`);
        gradient.addColorStop(0.4, `hsla(${hue}, 100%, 72%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${hue + 42}, 100%, 74%, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.45 + getPositiveNoise(seed + 12) * 1.1;
        ctx.beginPath();

        for (let j = 0; j <= 70; j++) {
            const t = j / 70;
            const point = project(
                startRadius + (endRadius - startRadius) * t,
                offset + t * (1.25 + getPositiveNoise(seed + 14) * 0.6),
                Math.sin(t * TAU + seed) * 0.012,
                (getPositiveNoise(seed + 16) - 0.5) * 0.022,
                width,
                height,
                seconds,
            );

            if (j === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        ctx.stroke();
    }

    ctx.restore();
};

const drawNebulaStars = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    nebulaStars.forEach(star => {
        const offset = (star.arm / ARM_COUNT) * TAU + star.theta - seconds * star.speed;
        const point = project(star.radius, offset, star.jitter, star.lift, width, height, seconds);
        const pulse = 0.72 + Math.sin(seconds * 1.8 + star.twinkle) * 0.28;
        const size = star.size * (0.75 + star.depth * 0.36);
        const laneBoost = star.lane === 1 ? 1.15 : 1;

        if (star.depth > 0.9) {
            ctx.fillStyle = `hsla(${star.hue}, 100%, 70%, ${star.alpha * pulse * 0.22})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 2.4, 0, TAU);
            ctx.fill();
        }

        ctx.fillStyle = `hsla(${star.hue}, 100%, 74%, ${star.alpha * pulse * laneBoost})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, TAU);
        ctx.fill();
    });

    ctx.restore();
};

const drawCore = (ctx: CanvasRenderingContext2D, width: number, height: number, seconds: number) => {
    const scene = Math.max(width, height);
    const cx = width * CENTER_X_RATIO;
    const cy = height * CENTER_Y_RATIO;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.34);
    ctx.globalCompositeOperation = "lighter";

    const pulse = 0.96 + Math.sin(seconds * 0.8) * 0.04;
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, scene * 0.045 * pulse);
    core.addColorStop(0, "hsla(204, 100%, 86%, .2)");
    core.addColorStop(0.42, "hsla(208, 100%, 76%, .08)");
    core.addColorStop(1, "hsla(226, 100%, 72%, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, scene * 0.045 * pulse, 0, TAU);
    ctx.fill();
    ctx.restore();
};

const drawBackground = (canvas: HTMLCanvasElement, time = 0) => {
    const wrap = canvas.parentElement;
    if (!wrap) {
        return;
    }

    const rect = wrap.getBoundingClientRect();
    const width = Math.max(1, Math.min(rect.width, window.innerWidth || rect.width));
    const height = Math.max(1, Math.min(rect.height, window.innerHeight || rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
    const seconds = time / 1000;
    resizeCanvas(canvas, width, height, dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    ensureFieldStars();
    ensureNebulaStars();
    ensureFlameTongues();
    ensureDriftParticles();

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";

    drawSpaceBackdrop(ctx, width, height);
    drawFieldStars(ctx, width, height, seconds);
    drawSpiralArmBands(ctx, width, height, seconds);
    drawFlameRibbons(ctx, width, height, seconds);
    drawDriftParticles(ctx, width, height, seconds);
    drawDustLanes(ctx, width, height, seconds);
    drawOrbitLines(ctx, width, height, seconds);
    drawNebulaStars(ctx, width, height, seconds);
    drawCore(ctx, width, height, seconds);
};

export const useProjectBackground = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null;
        let resizeFrame = 0;
        let animationFrame = 0;
        let isMounted = true;
        let isRunning = false;
        let animationTime = 0;
        let lastFrameTime = 0;
        let lastPaintTime = 0;

        const scheduleDraw = () => {
            if (resizeFrame) {
                return;
            }

            resizeFrame = window.requestAnimationFrame(() => {
                resizeFrame = 0;
                const canvas = canvasRef.current;
                if (canvas) {
                    drawBackground(canvas, animationTime);
                }
            });
        };

        const stopAnimation = () => {
            isRunning = false;
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = 0;
            }
        };

        const drawAnimation = (time: number) => {
            if (!isMounted || !isRunning) {
                return;
            }

            if (!lastFrameTime) {
                lastFrameTime = time;
            }

            const delta = Math.min(50, Math.max(0, time - lastFrameTime));
            lastFrameTime = time;

            if (!document.hidden) {
                animationTime += delta;
                if (time - lastPaintTime >= TARGET_FRAME_MS) {
                    lastPaintTime = time;
                    const canvas = canvasRef.current;
                    if (canvas) {
                        drawBackground(canvas, animationTime);
                    }
                }
            }

            animationFrame = window.requestAnimationFrame(drawAnimation);
        };

        const startAnimation = () => {
            if (!isMounted || isRunning || document.hidden) {
                return;
            }

            isRunning = true;
            animationFrame = window.requestAnimationFrame(drawAnimation);
        };

        const handleVisibilityChange = () => {
            lastFrameTime = 0;
            lastPaintTime = 0;
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        };

        const canvas = canvasRef.current;
        if (!canvas) {
            return undefined;
        }

        scheduleDraw();
        if (canvas.parentElement) {
            resizeObserver = new ResizeObserver(scheduleDraw);
            resizeObserver.observe(canvas.parentElement);
        }
        window.addEventListener("resize", scheduleDraw);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        startAnimation();

        return () => {
            isMounted = false;
            stopAnimation();
            resizeObserver?.disconnect();
            window.removeEventListener("resize", scheduleDraw);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (resizeFrame) {
                window.cancelAnimationFrame(resizeFrame);
                resizeFrame = 0;
            }
        };
    }, [canvasRef]);
};
