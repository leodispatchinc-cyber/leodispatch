import type { ReactNode } from "react";

/**
 * Branded hero band for inner pages. The top padding clears the fixed
 * navbar; the grid + gold glow keep pages visually consistent.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface/30 pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_50%_-10%,rgba(244,180,0,0.16),transparent_60%)]" />
      <div className="container-x relative flex flex-col items-center text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
