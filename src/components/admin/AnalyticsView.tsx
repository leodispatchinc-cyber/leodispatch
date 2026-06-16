import { ClipboardList, FolderOpen, Mailbox, FileInput, TrendingUp } from "lucide-react";
import { listOnboarding, listContact, listApplications } from "@/lib/store";
import { mcCompanies } from "@/lib/companies";

/**
 * Performance overview computed entirely from the local store — no external
 * analytics service required. (Connect Supabase/GA later for traffic data.)
 */
export default async function AnalyticsView() {
  const [onboarding, contact, applications] = await Promise.all([
    listOnboarding(),
    listContact(),
    listApplications(),
  ]);

  const docCount = onboarding.reduce((n, o) => n + o.files.length, 0);
  const approved = onboarding.filter((o) => o.status === "approved").length;
  const totalInbound = onboarding.length + contact.length + applications.length;
  const conversion = onboarding.length ? Math.round((approved / onboarding.length) * 100) : 0;

  const cards = [
    { label: "Onboarding submissions", value: onboarding.length, icon: ClipboardList },
    { label: "Documents collected", value: docCount, icon: FolderOpen },
    { label: "Applications", value: applications.length, icon: FileInput },
    { label: "Contact messages", value: contact.length, icon: Mailbox },
  ];

  // breakdowns
  const statusKeys = ["new", "in-review", "approved", "rejected"] as const;
  const statusLabels: Record<string, string> = {
    new: "New",
    "in-review": "In review",
    approved: "Approved",
    rejected: "Rejected",
  };
  const statusColors: Record<string, string> = {
    new: "bg-yellow",
    "in-review": "bg-blue-400",
    approved: "bg-success",
    rejected: "bg-red-400",
  };
  const byStatus = statusKeys.map((k) => ({
    key: k,
    label: statusLabels[k],
    color: statusColors[k],
    count: onboarding.filter((o) => o.status === k).length,
  }));

  const byCompany = mcCompanies.map((c) => ({
    name: c.name,
    count: onboarding.filter((o) => o.companySlug === c.slug).length,
  }));
  const companyMax = Math.max(1, ...byCompany.map((c) => c.count));

  return (
    <div className="mt-6 space-y-6">
      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">{s.label}</div>
              <s.icon className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-2 font-display text-3xl font-extrabold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gold">
            <TrendingUp className="h-4 w-4" /> Onboarding → Approved
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-5xl font-extrabold">{conversion}%</span>
            <span className="mb-1.5 text-sm text-muted">
              {approved} of {onboarding.length} approved
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink">
            <div className="h-full rounded-full bg-yellow" style={{ width: `${conversion}%` }} />
          </div>
          <p className="mt-4 text-xs text-muted">
            {totalInbound} total inbound leads captured across the site.
          </p>
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="text-sm font-bold uppercase tracking-wide text-gold">Submissions by status</div>
          <div className="mt-4 space-y-3">
            {byStatus.map((s) => {
              const pct = onboarding.length ? Math.round((s.count / onboarding.length) * 100) : 0;
              return (
                <div key={s.key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{s.label}</span>
                    <span className="font-semibold text-paper">{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* By authority */}
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="text-sm font-bold uppercase tracking-wide text-gold">Submissions by authority</div>
        <div className="mt-4 space-y-4">
          {byCompany.map((c) => (
            <div key={c.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted">{c.name}</span>
                <span className="font-semibold text-paper">{c.count}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-ink">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-yellow"
                  style={{ width: `${Math.round((c.count / companyMax) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
