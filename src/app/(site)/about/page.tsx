import type { Metadata } from "next";
import { Target, Shield, HeartHandshake, TrendingUp } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import TrustedBy from "@/components/sections/TrustedBy";
import SuccessStories from "@/components/sections/SuccessStories";
import ContactCTA from "@/components/sections/ContactCTA";
import { heroStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Leo Dispatch — Dispatch Built for Owner-Operators",
  description:
    "Leo Dispatch is a dedicated truck dispatch and owner-operator recruitment company. We find the loads. You drive.",
};

const values = [
  {
    icon: Target,
    title: "Driver-First, Always",
    desc: "No forced dispatch, no hidden fees. Every load is your call — we work for you, not the broker.",
  },
  {
    icon: Shield,
    title: "Compliance Made Simple",
    desc: "We keep your FMCSA, IFTA and DOT paperwork current so you stay road-legal and audit-ready.",
  },
  {
    icon: HeartHandshake,
    title: "Real Relationships",
    desc: "One dedicated dispatcher who knows your truck, your lanes and your goals — on a first-name basis.",
  },
  {
    icon: TrendingUp,
    title: "Built to Grow",
    desc: "Start with one truck and scale to a fleet. Our programs and systems grow right alongside you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who We Are"
        title={<>We Find The Loads. <span className="text-gradient-gold">You Drive.</span></>}
        subtitle="Leo Dispatch is a dedicated dispatch and owner-operator recruitment company built to make independent trucking simpler, safer and more profitable."
      />

      {/* Story + stats */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Trucking is hard enough. <span className="text-gradient-gold">Dispatch shouldn&apos;t be.</span>
              </h2>
              <p className="leading-relaxed text-muted">
                We started Leo Dispatch because owner-operators deserve better than call-center
                roulette and forced dispatch. Our model is simple: one dedicated dispatcher per
                carrier, relentless rate negotiation, and paperwork handled end-to-end.
              </p>
              <p className="leading-relaxed text-muted">
                From new MC authorities to growing fleets, we keep trucks loaded with high-RPM
                freight across all 48 states — and we get our carriers paid fast. You focus on the
                miles; we handle everything else.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {heroStats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-line bg-surface p-6 text-center">
                  <div className="font-display text-3xl font-black text-yellow sm:text-4xl">
                    {s.value}
                    {s.suffix}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-line bg-surface/30 py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              What We <span className="text-gradient-gold">Stand For</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-yellow/10 text-gold">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TrustedBy />
      <SuccessStories />
      <ContactCTA />
    </>
  );
}
