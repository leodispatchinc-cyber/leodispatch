"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ──────────────────────────────────────────────────────────────────────────
   TUNE THESE to match YOUR truck.png — they are the axle centres expressed as
   a % of the truck image box, plus the wheel diameter as a % of truck width.
   (Values below match the bundled placeholder truck.png — a box truck facing
   right with its two axles under the box / cab.)
   ────────────────────────────────────────────────────────────────────────── */
// Axle centres of YOUR truck.png, as % of the truck box. The box truck has a
// single front axle plus a rear TANDEM (two wheels), so three overlays.
const WHEELS = [
  { left: 69.0, top: 81.0 }, // front (under the cab)
  { left: 27.0, top: 81.0 }, // rear tandem — inner
  { left: 17.0, top: 81.0 }, // rear tandem — outer
];
const WHEEL_PCT = 13; // wheel width as a % of the truck width

/* Motion distances, in viewport widths (vw). Tune to taste. */
const ENTER_FROM = -130; // entrance: drives in from off-screen LEFT (natural)
const DRIVE_TO = 52; // phase 2: drives this far right
const EXIT_TO = 145; // phase 3: exits to here (fully off-screen)

const HEADING = "BOX TRUCK";

export default function HeroTruckAnimation() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLVideoElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const truck = useRef<HTMLDivElement>(null);
  const wheelRefs = useRef<(HTMLImageElement | null)[]>([]);
  const flare = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const headlight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vw = (n: number) => (window.innerWidth * n) / 100;
    const wheels = wheelRefs.current.filter(Boolean);

    let mm: ReturnType<typeof gsap.matchMedia> | undefined;
    let idle: gsap.core.Tween | undefined;

    /* Built AFTER the entrance finishes, so the scroll-scrubbed x records its
       start from the truck's resting position and never fights the slide-in. */
    const buildScrollScene = () => {
      const m = gsap.matchMedia(root.current ?? undefined);

      /* DESKTOP — pinned, scroll-scrubbed drive + exit */
      m.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* PHASE 2 — first 70% of the timeline */
        tl.to(truck.current, { x: () => vw(DRIVE_TO), duration: 0.7 }, 0)
          .to(wheels, { rotation: "+=1440", duration: 0.7 }, 0)
          .to(bg.current, { x: () => vw(-10), duration: 1 }, 0)
          .to(heading.current, { opacity: 0.3, scale: 1.05, duration: 0.7 }, 0)
          .fromTo(
            ".lt-streak",
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 0.85, duration: 0.4, stagger: 0.05 },
            0.12
          )
          // the glowing road/light-trail the truck "lays down" as it drives
          .fromTo(trail.current, { scaleX: 0 }, { scaleX: 1, duration: 0.85 }, 0);

        /* PHASE 3 — last 30%: accelerate off-screen with motion blur */
        tl.to(truck.current, { x: () => vw(EXIT_TO), duration: 0.3, ease: "power2.in" }, 0.7)
          .to(truck.current, { skewX: -4, filter: "blur(2px)", duration: 0.12 }, 0.7)
          .to(truck.current, { skewX: 0, filter: "blur(0px)", duration: 0.06 }, 0.94)
          .to(wheels, { rotation: "+=1800", duration: 0.3 }, 0.7)
          .to(heading.current, { opacity: 0, duration: 0.2 }, 0.72)
          .to(bg.current, { filter: "blur(5px) brightness(0.55)", duration: 0.3 }, 0.7)
          .fromTo(
            ".lt-particle",
            { opacity: 0, x: 0, y: 0 },
            {
              opacity: 1,
              x: () => gsap.utils.random(-200, -90),
              y: () => gsap.utils.random(-50, 50),
              duration: 0.18,
              stagger: 0.012,
            },
            0.72
          )
          .to(".lt-particle", { opacity: 0, duration: 0.22, stagger: 0.012 }, 0.82);
      });

      /* MOBILE — no pin, only a light background parallax */
      m.add("(max-width: 767px)", () => {
        gsap.to(bg.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return m;
    };

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");

      /* ── Reduced motion: everything visible, no animation ── */
      if (reduce) {
        bg.current?.pause();
        gsap.set(bg.current, { opacity: 1, scale: 1.05, filter: "blur(5px) brightness(1)" });
        gsap.set(truck.current, { x: 0, opacity: 1 });
        gsap.set(letters, { opacity: 1 });
        return;
      }

      /* base transform states (GSAP owns the transform/filter from here on) */
      gsap.set(bg.current, {
        opacity: 0,
        scale: 1.12,
        x: 0,
        filter: "blur(5px) brightness(1)",
      });
      gsap.set(truck.current, { x: vw(ENTER_FROM), y: 0, skewX: 0, filter: "blur(0px)" });
      gsap.set(letters, { opacity: 0 });

      /* ════════════ PHASE 1 — ENTRANCE (runs once) ════════════ */
      const intro = gsap.timeline({
        defaults: { ease: "none" },
        onComplete: () => {
          mm = buildScrollScene();
        },
      });

      // 1. background fades up from black
      intro.to(bg.current, { opacity: 1, duration: 1, ease: "power1.out" }, 0);

      // 2. neon "BOX TRUCK" — staggered per-letter flicker
      letters.forEach((l, i) => {
        if (l.dataset.space) return;
        intro.to(
          l,
          { keyframes: { opacity: [0, 1, 0.4, 1] }, duration: 0.4 },
          0.2 + i * 0.06
        );
      });

      // 3 + 4. truck slides in from the right (tiny overshoot) while wheels spin
      intro.to(truck.current, { x: 0, duration: 1.4, ease: "back.out(1.1)" }, 0.3);
      intro.fromTo(
        wheels,
        { rotation: -900 },
        { rotation: 0, duration: 1.4, ease: "back.out(1.1)" },
        0.3
      );

      // 5. headlight flare on stop
      intro
        .fromTo(
          flare.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1.4, duration: 0.18, ease: "power2.out" },
          1.55
        )
        .to(flare.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, ">");

      // 6. dust puff behind the rear wheel
      intro.fromTo(
        ".lt-dust",
        { opacity: 0.7, scale: 0.3 },
        { opacity: 0, scale: 2.4, duration: 0.7, stagger: 0.07, ease: "power2.out" },
        1.5
      );

      // 7. idle bob (subtle, infinite) — starts once everything has settled
      intro.call(
        () => {
          idle = gsap.to(truck.current, {
            y: "+=2",
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        },
        undefined,
        ">"
      );

      /* ── Ambient, always-on polish (cinematic banner life) ── */
      // slow Ken-Burns zoom on the bridge background
      gsap.to(bg.current, {
        scale: 1.22,
        duration: 16,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      // headlights breathe
      gsap.fromTo(
        headlight.current,
        { opacity: 0.35 },
        { opacity: 0.8, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1 }
      );
      // gold embers drift up and fade, forever
      gsap.utils.toArray<HTMLElement>(".lt-ember").forEach((e, i) => {
        gsap.to(e, {
          keyframes: {
            "0%": { y: 0, opacity: 0 },
            "12%": { opacity: 0.9 },
            "100%": { y: -gsap.utils.random(180, 380), opacity: 0 },
          },
          duration: gsap.utils.random(4, 7),
          ease: "none",
          repeat: -1,
          delay: i * 0.45,
        });
      });
    }, root);

    return () => {
      idle?.kill();
      mm?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      aria-label="Leo Dispatch — keep your truck moving"
      className="relative isolate h-screen w-full overflow-hidden bg-black"
    >
      {/* ── Background — living loop video, softly blurred (depth of field)
              so the sharp foreground truck stays the subject ── */}
      <video
        ref={bg}
        className="absolute inset-0 z-0 h-full w-full object-cover will-change-transform"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero-bridge.jpg"
        style={{ opacity: 0, filter: "blur(5px) brightness(1)" }}
      >
        <source src="/hero-loop.mp4" type="video/mp4" />
      </video>
      {/* legibility scrims — top for the nav/neon, light vignette so the
          gold light-swirls in the photo's foreground stay visible */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/20 to-black/55" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(125%_95%_at_50%_55%,transparent_52%,rgba(0,0,0,0.5)_100%)]" />

      {/* ── Neon heading (behind the truck) ── */}
      <h1
        ref={heading}
        className="pointer-events-none absolute left-1/2 top-[34%] z-[2] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[13vw] font-black uppercase leading-none tracking-tight text-[#FFD400] sm:text-[11vw]"
        style={{ textShadow: "0 0 20px rgba(255,200,0,0.9), 0 0 60px rgba(255,193,7,0.55)" }}
      >
        {HEADING.split("").map((ch, i) => (
          <span
            key={i}
            data-letter
            data-space={ch === " " ? "1" : undefined}
            className="inline-block"
            style={{ opacity: 0 }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </h1>

      {/* ── Gold light-streak trails (behind the truck) ── */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        {[40, 53, 64, 72].map((top, i) => (
          <div
            key={i}
            className="lt-streak absolute left-0 h-[2px] w-1/2 origin-left"
            style={{
              top: `${top}%`,
              opacity: 0,
              background:
                "linear-gradient(90deg, transparent, rgba(255,205,0,0.9), transparent)",
            }}
          />
        ))}
      </div>

      {/* ── Road / light-trail the truck lays down as it drives ── */}
      <div
        ref={trail}
        className="pointer-events-none absolute inset-x-0 bottom-[12.5%] z-[2] h-[6%] origin-left"
        style={{ transform: "scaleX(0)" }}
      >
        <div
          className="absolute inset-x-0 top-[22%] h-[3px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,190,0,0) 28%, rgba(255,205,0,0.9))",
            boxShadow: "0 0 14px 2px rgba(255,190,0,0.55)",
          }}
        />
        <div
          className="absolute inset-x-0 top-[52%] h-[5px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,170,0,0) 22%, rgba(255,180,0,0.95))",
            boxShadow: "0 0 22px 3px rgba(255,170,0,0.6)",
          }}
        />
        <div
          className="absolute inset-x-0 top-[82%] h-[2px] rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,220,90,0.85))",
            boxShadow: "0 0 10px rgba(255,200,0,0.5)",
          }}
        />
      </div>

      {/* ── Drifting gold embers (ambient atmosphere) ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[55%] mix-blend-screen">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="lt-ember absolute rounded-full"
            style={{
              left: `${(i * 7 + 4) % 96}%`,
              bottom: `${(i * 13) % 36}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              opacity: 0,
              background: "rgba(255,205,0,0.95)",
              boxShadow: "0 0 8px rgba(255,190,0,0.85)",
            }}
          />
        ))}
      </div>

      {/* ── Truck (truck.png + rotating wheel overlays) ── */}
      <div
        ref={truck}
        className="absolute bottom-[14%] left-[3vw] z-[3] w-[clamp(380px,48vw,820px)] will-change-transform"
        style={{ transform: "translateX(-130vw)" }}
      >
        {/* ground shadow — plants the truck on the road (no floating) */}
        <div className="pointer-events-none absolute left-1/2 top-[88%] h-[10%] w-[86%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-xl" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/truck.png"
          alt=""
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="block h-auto w-full select-none"
        />

        {/* wheels — each wrapper centres on an axle, GSAP rotates the inner img */}
        {WHEELS.map((w, i) => (
          <div
            key={i}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${w.left}%`, top: `${w.top}%`, width: `${WHEEL_PCT}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => {
                wheelRefs.current[i] = el;
              }}
              src="/wheel.png"
              alt=""
              draggable={false}
              className="block w-full select-none will-change-transform"
            />
          </div>
        ))}

        {/* persistent headlight glow (breathes) — casts forward off the cab */}
        <div
          ref={headlight}
          className="pointer-events-none absolute aspect-square mix-blend-screen"
          style={{
            left: "94%",
            top: "74%",
            width: "30%",
            opacity: 0.35,
            background:
              "radial-gradient(circle, rgba(255,244,200,0.7), rgba(255,210,90,0.22) 38%, transparent 70%)",
          }}
        />

        {/* headlight flare (one-shot, fires when the truck stops) */}
        <div
          ref={flare}
          className="pointer-events-none absolute aspect-square"
          style={{
            left: "88%",
            top: "72%",
            width: "22%",
            opacity: 0,
            background:
              "radial-gradient(circle, rgba(255,240,190,0.95), rgba(255,200,0,0.4) 35%, transparent 70%)",
          }}
        />

        {/* dust puffs behind the rear wheel */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="lt-dust pointer-events-none absolute aspect-square rounded-full blur-md"
            style={{
              left: `${WHEELS[2].left - 5 - i * 3}%`,
              top: `${WHEELS[2].top - 1}%`,
              width: "9%",
              opacity: 0,
              background: i % 2 ? "rgba(205,195,175,0.5)" : "rgba(255,200,0,0.4)",
            }}
          />
        ))}
      </div>

      {/* ── Gold exit particles (emitted from behind the truck) ── */}
      <div className="pointer-events-none absolute bottom-[24%] left-[52%] z-[3]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="lt-particle absolute block h-1.5 w-1.5 rounded-full"
            style={{
              top: `${(i % 4) * 9}px`,
              left: `${(i % 3) * 11}px`,
              opacity: 0,
              background: "rgba(255,205,0,0.95)",
              boxShadow: "0 0 8px rgba(255,200,0,0.9)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
