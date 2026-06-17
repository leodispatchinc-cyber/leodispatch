"use client";

import NextLink from "next/link";
import { Truck, Boxes, Building2, ArrowRight, MapPin, Clock, FileText } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import RadialOrbitalTimeline, { type OrbitalItem } from "../ui/RadialOrbitalTimeline";
import { mcCompanies } from "@/lib/companies";

const iconBySlug: Record<string, React.ElementType> = {
  "move-em-out-llc": Truck,
  "base-cargo-llc": Boxes,
  "silver-arrow-logistics-llc": Building2,
};

const active = mcCompanies.filter((c) => c.status === "active");

const timelineData: OrbitalItem[] = active.map((c, i) => {
  const id = i + 1;
  return {
    id,
    title: c.name.replace(/\s+LLC$/, ""),
    date: `${c.address.city}, ${c.address.state}`,
    content: c.tagline,
    icon: iconBySlug[c.slug] ?? Truck,
    relatedIds: active.map((_, j) => j + 1).filter((rid) => rid !== id),
    status: "completed",
    energy: 100 - i * 8,
    href: `/onboarding/${c.slug}`,
    requirementsHref: `/onboarding/${c.slug}/requirements`,
    payTerms: c.payTerms,
    docCount: c.documents.length,
  };
});

export default function AuthoritiesOrbit() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink pt-20 sm:pt-24">
      {/* warm glow behind the heading + a soft top fade into the section above */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[360px] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(255,200,0,0.08),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />

      <div className="container-x relative z-10">
        <SectionHeading
          eyebrow="Our MC Authorities"
          title={
            <>
              PICK YOUR <span className="text-gradient-gold">AUTHORITY</span>
            </>
          }
          subtitle="Tap an authority to see its pay terms and required documents — then start onboarding in minutes."
        />
      </div>

      {/* Desktop / tablet: the interactive radial orbit */}
      <div className="hidden sm:block">
        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>

      {/* Mobile: a clean, tappable card list (the orbit needs more room than a phone has) */}
      <div className="container-x relative z-10 mt-10 grid gap-4 pb-16 sm:hidden">
        {active.map((c) => {
          const Icon = iconBySlug[c.slug] ?? Truck;
          return (
            <div
              key={c.slug}
              className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/30 bg-ink text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-bold text-paper">
                    {c.name.replace(/\s+LLC$/, "")}
                  </h3>
                  <p className="inline-flex items-center gap-1 text-xs text-muted">
                    <MapPin className="h-3 w-3 text-gold" /> {c.address.city}, {c.address.state}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted">{c.tagline}</p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Clock className="h-3.5 w-3.5 text-gold" /> {c.payTerms}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <FileText className="h-3.5 w-3.5 text-gold" /> {c.documents.length} documents
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <NextLink
                  href={`/onboarding/${c.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-yellow px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
                >
                  Start Onboarding <ArrowRight className="h-4 w-4" />
                </NextLink>
                <NextLink
                  href={`/onboarding/${c.slug}/requirements`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:border-gold hover:text-gold"
                >
                  View Requirements
                </NextLink>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
