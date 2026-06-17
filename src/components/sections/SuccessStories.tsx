"use client";

import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";

export default function SuccessStories() {
  const items = [...testimonials, ...testimonials];
  return (
    <section className="overflow-hidden border-y border-line bg-surface/30 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Success Stories"
          title={<>Real carriers. <span className="text-gradient-gold">Real revenue.</span></>}
          subtitle="Owner operators who switched to Leo Dispatch Inc and never looked back."
        />
      </div>

      <div className="group relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
          {items.map((t, i) => (
            <article
              key={i}
              className="flex w-[340px] shrink-0 flex-col rounded-3xl border border-line bg-surface p-7"
            >
              <div className="flex items-center justify-between">
                <Quote className="h-8 w-8 text-gold/40" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-yellow text-yellow" />
                  ))}
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-paper/90">“{t.quote}”</p>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <div>
                  <div className="font-display text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
                <div className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                  {t.earn}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
