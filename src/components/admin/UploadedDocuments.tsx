import Link from "next/link";
import { FileText, Download, Eye, FolderOpen } from "lucide-react";
import { listOnboarding } from "@/lib/store";
import { mcCompanies } from "@/lib/companies";
import { formatDateTime, formatBytes } from "@/lib/admin";
import Empty from "./Empty";

/**
 * Every document uploaded through the onboarding portal, flattened across all
 * submissions, with view + download links. Grouped/counted by MC authority.
 */
export default async function UploadedDocuments() {
  const subs = await listOnboarding();

  const docs = subs.flatMap((s) =>
    s.files.map((f) => ({
      ...f,
      submissionId: s.id,
      driver: s.fields.driverName || "—",
      companyName: s.companyName,
      companySlug: s.companySlug,
      createdAt: s.createdAt,
    }))
  );

  if (docs.length === 0) {
    return (
      <Empty
        icon={FolderOpen}
        label="No documents uploaded yet. Files a carrier uploads during onboarding (license, COI, W-9, truck pictures…) will appear here, ready to view or download."
      />
    );
  }

  const perCompany = mcCompanies.map((c) => ({
    name: c.name,
    count: docs.filter((d) => d.companySlug === c.slug).length,
  }));

  return (
    <div className="mt-6 space-y-6">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm">
          <FolderOpen className="h-4 w-4 text-gold" />
          <span className="font-semibold text-paper">{docs.length}</span>
          <span className="text-muted">total documents</span>
        </span>
        {perCompany.map((c) => (
          <span
            key={c.name}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted"
          >
            {c.name}
            <span className="font-semibold text-paper">{c.count}</span>
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Document</th>
              <th className="px-5 py-3 font-medium">Carrier</th>
              <th className="px-5 py-3 font-medium">Authority</th>
              <th className="px-5 py-3 font-medium">Size</th>
              <th className="px-5 py-3 font-medium">Uploaded</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => {
              const base = `/api/files/${d.submissionId}/${encodeURIComponent(d.storedName)}`;
              return (
                <tr key={`${d.submissionId}-${d.storedName}`} className="border-t border-line">
                  <td className="px-5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="h-5 w-5 shrink-0 text-gold" />
                      <div className="min-w-0">
                        <div className="font-medium text-paper">{d.label}</div>
                        <div className="truncate text-xs text-muted">{d.originalName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/onboarding/${d.submissionId}`}
                      className="font-medium text-gold hover:underline"
                      title="Open full submission"
                    >
                      {d.driver}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted">{d.companyName}</td>
                  <td className="px-5 py-3 text-muted">{formatBytes(d.size)}</td>
                  <td className="px-5 py-3 text-muted">{formatDateTime(d.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={base}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </a>
                      <a
                        href={`${base}?dl=1`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    </div>
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
