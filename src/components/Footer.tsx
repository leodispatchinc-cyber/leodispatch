import Link from "next/link";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { footerColumns, site } from "@/lib/data";
import LeoLogo from "./LeoLogo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="lg:pr-6">
            <Link href="/" className="flex items-center">
              <LeoLogo className="h-14" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              The fastest-growing owner-operator recruitment and dispatch platform in the USA.
              We find the loads. You drive.
            </p>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-muted">
              <li>
                <a href={site.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-yellow">
                  <Phone className="h-4 w-4 text-gold" /> {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-yellow">
                  <Mail className="h-4 w-4 text-gold" /> {site.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" /> {site.hours}
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> {site.location}
              </li>
            </ul>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-paper">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-yellow"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer transition-colors hover:text-paper">Privacy Policy</span>
            <span className="cursor-pointer transition-colors hover:text-paper">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
