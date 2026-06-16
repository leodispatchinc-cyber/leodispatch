"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps a whole section and plays a distinct entrance animation the first time
 * it scrolls into view. Sections stay in normal document flow (nothing is
 * pinned or clipped), so each one is fully visible before the next reveals.
 */
export type RevealVariant =
  | "fadeUp"
  | "zoom"
  | "left"
  | "right"
  | "blur"
  | "rise"
  | "flip";

const VARIANTS: Record<RevealVariant, Variants> = {
  fadeUp: { hidden: { opacity: 0, y: 56 }, show: { opacity: 1, y: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -90 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 90 }, show: { opacity: 1, x: 0 } },
  blur: {
    hidden: { opacity: 0, y: 40, filter: "blur(16px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  rise: { hidden: { opacity: 0, y: 110, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1 } },
  flip: { hidden: { opacity: 0, rotateX: -16, y: 44 }, show: { opacity: 1, rotateX: 0, y: 0 } },
};

export default function RevealSection({
  variant = "fadeUp",
  children,
  className,
  duration = 0.8,
}: {
  variant?: RevealVariant;
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={variant === "flip" ? { transformPerspective: 1200 } : undefined}
    >
      {children}
    </motion.div>
  );
}
