import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Mail,
  Check,
  ShieldCheck,
  FileText,
  ClipboardList,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { mcCompanies, getCompany, fullAddress } from "@/lib/companies";
import { getAgreement } from "@/lib/agreements";
import AgreementSigner from "@/components/AgreementSigner";

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
    title: c ? `${c.name} — Document Requirements | Leo Dispatch Inc` : "Document Requirements — Leo Dispatch Inc",
    description: c ? `Documents and information required to onboard with ${c.name}.` : undefined,
  };
}

export default async function RequirementsPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const c = getCompany(company);
  if (!c) notFound();

  const agreement = getAgreement(c.slug);
  const info: string[] = ["Driver full name", "Phone number", "Email", "MC number", "DOT number"];
  if (c.collectTruck) info.push("Truck make, model, year & VIN");
  if (c.collectTruckDimensions) info.push("Truck dimensions (length, width, height, cargo area)");
  if (c.collectEld) info.push("ELD company name (optional)");
  if (c.collectBanking) info.push("Bank account details for pay");

  const comingSoon = c.status !== "active";

  return (
    <>
      <PageHeader
        eyebrow={`${c.authorityType} · Requirements`}
        title={<>{c.name} <span className="text-gradient-gold">Requirements</span></>}
        subtitle={
          comingSoon
            ? "Onboarding details for this authority are being finalized."
            : "Everything you need to prepare and send to complete your onboarding."
        }
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-muted">
          <MapPin className="h-4 w-4 text-gold" /> {fullAddress(c.address)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-yellow/5 px-4 py-2 text-sm font-semibold text-gold">
          <Clock className="h-4 w-4" /> {c.payTerms}
        </span>
        {c.email && (
          <a
            href={`mailto:${c.email}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-muted transition-colors hover:text-paper"
          >
            <Mail className="h-4 w-4 text-gold" /> {c.email}
          </a>
        )}
      </PageHeader>

      <section className="container-x py-14 sm:py-20">
        <Link
          href={`/onboarding/${c.slug}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper"
        >
          <ArrowLeft className="h-4 w-4" /> Back to onboarding
        </Link>

        {comingSoon ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-surface py-20 text-center">
            <ClipboardList className="h-10 w-10 text-gold" />
            <p className="mt-4 max-w-sm text-sm text-muted">
              We&apos;re finalizing the document requirements for this authority. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
            {/* Main: documents */}
            <div className="flex flex-col gap-5">
              {/* COI holder + insurance requirements */}
              {c.coiHolder.name && (
                <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-yellow/[0.06] to-transparent p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
                    <ShieldCheck className="h-4 w-4" /> Certificate of Insurance — Holder
                  </div>
                  <p className="mt-3 text-sm text-paper/85">
                    Please send your COI (Certificate of Insurance) listing the certificate holder as:
                  </p>
                  <div className="mt-2 text-sm">
                    <div className="font-display text-lg font-bold text-paper">{c.coiHolder.name}</div>
                    <div className="text-muted">
                      {c.coiHolder.line1}
                      <br />
                      {c.coiHolder.city}, {c.coiHolder.state} {c.coiHolder.zip}
                    </div>
                  </div>
                  {c.coiRequirements && c.coiRequirements.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2">
                      {c.coiRequirements.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-paper/90">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Document checklist */}
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h2 className="font-display text-lg font-bold">Documents to send</h2>
                <ol className="mt-5 flex flex-col gap-5">
                  {c.documents.map((d, i) => (
                    <li key={d.key} className="flex gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-sm font-bold text-gold">
                        {i + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 font-medium text-paper">
                          <FileText className="h-4 w-4 text-gold" /> {d.label}
                          {d.required && <span className="text-xs font-normal text-muted">(required)</span>}
                        </div>
                        {d.help && <p className="mt-1 text-sm text-muted">{d.help}</p>}
                        {d.instructions && d.instructions.length > 0 && (
                          <ul className="mt-2 flex flex-col gap-1.5">
                            {d.instructions.map((ins) => (
                              <li key={ins} className="flex items-start gap-1.5 text-sm text-muted">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" /> {ins}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {agreement && (
                <AgreementSigner companySlug={c.slug} companyName={c.name} agreement={agreement} />
              )}
            </div>

            {/* Sidebar: info needed + CTA */}
            <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-paper">
                  Information we&apos;ll ask for
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {info.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-paper/90">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-surface-2 to-ink p-6">
                <h3 className="font-display text-lg font-bold">Ready to submit?</h3>
                <p className="mt-1.5 text-sm text-muted">
                  Have your documents handy and complete onboarding online.
                </p>
                <Link
                  href={`/onboarding/${c.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
                >
                  Start Onboarding <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
