import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, MapPin } from "lucide-react";
import { getOnboarding } from "@/lib/store";
import { getCompany, fullAddress } from "@/lib/companies";
import { statusBadge, formatDateTime, prettyField } from "@/lib/admin";
import StatusActions from "@/components/admin/StatusActions";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { deleteOnboardingAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const GROUPS: { title: string; keys: string[] }[] = [
  { title: "Driver & Contact", keys: ["driverName", "email", "phone", "mcNumber", "dotNumber"] },
  {
    title: "Truck & Equipment",
    keys: ["truckMake", "truckModel", "truckYear", "vin", "truckLength", "truckWidth", "truckHeight", "cargoDimensions"],
  },
  { title: "ELD / Logging", keys: ["eldCompany", "eldUsername", "eldPassword"] },
  { title: "Payment", keys: ["bankName", "accountName", "routingNumber", "accountNumber", "zelle"] },
];

function formatBytes(n: number) {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
}

export default async function OnboardingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sub = await getOnboarding(id);
  if (!sub) notFound();

  const company = getCompany(sub.companySlug);
  const usedKeys = new Set(GROUPS.flatMap((g) => g.keys));
  const otherKeys = Object.keys(sub.fields).filter((k) => !usedKeys.has(k));

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/onboarding" className="inline-flex items-center gap-2 text-sm text-muted hover:text-paper">
        <ArrowLeft className="h-4 w-4" /> All onboarding
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">{sub.fields.driverName || "Onboarding submission"}</h1>
          <p className="mt-1 text-sm text-muted">
            {sub.companyName} · submitted {formatDateTime(sub.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2.5">
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusBadge(sub.status)}`}>
            {sub.status}
          </span>
          <StatusActions id={sub.id} current={sub.status} />
        </div>
      </div>

      {/* Field groups */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {GROUPS.map((g) => {
          const entries = g.keys.filter((k) => sub.fields[k]);
          if (entries.length === 0) return null;
          return (
            <div key={g.title} className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold">{g.title}</h2>
              <dl className="mt-3 flex flex-col gap-2.5">
                {entries.map((k) => (
                  <div key={k} className="flex justify-between gap-4 text-sm">
                    <dt className="text-muted">{prettyField(k)}</dt>
                    <dd className="break-all text-right font-medium text-paper">{sub.fields[k]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}

        {otherKeys.length > 0 && (
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold">Other</h2>
            <dl className="mt-3 flex flex-col gap-2.5">
              {otherKeys.map((k) => (
                <div key={k} className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted">{prettyField(k)}</dt>
                  <dd className="break-all text-right font-medium text-paper">{sub.fields[k]}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* COI holder */}
      {company?.coiHolder && company.coiHolder.name && (
        <div className="mt-5 rounded-2xl border border-gold/30 bg-yellow/[0.04] p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
            <MapPin className="h-3.5 w-3.5" /> COI Certificate Holder (required)
          </div>
          <p className="mt-2 text-sm text-paper">
            {company.coiHolder.name} — {fullAddress({
              line1: company.coiHolder.line1,
              city: company.coiHolder.city,
              state: company.coiHolder.state,
              zip: company.coiHolder.zip,
            })}
          </p>
        </div>
      )}

      {/* Documents */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold">
          Uploaded Documents ({sub.files.length})
        </h2>
        {sub.files.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No files were uploaded with this submission.</p>
        ) : (
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {sub.files.map((f) => (
              <li
                key={f.storedName}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-5 w-5 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-paper">{f.label}</div>
                    <div className="truncate text-xs text-muted">
                      {f.originalName} · {formatBytes(f.size)}
                    </div>
                  </div>
                </div>
                <a
                  href={`/api/files/${sub.id}/${encodeURIComponent(f.storedName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <Download className="h-3.5 w-3.5" /> Open
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Danger zone */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-500/25 bg-red-500/[0.03] p-5">
        <div>
          <div className="text-sm font-semibold text-paper">Delete this submission</div>
          <div className="mt-0.5 text-xs text-muted">
            Permanently removes the record and its {sub.files.length} uploaded file
            {sub.files.length === 1 ? "" : "s"} from storage. This cannot be undone.
          </div>
        </div>
        <ConfirmDeleteButton
          action={deleteOnboardingAction.bind(null, sub.id)}
          label="Delete submission"
          confirmText={`Permanently delete ${
            sub.fields.driverName || "this submission"
          } and all uploaded files? This cannot be undone.`}
        />
      </div>
    </div>
  );
}
