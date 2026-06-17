"use client";

import { motion } from "framer-motion";
import { Phone, FileText, UploadCloud, Truck } from "lucide-react";

export default function ContactCTA() {
  return (
    <section id="contact" className="container-x scroll-mt-24 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="group relative overflow-hidden rounded-[2rem] border border-gold/40 bg-gradient-to-br from-surface-2 via-ink to-ink p-10 text-center sm:p-16"
      >
        <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-yellow/10 blur-3xl transition-all duration-500 group-hover:bg-yellow/20" />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />

        <motion.div
          whileHover={{ rotate: [0, -3, 3, -2, 0], x: [0, -2, 2, 0] }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-yellow text-black shadow-glow"
        >
          <Truck className="h-8 w-8" strokeWidth={2.2} />
        </motion.div>

        <h2 className="font-display text-4xl font-black tracking-tight sm:text-6xl">
          READY TO GET <span className="text-gradient-gold">LOADED?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          Talk to a dispatcher today. Most carriers are booking their first load within 24 hours.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="tel:+13605243663"
            className="inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
          >
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-paper transition-all hover:border-gold hover:text-gold active:scale-[0.98]"
          >
            <FileText className="h-4 w-4" /> Apply Now
          </a>
          <a
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-paper transition-all hover:border-gold hover:text-gold active:scale-[0.98]"
          >
            <UploadCloud className="h-4 w-4" /> Upload Documents
          </a>
        </div>
      </motion.div>
    </section>
  );
}
