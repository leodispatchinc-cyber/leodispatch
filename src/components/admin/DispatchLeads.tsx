import Link from "next/link";
import { Target, ClipboardList, FileInput, Mailbox } from "lucide-react";
import { listOnboarding, listContact, listApplications } from "@/lib/store";
import { formatDateTime } from "@/lib/admin";
import Empty from "./Empty";

type Kind = "Onboarding" | "Application" | "Contact";

interface Lead {
  id: string;
  kind: Kind;
  name: string;
  contact: string;
  detail: string;
  createdAt: string;
  href?: string;
}

const KIND_STYLE: Record<Kind, { cls: string; icon: typeof Target }> = {
  Onboarding: { cls: "bg-yellow/15 text-yellow", icon: ClipboardList },
  Application: { cls: "bg-blue-500/15 text-blue-400", icon: FileInput },
  Contact: { cls: "bg-success/15 text-success", icon: Mailbox },
};

/**
 * One unified inbox of everything inbound — onboarding submissions, carrier
 * applications and contact messages — newest first.
 */
export default async function DispatchLeads() {
  const [onboarding, contact, applications] = await Promise.all([
    listOnboarding(),
    listContact(),
    listApplications(),
  ]);

  const leads: Lead[] = [
    ...onboarding.map((o) => ({
      id: `o-${o.id}`,
      kind: "Onboarding" as const,
      name: o.fields.driverName || "—",
      contact: o.fields.email || o.fields.phone || "—",
      detail: `${o.companyName} · ${o.files.length} doc${o.files.length === 1 ? "" : "s"}`,
      createdAt: o.createdAt,
      href: `/admin/onboarding/${o.id}`,
    })),
    ...applications.map((a) => ({
      id: `a-${a.id}`,
      kind: "Application" as const,
      name: a.fields.fullName || "—",
      contact: a.fields.email || a.fields.phone || "—",
      detail: [a.fields.equipment, a.fields.company].filter(Boolean).join(" · ") || "Carrier application",
      createdAt: a.createdAt,
      href: "/admin/applications",
    })),
    ...contact.map((c) => ({
      id: `c-${c.id}`,
      kind: "Contact" as const,
      name: c.name || "—",
      contact: c.email || c.phone || "—",
      detail: c.message ? c.message.slice(0, 80) : "Contact message",
      createdAt: c.createdAt,
      href: "/admin/contact-requests",
    })),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  if (leads.length === 0) {
    return (
      <Empty
        icon={Target}
        label="No leads yet. Every onboarding submission, carrier application and contact message from the website lands here in one chronological feed."
      />
    );
  }

  const counts = {
    Onboarding: onboarding.length,
    Application: applications.length,
    Contact: contact.length,
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm">
          <Target className="h-4 w-4 text-gold" />
          <span className="font-semibold text-paper">{leads.length}</span>
          <span className="text-muted">total leads</span>
        </span>
        {(Object.keys(counts) as Kind[]).map((k) => (
          <span
            key={k}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${KIND_STYLE[k].cls}`}
          >
            {k}
            <span className="font-bold">{counts[k]}</span>
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Detail</th>
              <th className="px-5 py-3 font-medium">Received</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const style = KIND_STYLE[l.kind];
              return (
                <tr key={l.id} className="border-t border-line">
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.cls}`}>
                      <style.icon className="h-3.5 w-3.5" /> {l.kind}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-paper">{l.name}</td>
                  <td className="px-5 py-3 text-muted">{l.contact}</td>
                  <td className="max-w-xs truncate px-5 py-3 text-muted">{l.detail}</td>
                  <td className="px-5 py-3 text-muted">{formatDateTime(l.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    {l.href && (
                      <Link href={l.href} className="font-semibold text-gold hover:underline">
                        Open
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
