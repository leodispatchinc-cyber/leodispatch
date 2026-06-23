import { UserCog, ShieldCheck, Headset, FileSearch, Check } from "lucide-react";
import { mcCompanies } from "@/lib/companies";

/**
 * Admin team, roles and the authorities each member manages.
 * Seeded for now — wire Supabase Auth (env keys) to manage real users + sessions.
 */

const ROLES = [
  {
    key: "super-admin",
    label: "Super Admin",
    icon: ShieldCheck,
    desc: "Full access — manage users, all authorities, settings and billing.",
    perms: ["All authorities", "User management", "Approve / reject", "Edit MC companies"],
  },
  {
    key: "dispatcher",
    label: "Dispatcher",
    icon: Headset,
    desc: "Works leads and onboards carriers for assigned authorities.",
    perms: ["Assigned authorities", "View leads & operators", "Approve / reject"],
  },
  {
    key: "verifier",
    label: "Document Verifier",
    icon: FileSearch,
    desc: "Reviews and verifies uploaded carrier documents.",
    perms: ["View documents", "Verify documents", "Approve / reject"],
  },
];

const allAuthorities = mcCompanies.map((c) => c.name).join(", ");

export default function UserManagement() {
  // The dashboard uses a single secure admin sign-in configured via env vars.
  const admin = {
    name: "Administrator",
    email: process.env.ADMIN_NOTIFY_EMAIL || "admin@leodispatchinc.com",
    username: process.env.ADMIN_USERNAME || "admin",
    role: "Super Admin",
    authorities: allAuthorities,
    initials: "A",
  };
  const TEAM = [admin];

  return (
    <div className="mt-6 space-y-8">
      {/* Team table */}
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Authorities</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map((u) => (
              <tr key={u.email} className="border-t border-line">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-yellow text-sm font-bold text-black">
                      {u.initials}
                    </span>
                    <div>
                      <div className="font-medium text-paper">{u.name}</div>
                      <div className="text-xs text-muted">{u.email}</div>
                      <div className="text-[11px] text-muted/70">Login: {u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted">{u.role}</td>
                <td className="px-5 py-3 text-muted">{u.authorities}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Roles & permissions */}
      <div>
        <h2 className="font-display text-lg font-bold">Roles &amp; permissions</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r.key} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-yellow/15 text-gold">
                  <r.icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="font-display text-base font-bold">{r.label}</h3>
              </div>
              <p className="mt-3 text-sm text-muted">{r.desc}</p>
              <ul className="mt-4 space-y-2">
                {r.perms.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-paper">
                    <Check className="h-4 w-4 shrink-0 text-success" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="flex items-center gap-2 rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-xs text-muted">
        <UserCog className="h-4 w-4 shrink-0 text-gold" />
        This dashboard uses a single secure admin sign-in, configured with the{" "}
        <code className="text-paper">ADMIN_USERNAME</code> / <code className="text-paper">ADMIN_PASSWORD</code>{" "}
        environment variables. The roles above describe the access model for when more team members are added.
      </p>
    </div>
  );
}
