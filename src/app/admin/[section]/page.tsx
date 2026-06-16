import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Mailbox, FileInput } from "lucide-react";
import { sectionMeta, formatDateTime } from "@/lib/admin";
import { mcCompanies, fullAddress } from "@/lib/companies";
import { listContact, listApplications } from "@/lib/store";
import UploadedDocuments from "@/components/admin/UploadedDocuments";
import DocumentVerification from "@/components/admin/DocumentVerification";
import DispatchLeads from "@/components/admin/DispatchLeads";
import OwnerOperators from "@/components/admin/OwnerOperators";
import AnalyticsView from "@/components/admin/AnalyticsView";
import UserManagement from "@/components/admin/UserManagement";

export const dynamic = "force-dynamic";

export default async function AdminSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const meta = sectionMeta[section];
  if (!meta) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">{meta.title}</h1>
          <p className="mt-1 text-sm text-muted">{meta.desc}</p>
        </div>
      </div>

      {section === "mc-companies" ? (
        <McCompanies />
      ) : section === "contact-requests" ? (
        <ContactRequests />
      ) : section === "applications" ? (
        <Applications />
      ) : section === "uploaded-documents" ? (
        <UploadedDocuments />
      ) : section === "document-verification" ? (
        <DocumentVerification />
      ) : section === "dispatch-leads" ? (
        <DispatchLeads />
      ) : section === "owner-operators" ? (
        <OwnerOperators />
      ) : section === "analytics" ? (
        <AnalyticsView />
      ) : section === "user-management" ? (
        <UserManagement />
      ) : null}
    </div>
  );
}

function McCompanies() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {mcCompanies.map((c) => (
        <div key={c.slug} className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wide text-gold">{c.authorityType}</div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                c.status === "active" ? "bg-success/15 text-success" : "bg-line text-muted"
              }`}
            >
              {c.status === "active" ? "Active" : "Coming Soon"}
            </span>
          </div>
          <h3 className="mt-1 font-display text-lg font-bold">{c.name}</h3>
          {c.status === "active" && (
            <div className="mt-2 flex flex-col gap-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold" /> {fullAddress(c.address)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gold" /> {c.payTerms}
              </span>
            </div>
          )}
          <div className="mt-4 space-y-2">
            {c.documents.map((d) => (
              <label key={d.key} className="flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2 text-sm">
                <input type="checkbox" defaultChecked className="accent-yellow" /> {d.label}
              </label>
            ))}
          </div>
          <Link
            href={c.status === "active" ? `/onboarding/${c.slug}` : "#"}
            className="mt-4 block w-full rounded-full border border-line py-2 text-center text-sm font-medium text-muted hover:text-paper"
          >
            View onboarding page
          </Link>
        </div>
      ))}
    </div>
  );
}

async function ContactRequests() {
  const rows = await listContact();
  if (rows.length === 0) return <EmptyState icon={Mailbox} label="No contact requests yet." />;
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Phone</th>
            <th className="px-5 py-3 font-medium">Message</th>
            <th className="px-5 py-3 font-medium">Received</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-line align-top">
              <td className="px-5 py-3 font-medium text-paper">{r.name || "—"}</td>
              <td className="px-5 py-3 text-muted">{r.email}</td>
              <td className="px-5 py-3 text-muted">{r.phone || "—"}</td>
              <td className="max-w-sm px-5 py-3 text-muted">{r.message || "—"}</td>
              <td className="px-5 py-3 text-muted">{formatDateTime(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function Applications() {
  const rows = await listApplications();
  if (rows.length === 0) return <EmptyState icon={FileInput} label="No applications yet." />;
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Company</th>
            <th className="px-5 py-3 font-medium">MC</th>
            <th className="px-5 py-3 font-medium">Equipment</th>
            <th className="px-5 py-3 font-medium">Received</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-line">
              <td className="px-5 py-3 font-medium text-paper">{r.fields.fullName || "—"}</td>
              <td className="px-5 py-3 text-muted">{r.fields.email || "—"}</td>
              <td className="px-5 py-3 text-muted">{r.fields.company || "—"}</td>
              <td className="px-5 py-3 text-muted">{r.fields.mcNumber || "—"}</td>
              <td className="px-5 py-3 text-muted">{r.fields.equipment || "—"}</td>
              <td className="px-5 py-3 text-muted">{formatDateTime(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon: Icon, label }: { icon: typeof Mailbox; label: string }) {
  return (
    <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-line bg-surface py-20 text-center">
      <Icon className="h-10 w-10 text-gold" />
      <p className="mt-4 max-w-sm text-sm text-muted">{label}</p>
    </div>
  );
}
