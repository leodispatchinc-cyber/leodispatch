import type { Metadata } from "next";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Leo Dispatch Inc — Talk to a Dispatcher 24/7",
  description:
    "Get in touch with Leo Dispatch Inc. Call, email or send a message and a dedicated dispatcher will reach out fast.",
};

const channels = [
  { icon: Phone, label: "Call Us", value: site.phone, href: site.phoneHref },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Clock, label: "Hours", value: site.hours },
  { icon: MapPin, label: "Coverage", value: site.location },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title={<>Talk To A <span className="text-gradient-gold">Dispatcher</span></>}
        subtitle="Questions about onboarding, rates or equipment? Reach out and we'll get right back to you."
      />

      <section className="container-x py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Channels */}
          <div className="flex flex-col gap-4">
            {channels.map((c) => {
              const inner = (
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:border-gold/40">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-yellow/10 text-gold">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted">{c.label}</div>
                    <div className="mt-0.5 font-medium text-paper">{c.value}</div>
                  </div>
                </div>
              );
              return c.href ? (
                <a key={c.label} href={c.href}>
                  {inner}
                </a>
              ) : (
                <div key={c.label}>{inner}</div>
              );
            })}
            <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-surface-2 to-ink p-6">
              <h3 className="font-display text-lg font-bold">Ready to onboard?</h3>
              <p className="mt-1.5 text-sm text-muted">
                Skip the call and start your document upload now.
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-flex rounded-full bg-yellow px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gold"
              >
                Start Onboarding
              </a>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
