"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import LeoLogo from "./LeoLogo";

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu when the route changes
  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !onHome || open;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "bg-gradient-to-b from-black/90 via-black/55 to-transparent"
          : "bg-transparent"
      )}
    >
      {/* centred logo + links row beneath — Porsche-style, fully transparent */}
      <div className="container-x relative flex flex-col items-center gap-3 py-4 sm:gap-4 sm:py-5">
        <Link href="/" aria-label="Leo Dispatch Inc — home" className="flex items-center">
          <LeoLogo className="h-10 sm:h-12" />
        </Link>

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group relative text-[12.5px] font-medium uppercase tracking-[0.14em] transition-colors",
                isActive(l.href) ? "text-paper" : "text-muted hover:text-paper"
              )}
            >
              {l.label}
              <span
                className={cn(
                  "pointer-events-none absolute -bottom-1.5 left-1/2 h-px -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow to-gold transition-all duration-300",
                  isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="absolute right-5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-white/5 text-paper transition-colors hover:border-gold hover:text-gold lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-black/90 backdrop-blur-xl lg:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3 text-sm font-medium uppercase tracking-wide transition-colors",
                    isActive(l.href)
                      ? "bg-white/5 text-yellow"
                      : "text-muted hover:bg-white/5 hover:text-paper"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/onboarding"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-yellow px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
              >
                Start Onboarding <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
