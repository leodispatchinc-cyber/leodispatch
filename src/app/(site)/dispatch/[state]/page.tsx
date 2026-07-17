import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Truck as TruckIcon } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import { dispatchStates, getDispatchState } from "@/lib/states";
import { truckTypes, dispatchServices, testimonials, site } from "@/lib/data";
import { pageMetadata, stateServiceLd, breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return dispatchStates.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const s = getDispatchState(state);
  if (!s) return { title: "Service Areas — Leo Dispatch Inc" };
  return pageMetadata({
    title: `Truck Dispatch in ${s.name} — Leo Dispatch Inc`,
    description: `Dedicated truck dispatch for owner-operators and small fleets running ${s.hubs.join(", ")} and the ${s.corridors.join("/")} corridors. We find the loads, you drive.`,
    path: `/dispatch/${s.slug}`,
  });
}

export default async function StateDispatchPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const s = getDispatchState(state);
  if (!s) notFound();

  const testimonial = testimonials.find((t) => t.role.endsWith(s.abbr));

  return (
    <>
      <JsonLd
        data={[
          stateServiceLd(s.name),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Service Areas", path: "/dispatch" },
            { name: s.name, path: `/dispatch/${s.slug}` },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Service Area"
        title={
          <>
            Truck Dispatch in <span className="text-gradient-gold">{s.name}</span>
          </>
        }
        subtitle={`Dedicated dispatch for owner-operators and small fleets running ${s.hubs.join(", ")} and the ${s.corridors.join(", ")} corridors.`}
      >
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
        >
          Start Onboarding <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-paper transition-all hover:border-gold hover:text-gold"
        >
          Talk to a Dispatcher
        </Link>
      </PageHeader>

      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-muted">
              {s.name} is {s.context}. Whether you&apos;re running {s.hubs.join(", ")}, or passing
              through on {s.corridors.join(", ")}, our dispatchers know the lanes and chase
              rate-per-mile on every load — not just volume.
            </p>

            <h2 className="mt-10 font-display text-2xl font-extrabold">
              What our {s.name} dispatch includes
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {dispatchServices.slice(0, 6).map((d) => (
                <li key={d.title} className="rounded-2xl border border-line bg-surface p-4">
                  <div className="font-display text-sm font-bold text-paper">{d.title}</div>
                  <p className="mt-1 text-xs text-muted">{d.desc}</p>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl font-extrabold">Equipment we dispatch</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {truckTypes.map((t) => (
                <span
                  key={t.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted"
                >
                  <t.icon className="h-4 w-4 text-gold" /> {t.name}
                </span>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-paper">
                Freight corridors we run
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                {s.corridors.map((c) => (
                  <li key={c} className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold" /> {c}
                  </li>
                ))}
              </ul>
            </div>

            {testimonial && (
              <div className="rounded-2xl border border-gold/30 bg-yellow/[0.04] p-6">
                <p className="text-sm italic text-paper/90">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-3 text-xs font-semibold text-gold">
                  {testimonial.name} — {testimonial.role}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-paper">
                <TruckIcon className="h-4 w-4 text-gold" /> Serving all 48 states
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {s.name} is one of our core lanes, and we dispatch nationwide — not just here.
              </p>
              <a
                href={site.phoneHref}
                className="mt-4 inline-flex text-sm font-semibold text-gold hover:underline"
              >
                {site.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
