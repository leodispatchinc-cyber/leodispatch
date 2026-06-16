"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Truck } from "lucide-react";
import { howItWorks } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 70%"],
  });
  const truckX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="container-x scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="How Leo Dispatch Works"
        title={<>From signup to <span className="text-gradient-gold">first load</span> in 24 hours</>}
        subtitle="Four steps. One dedicated dispatcher. Zero paperwork headaches."
      />

      <div ref={ref} className="mt-16">
        {/* Progress lane — its own row ABOVE the cards (desktop only) */}
        <div className="relative mb-10 hidden h-12 lg:block">
          {/* road */}
          <div className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line">
            <motion.div
              style={{ width: lineWidth }}
              className="h-full rounded-full bg-gradient-to-r from-gold to-yellow"
            />
          </div>
          {/* stop markers, aligned to the 4 columns */}
          {howItWorks.map((s, i) => (
            <span
              key={s.step}
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line bg-ink"
              style={{ left: `${(i + 0.5) * 25}%` }}
            />
          ))}
          {/* moving truck — drives along the road, above everything */}
          <motion.div
            style={{ left: truckX }}
            className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full bg-yellow text-black shadow-glow">
              <Truck className="h-5 w-5" strokeWidth={2.4} />
            </div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-4">
          {howItWorks.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-full border border-line bg-ink font-display text-lg font-extrabold text-yellow">
                {s.step}
              </div>
              <h3 className="font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
