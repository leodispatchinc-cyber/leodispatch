import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { listOnboarding } from "@/lib/store";
import { statusBadge, formatDateTime } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminOnboardingList() {
  const rows = await listOnboarding();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Carrier Onboarding</h1>
          <p className="mt-1 text-sm text-muted">
            Every onboarding submission, with all captured details and uploaded documents.
          </p>
        </div>
        <span className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
          {rows.length} total
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface">
        {rows.length === 0 ? (
          <div className="grid place-items-center px-5 py-20 text-center">
            <ClipboardList className="h-10 w-10 text-gold" />
            <p className="mt-4 max-w-sm text-sm text-muted">
              No onboarding submissions yet. Completed carrier forms from
              <code className="mx-1 text-paper">/onboarding/&lt;company&gt;</code> will land here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Driver</th>
                  <th className="px-5 py-3 font-medium">Authority</th>
                  <th className="px-5 py-3 font-medium">MC / DOT</th>
                  <th className="px-5 py-3 font-medium">Truck</th>
                  <th className="px-5 py-3 font-medium">Docs</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="border-t border-line transition-colors hover:bg-surface-2/40">
                    <td className="px-5 py-3">
                      <div className="font-medium text-paper">{o.fields.driverName || "—"}</div>
                      <div className="text-xs text-muted">{o.fields.email || o.fields.phone || ""}</div>
                    </td>
                    <td className="px-5 py-3 text-muted">{o.companyName}</td>
                    <td className="px-5 py-3 text-muted">
                      {o.fields.mcNumber || "—"}
                      {o.fields.dotNumber ? ` · ${o.fields.dotNumber}` : ""}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {[o.fields.truckMake, o.fields.truckModel].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-5 py-3 text-muted">{o.files.length}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted">{formatDateTime(o.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/onboarding/${o.id}`} className="font-semibold text-gold hover:underline">
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
