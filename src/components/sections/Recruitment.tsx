"use client";

import { motion } from "framer-motion";
import { Truck, ArrowRight } from "lucide-react";
import { recruitmentRoles } from "@/lib/data";

export default function Recruitment() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-ink py-24 sm:py-32">
      {/* Convoy animation */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        {[20, 45, 70].map((top, row) => (
          <div
            key={top}
            className="absolute flex gap-24"
            style={{
              top: `${top}%`,
              animation: `marquee ${22 + row * 6}s linear infinite`,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <Truck key={i} className="h-10 w-10 shrink-0 text-yellow" strokeWidth={1.5} />
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent,rgba(0,0,0,0.85))]" />

      <div className="container-x relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            We&apos;re Hiring · Recruitment
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-black tracking-tight sm:text-6xl">
            LOOKING FOR <span className="text-gradient-gold">OWNER OPERATORS</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Join the fastest-growing owner-operator network in the USA. Pick your lane and apply today.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recruitmentRoles.map((r, i) => (
            <motion.a
              key={r.title}
              href="/onboarding"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex flex-col rounded-2xl border border-line bg-surface/80 p-6 text-left backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60"
            >
              <Truck className="mb-4 h-8 w-8 text-gold transition-transform group-hover:scale-110" />
              <h3 className="font-display text-lg font-bold">{r.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-muted">{r.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow">
                Apply <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
