import Link from "next/link";
import { ClipboardList, Mailbox, FileInput, FolderOpen, ArrowRight } from "lucide-react";
import { listOnboarding, listContact, listApplications } from "@/lib/store";
import { statusBadge, formatDateTime } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [onboarding, contact, applications] = await Promise.all([
    listOnboarding(),
    listContact(),
    listApplications(),
  ]);

  const newCount = onboarding.filter((o) => o.status === "new").length;
  const docCount = onboarding.reduce((n, o) => n + o.files.length, 0);

  const stats = [
    { label: "Onboarding Submissions", value: onboarding.length, sub: `${newCount} new`, icon: ClipboardList },
    { label: "Documents Uploaded", value: docCount, sub: "across all carriers", icon: FolderOpen },
    { label: "Contact Requests", value: contact.length, sub: "from the website", icon: Mailbox },
    { label: "Applications", value: applications.length, sub: "general apply form", icon: FileInput },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Live overview of carrier onboarding and inbound leads — captured locally, no external service required.
      </p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">{s.label}</div>
              <s.icon className="h-4 w-4 text-gold" />
            </div>
            <div className="mt-2 font-display text-3xl font-extrabold">{s.value}</div>
            <div className="mt-1 text-xs text-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent onboarding */}
      <div className="mt-8 rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">Recent Onboarding Submissions</h2>
          <Link href="/admin/onboarding" className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {onboarding.length === 0 ? (
          <div className="grid place-items-center px-5 py-16 text-center">
            <ClipboardList className="h-10 w-10 text-gold" />
            <p className="mt-4 max-w-sm text-sm text-muted">
              No submissions yet. When a carrier completes an onboarding form, it will appear here
              with all of their details and uploaded documents.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Driver</th>
                  <th className="px-5 py-3 font-medium">Authority</th>
                  <th className="px-5 py-3 font-medium">MC</th>
                  <th className="px-5 py-3 font-medium">Docs</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {onboarding.slice(0, 8).map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-5 py-3 font-medium text-paper">{o.fields.driverName || "—"}</td>
                    <td className="px-5 py-3 text-muted">{o.companyName}</td>
                    <td className="px-5 py-3 text-muted">{o.fields.mcNumber || "—"}</td>
                    <td className="px-5 py-3 text-muted">{o.files.length}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted">{formatDateTime(o.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/onboarding/${o.id}`} className="text-gold hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
