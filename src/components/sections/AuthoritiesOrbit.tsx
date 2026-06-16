"use client";

import { Truck, Boxes, Building2 } from "lucide-react";
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
      <RadialOrbitalTimeline timelineData={timelineData} />
    </section>
  );
}
