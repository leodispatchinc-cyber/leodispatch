"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronRight } from "lucide-react";
import { heroStats } from "@/lib/data";
import Counter from "../ui/Counter";

// cinematic, restrained playback per clip. The clip's run-time (its duration ÷
// this rate) is also how long each face is shown before the banner flips.
const RATE_A = 0.55; // box-truck montage
const RATE_B = 0.3; // hotshot 360 — slow glide

const setRate =
  (rate: number) => (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.playbackRate = rate;
  };

// four equally-weighted ghost pills, exactly like the reference's button row
const actions = [
  { label: "Get Started", href: "/onboarding" },
  { label: "Join An MC Authority", href: "/carriers" },
  { label: "Rate Calculator", href: "/services#calculator" },
  { label: "How It Works", href: "/services#how-it-works" },
];

// the art carries the big neon wordmark — only three plain numbers are overlaid.
const stats = heroStats.slice(0, 3);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoA = useRef<HTMLVideoElement>(null); // front face · box truck
  const videoB = useRef<HTMLVideoElement>(null); // back face · hotshot

  // ── auto-flip cycle: each clip plays once, then the card flips 180° to the
  //    other clip; +180 every time so it always turns the same direction. ──
  const [flipCount, setFlipCount] = useState(0);
  const activeRef = useRef(0); // 0 = A showing, 1 = B showing
  const flip = useMotionValue(0);

  useEffect(() => {
    const active = flipCount % 2;
    activeRef.current = active;
    const controls = animate(flip, flipCount * 180, {
      duration: 1,
      ease: [0.65, 0, 0.35, 1],
    });
    const a = videoA.current;
    const b = videoB.current;
    if (active === 0) {
      b?.pause();
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
    } else {
      a?.pause();
      if (b) {
        b.currentTime = 0;
        b.play().catch(() => {});
      }
    }
    return () => controls.stop();
  }, [flipCount, flip]);

  const advance = (face: number) => () => {
    if (activeRef.current === face) setFlipCount((c) => c + 1);
  };

  // ── normalized pointer (-1..1) for parallax + cursor-steered turn ──
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const px = useSpring(nx, { stiffness: 110, damping: 26, mass: 0.5 });
  const py = useSpring(ny, { stiffness: 110, damping: 26, mass: 0.5 });

  // ── pointer (px) for the mouse-follow spotlight (moved by transform only) ──
  const mouseX = useMotionValue(-800);
  const mouseY = useMotionValue(-800);
  const sx = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.4 });
  const spotX = useTransform(sx, (v) => v - 320);
  const spotY = useTransform(sy, (v) => v - 320);

  // ── card transforms: drift + cursor turn, layered on top of the flip ──
  const cardX = useTransform(px, [-1, 1], [9, -9]);
  const cardY = useTransform(py, [-1, 1], [6, -6]);
  const tilt = useTransform(px, [-1, 1], [11, -11]);
  const cardRotateY = useTransform([flip, tilt], ([f, t]: number[]) => f + t);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    nx.set((x / rect.width) * 2 - 1);
    ny.set((y / rect.height) * 2 - 1);
  };
  const onLeave = () => {
    mouseX.set(-800);
    mouseY.set(-800);
    nx.set(0);
    ny.set(0);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative w-full overflow-hidden bg-black"
    >
      {/* ── Background graphics (static — painted once) ── */}
      <div className="pointer-events-none absolute inset-0 z-[2] [box-shadow:inset_0_0_240px_90px_#000]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[16vh] bg-gradient-to-b from-black via-black/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[44vh] bg-[linear-gradient(to_top,#060606_0%,rgba(6,6,6,0.96)_26%,rgba(6,6,6,0.5)_64%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[26vh] bg-[radial-gradient(75%_130%_at_50%_140%,rgba(255,200,0,0.13),transparent_62%)]" />

      {/* mouse-follow spotlight — a bounded element moved by transform only */}
      <motion.div
        style={{ x: spotX, y: spotY }}
        className="pointer-events-none absolute left-0 top-0 z-[3] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(255,208,0,0.16),rgba(255,170,0,0.05)_40%,transparent_66%)] mix-blend-screen"
      />

      {/* decorative edge label */}
      <span className="absolute left-5 top-1/2 z-[3] hidden -translate-y-1/2 -rotate-90 text-[10px] font-semibold uppercase tracking-[0.45em] text-white/35 lg:block">
        USA · 48 States
      </span>

      {/* ── Content (flow): header gap → flipping truck → stats → pills ── */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 pb-8 pt-[12vh] sm:pt-[13vh] lg:justify-start">
        <div className="relative w-[94%] max-w-[560px] shrink-0 sm:max-w-[900px] lg:max-w-[1520px]">
          {/* warm gold stage glow behind the truck */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[128%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,196,0,0.26),rgba(255,150,0,0.08)_45%,transparent_70%)] blur-2xl" />

          {/* perspective stage → flipping 3D card with two video faces */}
          <div className="relative aspect-[844/512] [perspective:1600px] lg:aspect-[48/25]">
            <motion.div
              className="absolute inset-0 will-change-transform [transform-style:preserve-3d]"
              style={{ rotateY: cardRotateY, x: cardX, y: cardY }}
            >
              {/* FRONT face · box-truck clip */}
              <motion.video
                ref={videoA}
                style={{ scale: 1.05 }}
                className="absolute inset-0 h-full w-full object-cover object-center [backface-visibility:hidden]"
                autoPlay
                muted
                playsInline
                preload="auto"
                poster="/truck-poster.jpg"
                onLoadedMetadata={setRate(RATE_A)}
                onEnded={advance(0)}
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                <source src="/truck.mp4" type="video/mp4" />
              </motion.video>

              {/* BACK face · hotshot 360 clip (pre-rotated so it faces away) */}
              <motion.video
                ref={videoB}
                style={{ rotateY: 180, scale: 1.05 }}
                className="absolute inset-0 h-full w-full object-cover object-center [backface-visibility:hidden]"
                autoPlay
                muted
                playsInline
                preload="auto"
                poster="/truck-poster.jpg"
                onLoadedMetadata={setRate(RATE_B)}
                onEnded={advance(1)}
              >
                <source src="/hero-orbit.mp4" type="video/mp4" />
              </motion.video>
            </motion.div>

            {/* cheap static edge feathers — melt the clip into black (replaces
                the per-frame video mask that was the main source of jank) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[10%] bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[10%] bg-gradient-to-l from-black to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[8%] bg-gradient-to-b from-black to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[16%] bg-gradient-to-t from-black to-transparent" />
          </div>
        </div>

        {/* stats + pills — flow right below the truck */}
        <div className="mt-7 flex w-full flex-col items-center text-center sm:mt-9">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-stretch justify-center"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-7 sm:px-12 ${i > 0 ? "border-l border-white/15" : ""}`}
              >
                <div className="font-display text-4xl font-extrabold leading-none text-yellow [text-shadow:0_2px_28px_rgba(0,0,0,0.98)] sm:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mx-auto mt-2.5 max-w-[10ch] text-[10px] font-medium uppercase tracking-[0.18em] text-muted [text-shadow:0_1px_12px_rgba(0,0,0,0.95)] sm:text-[11px]">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {actions.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-[13px] font-medium text-paper transition-all hover:border-gold/70 hover:bg-white/[0.1] hover:text-gold active:scale-[0.98]"
              >
                <ChevronRight className="h-3.5 w-3.5 text-gold" />
                {a.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
