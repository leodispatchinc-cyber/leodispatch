"use client";

import { trustedBy } from "@/lib/data";

export default function TrustedBy() {
  const items = [...trustedBy, ...trustedBy];
  return (
    <section className="border-y border-line bg-surface/40 py-10">
      <div className="container-x mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted">
        Trusted across the industry — load boards, compliance & factoring partners
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-14">
          {items.map((name, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-2xl font-extrabold tracking-tight text-muted/70 transition-colors hover:text-yellow"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
