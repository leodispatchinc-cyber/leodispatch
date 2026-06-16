"use client";

import { freightLanes } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

// Build a gentle curved path between two points (percent coords on a 100x100 grid)
function lanePath(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2;
  const cy = Math.min(y1, y2) - 12;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function FreightMap() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Live Freight Map"
          title={<>Loads moving across <span className="text-gradient-gold">48 states</span> — right now</>}
          subtitle="Real lanes our carriers run every week. This is what keeping trucks moving looks like."
        />

        <Reveal className="mt-14">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface to-ink p-4 sm:p-8">
            <svg viewBox="0 0 100 70" className="w-full" preserveAspectRatio="xMidYMid meet">
              {/* Stylized continental glow */}
              <ellipse cx="50" cy="40" rx="46" ry="26" fill="rgba(255,208,0,0.04)" />
              <defs>
                <linearGradient id="lane" x1="0" x2="1">
                  <stop offset="0" stopColor="#f4b400" stopOpacity="0.2" />
                  <stop offset="0.5" stopColor="#ffd000" stopOpacity="1" />
                  <stop offset="1" stopColor="#f4b400" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* dotted map field */}
              {Array.from({ length: 11 }).map((_, r) =>
                Array.from({ length: 18 }).map((_, c) => (
                  <circle
                    key={`${r}-${c}`}
                    cx={5 + c * 5.2}
                    cy={8 + r * 5.2}
                    r="0.35"
                    fill="#262626"
                  />
                ))
              )}

              {freightLanes.map((l, i) => {
                const y1 = l.y1 * 0.7;
                const y2 = l.y2 * 0.7;
                const d = lanePath(l.x1, y1, l.x2, y2);
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke="url(#lane)" strokeWidth="0.6" strokeLinecap="round" />
                    <path
                      d={d}
                      fill="none"
                      stroke="#ffd000"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeDasharray="2 6"
                      style={{ animation: `lane-flow ${6 + i}s linear infinite` }}
                    />
                    {/* moving truck */}
                    <circle r="1.1" fill="#ffd000">
                      <animateMotion dur={`${5 + i}s`} repeatCount="indefinite" path={d} rotate="auto" />
                    </circle>
                    {/* city nodes */}
                    <City x={l.x1} y={y1} label={l.from} />
                    <City x={l.x2} y={y2} label={l.to} />
                  </g>
                );
              })}
            </svg>

            {/* Lane legend */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {freightLanes.map((l) => (
                <div
                  key={`${l.from}-${l.to}`}
                  className="flex items-center gap-2 rounded-xl border border-line bg-ink px-3 py-2.5 text-xs"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow" />
                  <span className="font-medium text-paper">{l.from}</span>
                  <span className="text-muted">→</span>
                  <span className="font-medium text-paper">{l.to}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function City({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="1.4" fill="#ffd000" />
      <circle cx={x} cy={y} r="1.4" fill="none" stroke="#ffd000" strokeWidth="0.3">
        <animate attributeName="r" values="1.4;3.2;1.4" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <text x={x} y={y - 2.4} fontSize="2.2" fill="#a1a1aa" textAnchor="middle" className="font-medium">
        {label}
      </text>
    </g>
  );
}
