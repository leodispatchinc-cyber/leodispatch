"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronRight } from "lucide-react";
import { heroStats } from "@/lib/data";
import Counter from "./ui/Counter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = heroStats.slice(0, 3);

export default function HeroBanner() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (v) {
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "auto";
      v.playbackRate = 0.75;
      v.play().catch(() => {});
    }

    /* ── Entrance + gentle scroll polish ── */
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from(".hero-rise", {
        opacity: 0,
        y: 14,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
      });
      gsap.to(".hero-content", {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
      });
      const isMobile = window.innerWidth < 640;
      gsap.to(bg.current, {
        yPercent: isMobile ? 3 : 6,
        scale: isMobile ? 1.05 : 1.2,
        ease: "none",
        force3D: true,
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black"
    >
      {/* ── Banner Image ── */}
      <div
        ref={bg}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <video
          ref={video}
          className="pointer-events-none h-full w-full object-cover object-[62%_center] sm:object-center opacity-90 transition-transform duration-[20000ms] ease-linear hover:scale-105"
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
        >
          <source src="/main-banner-truck.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Legibility treatment ── */}
      {/* MOBILE: one cinematic bottom-up fade — truck breathes up top,
          text rests on a clean dark base below (solid at the very bottom
          for the stats, fading smoothly up into the footage). */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black from-14% via-black/65 via-55% to-transparent sm:hidden" />
      {/* DESKTOP: heavy left wash for the side-by-side copy */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-r from-black via-black/45 to-transparent sm:block" />
      {/* Top scrim seats the nav (both breakpoints) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-black/70 to-transparent sm:from-black/80" />
      {/* DESKTOP: bottom fade / stats stage (seam-free) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-[70%] bg-gradient-to-t from-black from-30% via-black/35 to-transparent sm:block" />

      {/* ── Content (sits clearly BELOW the fixed header) ── */}
      <div className="hero-content container-x pointer-events-none relative z-10 flex h-full flex-col justify-end pb-36 pt-24 sm:justify-center sm:pb-40 sm:pt-44">
        <div className="max-w-2xl">
          <span className="hero-rise inline-flex items-center gap-2.5 self-start rounded-full border border-gold/30 bg-black/45 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-gold backdrop-blur-md sm:border-white/15 sm:bg-white/[0.05]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            USA Owner-Operator Dispatch · 48 States
          </span>

          <h1 className="hero-rise mt-5 sm:mt-7 font-display text-[34px] font-black uppercase leading-[1.08] tracking-[-0.01em] [word-spacing:0.1em] text-paper drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] sm:leading-[0.95] sm:text-6xl lg:text-7xl">
            Keep Your
            <br />
            Truck <span className="text-gradient-gold">Moving.</span>
          </h1>

          <p className="hero-rise mt-3 sm:mt-6 max-w-md text-[14px] sm:text-lg leading-relaxed text-paper/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            We find the loads — you drive. Dedicated dispatch for Owner-Operators,
            Box Trucks, Hotshots, Reefers and Small Fleets across all 48 states.
          </p>

          <div className="hero-rise pointer-events-auto mt-7 sm:mt-10 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <a
              href="/onboarding"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-7 py-3.5 text-sm font-semibold text-black shadow-[0_12px_44px_-10px_rgba(255,208,0,0.7)] transition-all hover:bg-gold active:scale-[0.98] sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/carriers"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-paper backdrop-blur-md transition-all hover:border-gold hover:text-gold active:scale-[0.98] sm:w-auto"
            >
              <ChevronRight className="h-4 w-4 text-gold" /> Join A Carrier Program
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats (rest on the solid base of the bottom fade — no hard seam) ── */}
      <div className="hero-rise pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="container-x grid grid-cols-3 divide-x divide-white/10 py-7 sm:py-8">
          {stats.map((s) => (
            <div key={s.label} className="px-2 text-center sm:px-4 sm:text-left">
              <div className="font-display text-2xl font-extrabold leading-none text-yellow sm:text-4xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted sm:text-[11px]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
