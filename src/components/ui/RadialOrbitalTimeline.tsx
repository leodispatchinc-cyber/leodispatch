"use client";

import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Link as LinkIcon, FileText, Clock, MapPin } from "lucide-react";

export interface OrbitalItem {
  id: number;
  title: string;
  /** shown as the small mono label — we use the location */
  date: string;
  /** short description / tagline */
  content: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  /** where the node's primary CTA links */
  href?: string;
  requirementsHref?: string;
  payTerms?: string;
  docCount?: number;
}

const CENTER_OFFSET = { x: 0, y: 0 };

export default function RadialOrbitalTimeline({
  timelineData,
}: {
  timelineData: OrbitalItem[];
}) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  // Orbit geometry scales down on phones so the whole constellation fits the
  // screen. Defaults to the desktop value so the SSR/first-client render match.
  const [radius, setRadius] = useState(200);
  const [compact, setCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const router = useRouter();

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  // Match the orbit radius + interaction model to the viewport. Phones get a
  // tighter radius and skip tap-to-expand (the node-anchored card would clip at
  // the screen edge — the detailed card list below the orbit handles the CTAs).
  useEffect(() => {
    const sync = () => {
      const mobile = window.innerWidth < 640;
      setCompact(mobile);
      setRadius(mobile ? 115 : 200);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // pause the auto-rotate (and its 20×/sec re-render) whenever this section is
  // scrolled out of view — keeps the rest of the page (e.g. the hero) smooth.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-rotate only on desktop. On phones this 20×/sec setState loop saturates
  // the main thread (janky scroll, taps feel frozen), so the orbit stays static
  // there — the nodes are tappable and the card list below carries the details.
  useEffect(() => {
    if (!autoRotate || !inView || compact) return;
    const rotationTimer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(rotationTimer);
  }, [autoRotate, inView, compact]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    // Round every derived value to a fixed precision. Node (server) and the
    // browser (client) compute Math.cos/sin to slightly different last bits,
    // which made the SSR inline-style string differ from the client's and
    // tripped React's hydration check. Rounding makes both serialize identically.
    const x = Math.round((radius * Math.cos(radian) + CENTER_OFFSET.x) * 100) / 100;
    const y = Math.round((radius * Math.sin(radian) + CENTER_OFFSET.y) * 100) / 100;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity =
      Math.round(
        Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))) * 1000
      ) / 1000;

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  return (
    <div
      className="relative flex h-[440px] w-full items-center justify-center overflow-hidden sm:h-[700px]"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* ── decorative orbital field — sits behind the nodes ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* warm gold core glow */}
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,0,0.18),rgba(255,150,0,0.05)_44%,transparent_72%)] blur-2xl sm:h-[480px] sm:w-[480px]" />
        {/* faint radar spokes, masked to a mid-ring band */}
        <div
          className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 sm:h-[760px] sm:w-[760px]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, transparent 0deg 14deg, rgba(255,255,255,0.05) 14deg 15deg)",
            maskImage:
              "radial-gradient(circle, transparent 24%, #000 48%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 24%, #000 48%, transparent 82%)",
          }}
        />
        {/* concentric orbit rings */}
        <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08] sm:h-[250px] sm:w-[250px]" />
        <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/20 sm:h-[400px] sm:w-[400px]" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] sm:h-[560px] sm:w-[560px]" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] sm:h-[720px] sm:w-[720px]" />
        {/* frame vignette to focus the centre */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.85)_88%)]" />
      </div>

      <div className="relative flex h-full w-full max-w-4xl items-center justify-center">
        <div
          className="absolute flex h-full w-full items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Central core */}
          <div className="absolute z-10 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-[#ffd400] via-[#f4b400] to-[#9a6a00]">
            <div className="absolute h-20 w-20 animate-ping rounded-full border border-gold/30 opacity-70"></div>
            <div
              className="absolute h-24 w-24 animate-ping rounded-full border border-gold/20 opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="h-8 w-8 rounded-full bg-white/85 backdrop-blur-md"></div>
          </div>

          {/* Orbit ring */}
          <div className="absolute h-[230px] w-[230px] rounded-full border border-white/10 sm:h-96 sm:w-96"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute cursor-pointer transition-all duration-700"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  // Phones: the orbit is static (no expand card), so a tap takes
                  // the visitor straight to that authority's onboarding page.
                  if (compact) {
                    if (item.href) router.push(item.href);
                    return;
                  }
                  toggleItem(item.id);
                }}
              >
                {/* glow */}
                <div
                  className={`absolute -inset-1 rounded-full ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(255,208,0,0.22) 0%, rgba(255,208,0,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5) / 2}px`,
                    top: `-${(item.energy * 0.5) / 2}px`,
                  }}
                ></div>

                {/* node dot */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300
                  ${
                    isExpanded
                      ? "scale-150 border-gold bg-gradient-to-br from-[#ffe27a] via-yellow to-gold text-black shadow-lg shadow-yellow/40"
                      : isRelated
                      ? "animate-pulse border-gold bg-yellow/40 text-black"
                      : "border-white/40 bg-ink text-paper"
                  }`}
                >
                  <Icon size={20} strokeWidth={2.25} />
                </div>

                {/* label */}
                <div
                  className={`absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-xs font-semibold tracking-wider transition-all duration-300
                  ${isExpanded ? "scale-110 text-paper" : "text-white/70"}`}
                >
                  {item.title}
                </div>

                {/* expanded card */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-1/2 top-24 w-80 max-w-[84vw] -translate-x-1/2 overflow-hidden rounded-2xl border border-gold/30 bg-ink/95 text-left shadow-2xl shadow-black/70 backdrop-blur-xl"
                  >
                    <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-gold/50"></div>

                    {/* header */}
                    <div className="border-b border-white/10 bg-gradient-to-br from-yellow/[0.08] to-transparent p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-yellow/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Onboarding Open
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-white/55">
                          <MapPin size={11} className="text-gold" /> {item.date}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ffe27a] via-yellow to-gold text-black shadow-md shadow-yellow/25 ring-1 ring-inset ring-white/25">
                          <Icon size={19} strokeWidth={2.25} />
                        </span>
                        <h3 className="min-w-0 truncate font-display text-base font-bold text-paper">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* body */}
                    <div className="p-4">
                      <p className="text-xs leading-relaxed text-white/75">{item.content}</p>

                      {(item.payTerms || typeof item.docCount === "number") && (
                        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                          {item.payTerms && (
                            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/50">
                                <Clock size={11} className="text-gold" /> Pay
                              </span>
                              <span className="text-right text-xs font-semibold text-gold">{item.payTerms}</span>
                            </div>
                          )}
                          {typeof item.docCount === "number" && (
                            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2.5">
                              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/50">
                                <FileText size={11} className="text-gold" /> Documents
                              </span>
                              <span className="text-xs font-semibold text-paper">{item.docCount} required</span>
                            </div>
                          )}
                        </div>
                      )}

                      {item.href && (
                        <div className="mt-4 flex flex-col gap-2">
                          <NextLink
                            href={item.href}
                            onClick={(e) => e.stopPropagation()}
                            className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-yellow px-4 py-2.5 text-xs font-semibold text-black shadow-[0_8px_24px_-8px_rgba(255,208,0,0.6)] transition-all hover:bg-gold active:scale-[0.98]"
                          >
                            Start Onboarding{" "}
                            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                          </NextLink>
                          {item.requirementsHref && (
                            <NextLink
                              href={item.requirementsHref}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:border-gold hover:text-gold"
                            >
                              View Requirements
                            </NextLink>
                          )}
                        </div>
                      )}

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 border-t border-white/10 pt-3">
                          <div className="mb-2 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/55">
                            <LinkIcon size={10} /> Other Authorities
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <button
                                  key={relatedId}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/75 transition-all hover:border-gold hover:bg-white/5 hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={9} className="text-white/50" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
