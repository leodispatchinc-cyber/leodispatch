import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Clock, Check, Phone, ShieldCheck, ClipboardList } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import OnboardingForm from "@/components/OnboardingForm";
import AgreementSigner from "@/components/AgreementSigner";
import { mcCompanies, getCompany, fullAddress } from "@/lib/companies";
import { getAgreement } from "@/lib/agreements";
import { site } from "@/lib/data";

export function generateStaticParams() {
  return mcCompanies.map((c) => ({ company: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const c = getCompany(company);
  return {
    title: c ? `${c.name} — Carrier Onboarding | Leo Dispatch Inc` : "Carrier Onboarding — Leo Dispatch Inc",
    description: c?.tagline,
  };
}

export default async function CompanyOnboardingPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const c = getCompany(company);
  if (!c) notFound();

  const agreement = getAgreement(c.slug);

  // Coming-soon authorities show a holding page instead of a form.
  if (c.status !== "active") {
    return (
      <>
        <PageHeader
          eyebrow={c.authorityType}
          title={c.name}
          subtitle="Onboarding for this authority is being finalized. Check back soon."
        />
        <section className="container-x grid place-items-center py-24 text-center">
          <p className="max-w-md text-muted">
            We&apos;re setting up the document requirements for this authority. In the meantime, you can
            start with an available authority or reach out and we&apos;ll help you directly.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 text-sm font-semibold text-black hover:bg-gold"
            >
              View available authorities
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-paper hover:border-gold hover:text-gold"
            >
              Contact us
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={`${c.authorityType} · Onboarding`}
        title={c.name}
        subtitle={c.tagline}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-muted">
          <MapPin className="h-4 w-4 text-gold" /> {fullAddress(c.address)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-yellow/5 px-4 py-2 text-sm font-semibold text-gold">
          <Clock className="h-4 w-4" /> {c.payTerms}
        </span>
        <Link
          href={`/onboarding/${c.slug}/requirements`}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-muted transition-colors hover:border-gold hover:text-gold"
        >
          <ClipboardList className="h-4 w-4 text-gold" /> View full requirements
        </Link>
      </PageHeader>

      <section className="container-x py-14 sm:py-20">
        <Link
          href="/onboarding"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper"
        >
          <ArrowLeft className="h-4 w-4" /> All authorities
        </Link>

        <div className="grid gap-8 lg:grid-cols-[330px_1fr]">
          {/* Sidebar */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-paper">
                Documents you&apos;ll need
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.documents.map((d) => (
                  <li key={d.key} className="flex items-center gap-2.5 text-sm">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-paper/90">{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {c.coiHolder.name && (
              <div className="rounded-2xl border border-gold/30 bg-yellow/[0.04] p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gold">
                  COI Certificate Holder
                </h3>
                <div className="mt-2 text-sm">
                  <div className="font-semibold text-paper">{c.coiHolder.name}</div>
                  <div className="text-muted">
                    {c.coiHolder.line1}
                    <br />
                    {c.coiHolder.city}, {c.coiHolder.state} {c.coiHolder.zip}
                  </div>
                </div>
                {c.coiRequirements && c.coiRequirements.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2 border-t border-gold/20 pt-4">
                    {c.coiRequirements.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-xs text-paper/90">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" /> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-paper">
                <ShieldCheck className="h-4 w-4 text-gold" /> Secure submission
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Your information is sent directly to the onboarding team and used only for dispatch,
                payment and compliance.
              </p>
              <a
                href={site.phoneHref}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline"
              >
                <Phone className="h-4 w-4" /> {site.phone}
              </a>
            </div>
          </aside>

          {/* Form */}
          <div>
            {agreement && (
              <div className="mb-6">
                <AgreementSigner companySlug={c.slug} companyName={c.name} agreement={agreement} />
              </div>
            )}
            <OnboardingForm company={c} />
          </div>
        </div>
      </section>
    </>
  );
}
