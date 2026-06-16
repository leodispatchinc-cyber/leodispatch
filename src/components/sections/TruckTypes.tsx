"use client";

import { motion } from "framer-motion";
import { truckTypes } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";

export default function TruckTypes() {
  return (
    <section id="equipment" className="scroll-mt-24 border-y border-line bg-surface/30 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Truck Types We Dispatch"
          title={<>Every trailer. <span className="text-gradient-gold">Every lane.</span></>}
          subtitle="Whatever you pull, we keep it loaded with high-paying freight."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {truckTypes.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow/0 blur-2xl transition-all duration-300 group-hover:bg-yellow/15" />
              <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl border border-line bg-ink text-gold transition-all duration-300 group-hover:scale-110 group-hover:border-gold group-hover:bg-yellow group-hover:text-black">
                <t.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg font-bold">{t.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.blurb}</p>
              <div className="mt-4 h-0.5 w-0 bg-yellow transition-all duration-300 group-hover:w-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
