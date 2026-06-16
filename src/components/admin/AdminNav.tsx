"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Truck, Menu, X } from "lucide-react";
import { adminNav } from "@/lib/admin";

export default function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // Live unread badge for the chat link
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await fetch("/api/chat/admin", { cache: "no-store" });
        if (!r.ok) return;
        const d = await r.json();
        if (active) {
          const total = (d.conversations || []).reduce(
            (n: number, c: { adminUnread?: number }) => n + (c.adminUnread || 0),
            0
          );
          setUnread(total);
        }
      } catch {
        /* ignore */
      }
    };
    load();
    const t = setInterval(load, 10000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [pathname]);

  // close the mobile drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (slug: string) => {
    const href = `/admin${slug ? `/${slug}` : ""}`;
    if (slug === "") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const links = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {adminNav.map((item) => {
        const active = isActive(item.slug);
        return (
          <Link
            key={item.slug}
            href={`/admin${item.slug ? `/${item.slug}` : ""}`}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-yellow/10 text-gold" : "text-muted hover:bg-surface-2 hover:text-paper"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{item.label}</span>
            {item.slug === "chat" && unread > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-yellow px-1.5 text-[11px] font-bold text-black">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <Link href="/" className="flex items-center gap-2.5 border-b border-line px-6 py-5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-yellow text-black">
        <Truck className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-base font-extrabold">
        LEO<span className="text-yellow"> ADMIN</span>
      </span>
    </Link>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        {brand}
        {links}
        <div className="border-t border-line p-4 text-xs text-muted">Connect Supabase to power live data.</div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-paper"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display text-sm font-extrabold">
          LEO<span className="text-yellow"> ADMIN</span>
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow text-sm font-bold text-black">A</span>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col border-r border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line pr-3">
              {brand}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted hover:text-paper"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {links}
          </div>
        </div>
      )}
    </>
  );
}
