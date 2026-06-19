"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star, MapPin, Clock, Lock } from "lucide-react";
import { mcCompanies, companyLocation } from "@/lib/companies";
import SectionHeading from "../ui/SectionHeading";
import ShaderBackground from "../ui/ShaderBackground";
import { cn } from "@/lib/utils";

export default function CarrierPrograms() {
  return (
    <section
      id="carrier-programs"
      className="relative scroll-mt-24 overflow-hidden border-y border-line bg-ink py-24 sm:py-32"
    >
      {/* animated WebGL ring background */}
      <ShaderBackground className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.45]" />
      {/* readability washes over the animation */}
      <div className="pointer-events-none absolute inset-0 bg-ink/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(244,180,0,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Lease-On Programs · MC Authorities"
          title={<>JOIN AN <span className="text-gradient-gold">MC AUTHORITY</span></>}
          subtitle="Lease your truck onto one of our established authorities, upload your documents once, and start booking high-paying loads with dedicated dispatch behind you."
        />

        <div className="mt-16 grid items-start gap-6 lg:grid-cols-3">
          {mcCompanies.map((c, i) => {
            const active = c.status === "active";
            const featured = active && i === 0;
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={cn(
                  "group relative flex flex-col rounded-3xl border p-7 transition-all duration-300",
                  featured
                    ? "border-gold/60 bg-gradient-to-b from-surface-2 to-ink lg:-translate-y-4 ring-gold"
                    : "border-line bg-surface hover:-translate-y-1.5 hover:border-gold/40",
                  !active && "opacity-70"
                )}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                    <Star className="h-3 w-3 fill-black" /> Now Onboarding
                  </span>
                )}

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {c.authorityType}
                </span>
                <h3 className="mt-2 font-display text-2xl font-extrabold">{c.name}</h3>

                {active ? (
                  <div className="mt-2 flex flex-col gap-1 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold" /> {companyLocation(c)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gold" /> {c.payTerms}
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">{c.tagline}</p>
                )}

                <div className="my-6 h-px w-full bg-line" />

                {active ? (
                  <>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Required Documents
                    </p>
                    <ul className="flex flex-1 flex-col gap-2.5">
                      {c.documents.map((doc) => (
                        <li key={doc.key} className="flex items-center gap-2.5 text-sm">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span className="text-paper/90">{doc.label}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-line py-10 text-center text-sm text-muted">
                    Onboarding details coming soon
                  </div>
                )}

                {active ? (
                  <Link
                    href={`/onboarding/${c.slug}`}
                    className={cn(
                      "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98]",
                      featured
                        ? "bg-yellow text-black hover:bg-gold"
                        : "border border-line text-paper hover:border-gold hover:text-gold"
                    )}
                  >
                    Start Onboarding <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="mt-7 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-muted">
                    <Lock className="h-4 w-4" /> Coming Soon
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Document requirements are managed in the admin panel — no code changes needed.
        </p>
      </div>
    </section>
  );
}
