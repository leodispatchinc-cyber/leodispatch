import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Lock, FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { mcCompanies, companyLocation } from "@/lib/companies";

export const metadata = pageMetadata({
  title: "Carrier Onboarding — Leo Dispatch Inc",
  description:
    "Choose your MC authority and complete onboarding online. Upload your documents once and start booking loads fast.",
  path: "/onboarding",
});

export default function OnboardingIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Carrier Onboarding"
        title={<>Choose Your <span className="text-gradient-gold">MC Authority</span></>}
        subtitle="Select the authority you're leasing onto and complete your document upload. It only takes a few minutes."
      />

      <section className="container-x py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {mcCompanies.map((c) => {
            const active = c.status === "active";
            return (
              <div
                key={c.slug}
                className="flex flex-col rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:border-gold/40"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {c.authorityType}
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold">{c.name}</h2>

                {active ? (
                  <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gold" /> {companyLocation(c)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gold" /> {c.payTerms}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-gold" /> {c.documents.length} documents required
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 flex-1 text-sm text-muted">{c.tagline}</p>
                )}

                <div className="mt-auto pt-7">
                  {active ? (
                    <div className="flex flex-col gap-2.5">
                      <Link
                        href={`/onboarding/${c.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
                      >
                        Begin Onboarding <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/onboarding/${c.slug}/requirements`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-muted transition-all hover:border-gold hover:text-gold"
                      >
                        View Requirements
                      </Link>
                    </div>
                  ) : (
                    <span className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-muted">
                      <Lock className="h-4 w-4" /> Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted">
          Not sure which authority is right for you?{" "}
          <Link href="/contact" className="text-gold hover:underline">
            Talk to a dispatcher
          </Link>{" "}
          and we&apos;ll point you in the right direction.
        </p>
      </section>
    </>
  );
}
