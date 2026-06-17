"use client";

import NextLink from "next/link";
import { Truck, Boxes, Building2, ArrowRight, MapPin, Clock, FileText } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import RadialOrbitalTimeline, { type OrbitalItem } from "../ui/RadialOrbitalTimeline";
import { mcCompanies } from "@/lib/companies";

const iconBySlug: Record<string, React.ElementType> = {
  "move-em-out-llc": Truck,
  "tulare-trucking-llc": Boxes,
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
              className="overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-gold/40"
            >
              {/* header */}
              <div className="border-b border-line bg-gradient-to-br from-yellow/[0.06] to-transparent p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-yellow/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Onboarding Open
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-muted">
                    <MapPin className="h-3 w-3 text-gold" /> {c.address.city}, {c.address.state}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ffe27a] via-yellow to-gold text-black shadow-md shadow-yellow/25 ring-1 ring-inset ring-white/25">
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <h3 className="min-w-0 truncate font-display text-lg font-bold text-paper">
                    {c.name.replace(/\s+LLC$/, "")}
                  </h3>
                </div>
              </div>

              {/* body */}
              <div className="p-5">
                <p className="text-sm leading-relaxed text-muted">{c.tagline}</p>

                <div className="mt-4 overflow-hidden rounded-xl border border-line bg-ink/40">
                  <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted">
                      <Clock className="h-3.5 w-3.5 text-gold" /> Pay
                    </span>
                    <span className="text-right text-sm font-semibold text-gold">{c.payTerms}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-line px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted">
                      <FileText className="h-3.5 w-3.5 text-gold" /> Documents
                    </span>
                    <span className="text-sm font-semibold text-paper">{c.documents.length} required</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <NextLink
                    href={`/onboarding/${c.slug}`}
                    className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-yellow px-4 py-2.5 text-sm font-semibold text-black shadow-[0_8px_24px_-8px_rgba(255,208,0,0.6)] transition-all hover:bg-gold active:scale-[0.98]"
                  >
                    Start Onboarding{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </NextLink>
                  <NextLink
                    href={`/onboarding/${c.slug}/requirements`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:border-gold hover:text-gold"
                  >
                    View Requirements
                  </NextLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
