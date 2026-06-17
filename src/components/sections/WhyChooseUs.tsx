"use client";

import { motion } from "framer-motion";
import { whyChoose } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";

export default function WhyChooseUs() {
  return (
    <section className="container-x py-24 sm:py-32">
      <SectionHeading
        eyebrow="Why Owner Operators Choose Leo Dispatch Inc"
        title={<>Built to make your truck <span className="text-gradient-gold">more profitable</span></>}
        subtitle="The things every owner operator actually wants from a dispatcher — done right."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whyChoose.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
            className="group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-surface to-ink p-6 transition-all duration-300 hover:border-gold/50"
          >
            <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-yellow text-black shadow-[0_6px_24px_-8px_rgba(255,208,0,0.6)] transition-transform duration-300 group-hover:scale-110">
              <c.icon className="h-6 w-6" strokeWidth={2.2} />
            </div>
            <h3 className="font-display text-lg font-bold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
