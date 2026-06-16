"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { dispatchServices } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";

export default function DispatchServices() {
  return (
    <section id="services" className="container-x scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Dispatch Services"
        title={<>Everything handled, <span className="text-gradient-gold">end to end</span></>}
        subtitle="From the first broker call to the final invoice — your back office, covered."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dispatchServices.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
            className="group flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:border-gold/40 hover:bg-surface-2"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink font-display text-sm font-bold text-gold">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted transition-all group-hover:-translate-y-0.5 group-hover:text-gold" />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
