import Link from "next/link";
import { ShieldCheck, CheckCircle2, XCircle, Download, ArrowRight } from "lucide-react";
import { listOnboarding } from "@/lib/store";
import { getCompany } from "@/lib/companies";
import { statusBadge, formatDateTime } from "@/lib/admin";
import StatusActions from "./StatusActions";
import Empty from "./Empty";

/**
 * For each submission, check the required document checklist (from the company
 * config) against what was actually uploaded, then let the admin approve / reject.
 */
export default async function DocumentVerification() {
  const subs = await listOnboarding();

  if (subs.length === 0) {
    return (
      <Empty
        icon={ShieldCheck}
        label="Nothing to verify yet. When carriers submit onboarding documents, each submission shows up here with its required-document checklist and approve / reject controls."
      />
    );
  }

  return (
    <div className="mt-6 space-y-5">
      {subs.map((sub) => {
        const company = getCompany(sub.companySlug);
        const required = company?.documents ?? [];
        const uploadedKeys = new Set(sub.files.map((f) => f.key));
        const missing = required.filter((d) => d.required !== false && !uploadedKeys.has(d.key));

        return (
          <div key={sub.id} className="rounded-2xl border border-line bg-surface p-5">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold">{sub.fields.driverName || "Submission"}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(sub.status)}`}>
                    {sub.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {sub.companyName} · {sub.files.length} file{sub.files.length === 1 ? "" : "s"} · submitted{" "}
                  {formatDateTime(sub.createdAt)}
                </p>
              </div>
              <StatusActions id={sub.id} current={sub.status} />
            </div>

            {/* Checklist */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {required.map((doc) => {
                const file = sub.files.find((f) => f.key === doc.key);
                const ok = !!file;
                return (
                  <div
                    key={doc.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink px-4 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2.5 text-sm">
                      {ok ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                      )}
                      <span className={ok ? "text-paper" : "text-muted"}>{doc.label}</span>
                    </span>
                    {file && (
                      <a
                        href={`/api/files/${sub.id}/${encodeURIComponent(file.storedName)}?dl=1`}
                        className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-gold hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" /> Get
                      </a>
                    )}
                  </div>
                );
              })}
              {required.length === 0 && (
                <p className="text-sm text-muted">No document checklist configured for this authority.</p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {missing.length > 0 ? (
                <p className="text-xs font-medium text-red-400">
                  Missing {missing.length} required: {missing.map((d) => d.label).join(", ")}
                </p>
              ) : (
                <p className="text-xs font-medium text-success">All required documents received.</p>
              )}
              <Link
                href={`/admin/onboarding/${sub.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
              >
                Full details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
