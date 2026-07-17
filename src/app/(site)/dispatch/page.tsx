import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { dispatchStates } from "@/lib/states";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Truck Dispatch Service Areas — Leo Dispatch Inc",
  description:
    "Dedicated truck dispatch for owner-operators and small fleets across the USA, with dedicated lane coverage in Texas, California, Georgia, Illinois, Florida, Ohio, Pennsylvania and North Carolina.",
  path: "/dispatch",
});

export default function DispatchIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Service Areas"
        title={
          <>
            Truck Dispatch <span className="text-gradient-gold">Across the USA</span>
          </>
        }
        subtitle="We dispatch owner-operators and small fleets in all 48 states, with dedicated lane coverage in these core freight markets."
      />

      <section className="container-x py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dispatchStates.map((s) => (
            <Link
              key={s.slug}
              href={`/dispatch/${s.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-all hover:border-gold/40"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
                <MapPin className="h-3.5 w-3.5" /> Service Area
              </span>
              <h2 className="mt-2 font-display text-xl font-extrabold">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{s.hubs.slice(0, 3).join(", ")}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold">
                View coverage{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted">
          Running a lane outside these states? We dispatch nationwide.{" "}
          <Link href="/contact" className="text-gold hover:underline">
            Talk to a dispatcher
          </Link>
          .
        </p>
      </section>
    </>
  );
}
