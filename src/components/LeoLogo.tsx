import { cn } from "@/lib/utils";

/**
 * Leo Dispatch Inc logo — a crisp, infinitely scalable inline SVG mark.
 * Balanced horizontal lockup: hanging shipping-container icon on the left,
 * then the heavy "LEO" wordmark with a tracked "DISPATCH INC" line beneath it.
 * Size it with a height class via `className` (e.g. "h-10").
 *
 *  - variant="default" → gold-on-dark primary mark
 *  - variant="mono"    → white line-art for inverted / high-contrast use
 */
type Variant = "default" | "mono";

const GOLD_TOP = "#ffd400";
const GOLD_MID = "#f4b400";
const GOLD_LOW = "#d99500";

// Container drawn in its own 0 0 110 100 space, nested + auto-scaled by the parent.
function ContainerIcon({
  stroke,
  doorFill,
  detail,
  uid,
}: {
  stroke: string;
  doorFill: string; // "none" → line-art doors
  detail: string; // colour of door split + handles
  uid: string;
}) {
  const L1 = [38, 49];
  const L2 = [95, 33];
  const L3 = [95, 69];
  const L4 = [38, 85];
  const DBT = [15, 40];
  const DBB = [15, 76];
  const TB = [72, 24];
  const APEX = [55, 7];

  const ridges = Array.from({ length: 9 }, (_, i) => {
    const t = (i + 1) / 10;
    const x = 38 + 57 * t;
    return { x, y1: 49 - 16 * t, y2: 85 - 16 * t };
  });

  const corners = [L1, L2, TB, DBT];

  return (
    <g
      fill="none"
      stroke={stroke}
      strokeWidth={2.4}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {corners.map(([x, y], i) => (
        <line key={`c${i}`} x1={x} y1={y} x2={APEX[0]} y2={APEX[1]} strokeWidth={1.7} />
      ))}
      <circle cx={55} cy={4} r={3} strokeWidth={2} />

      <path d={`M${L1} L${L2} L${TB} L${DBT} Z`} fill={`url(#${uid}-top)`} />

      <path d={`M${L1} L${L2} L${L3} L${L4} Z`} fill={`url(#${uid}-side)`} />
      {ridges.map((r, i) => (
        <line key={`r${i}`} x1={r.x} y1={r.y1} x2={r.x} y2={r.y2} strokeWidth={1.4} />
      ))}

      <path d={`M${L1} L${DBT} L${DBB} L${L4} Z`} fill={doorFill} />
      <g stroke={detail} strokeWidth={2}>
        <line x1={26.5} y1={44.5} x2={26.5} y2={80.5} />
        <line x1={20.5} y1={63} x2={24} y2={63} strokeWidth={2.4} />
        <line x1={29} y1={63} x2={32.5} y2={63} strokeWidth={2.4} />
      </g>
    </g>
  );
}

export default function LeoLogo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: Variant;
}) {
  const mono = variant === "mono";
  const uid = mono ? "leo-mono" : "leo-gold";

  const wordFill = mono ? "#ffffff" : `url(#${uid}-word)`;
  const dispatchFill = mono ? "#ffffff" : GOLD_MID;
  const stroke = mono ? "#ffffff" : GOLD_MID;
  const doorFill = mono ? "none" : `url(#${uid}-door)`;
  const detail = mono ? "#ffffff" : "#0b0b0b";

  return (
    <svg
      viewBox="0 0 345 116"
      className={cn("w-auto", className)}
      role="img"
      aria-label="Leo Dispatch Inc"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`${uid}-word`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mono ? "#fff" : GOLD_TOP} />
          <stop offset="60%" stopColor={mono ? "#fff" : GOLD_MID} />
          <stop offset="100%" stopColor={mono ? "#fff" : GOLD_LOW} />
        </linearGradient>
        <linearGradient id={`${uid}-door`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_TOP} />
          <stop offset="100%" stopColor={GOLD_LOW} />
        </linearGradient>
        <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,212,0,0.18)" />
          <stop offset="100%" stopColor="rgba(255,212,0,0.04)" />
        </linearGradient>
        <linearGradient id={`${uid}-side`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,212,0,0.10)" />
          <stop offset="100%" stopColor="rgba(255,212,0,0.02)" />
        </linearGradient>
      </defs>

      {/* hanging shipping container — left brand mark */}
      <svg x={0} y={9} width={104} height={95} viewBox="0 0 110 100" overflow="visible">
        <ContainerIcon stroke={stroke} doorFill={doorFill} detail={detail} uid={uid} />
      </svg>

      {/* LEO wordmark */}
      <text
        x={116}
        y={70}
        fontSize={70}
        fontWeight={900}
        letterSpacing="-2"
        fill={wordFill}
        style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
      >
        LEO
      </text>

      {/* DISPATCH INC lockup beneath — width locked so the tracking stays even */}
      <text
        x={119}
        y={101}
        fontSize={23}
        fontWeight={700}
        textLength={215}
        lengthAdjust="spacing"
        fill={dispatchFill}
        style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
      >
        DISPATCH INC
      </text>
    </svg>
  );
}
