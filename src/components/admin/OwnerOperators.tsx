import Link from "next/link";
import { Users } from "lucide-react";
import { listOnboarding } from "@/lib/store";
import { mcCompanies } from "@/lib/companies";
import { statusBadge, formatDate } from "@/lib/admin";
import Empty from "./Empty";

/**
 * Owner-operators are derived from onboarding submissions — each carrier who
 * onboarded under one of the authorities. Approved = active.
 */
export default async function OwnerOperators() {
  const subs = await listOnboarding();

  if (subs.length === 0) {
    return (
      <Empty
        icon={Users}
        label="No owner-operators yet. Carriers who complete an onboarding form appear here as operators, grouped by the authority they leased onto."
      />
    );
  }

  const active = subs.filter((s) => s.status === "approved").length;
  const pending = subs.filter((s) => s.status === "new" || s.status === "in-review").length;

  const stats = [
    { label: "Total operators", value: subs.length },
    { label: "Active (approved)", value: active },
    { label: "Pending review", value: pending },
    { label: "Authorities", value: mcCompanies.length },
  ];

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-2 font-display text-3xl font-extrabold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Operator</th>
              <th className="px-5 py-3 font-medium">Authority</th>
              <th className="px-5 py-3 font-medium">Truck</th>
              <th className="px-5 py-3 font-medium">MC / DOT</th>
              <th className="px-5 py-3 font-medium">Docs</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {subs.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-5 py-3">
                  <div className="font-medium text-paper">{o.fields.driverName || "—"}</div>
                  <div className="text-xs text-muted">{o.fields.email || o.fields.phone || ""}</div>
                </td>
                <td className="px-5 py-3 text-muted">{o.companyName}</td>
                <td className="px-5 py-3 text-muted">
                  {[o.fields.truckYear, o.fields.truckMake, o.fields.truckModel].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="px-5 py-3 text-muted">
                  {o.fields.mcNumber || "—"}
                  {o.fields.dotNumber ? ` · ${o.fields.dotNumber}` : ""}
                </td>
                <td className="px-5 py-3 text-muted">{o.files.length}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted">{formatDate(o.createdAt)}</td>
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
    </div>
  );
}
