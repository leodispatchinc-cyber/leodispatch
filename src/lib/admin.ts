import {
  LayoutDashboard,
  ClipboardList,
  FileInput,
  ShieldCheck,
  Building2,
  Target,
  Users,
  FolderOpen,
  Mailbox,
  MessageCircle,
  Newspaper,
  BarChart3,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  slug: string;
  label: string;
  icon: LucideIcon;
}

// slug "" === dashboard index (/admin)
export const adminNav: AdminNavItem[] = [
  { slug: "", label: "Dashboard", icon: LayoutDashboard },
  { slug: "onboarding", label: "Carrier Onboarding", icon: ClipboardList },
  { slug: "applications", label: "Applications", icon: FileInput },
  { slug: "document-verification", label: "Document Verification", icon: ShieldCheck },
  { slug: "mc-companies", label: "MC Companies", icon: Building2 },
  { slug: "dispatch-leads", label: "Dispatch Leads", icon: Target },
  { slug: "owner-operators", label: "Owner Operators", icon: Users },
  { slug: "uploaded-documents", label: "Uploaded Documents", icon: FolderOpen },
  { slug: "contact-requests", label: "Contact Requests", icon: Mailbox },
  { slug: "chat", label: "Live Chat", icon: MessageCircle },
  { slug: "blog", label: "Blog", icon: Newspaper },
  { slug: "analytics", label: "Analytics", icon: BarChart3 },
  { slug: "user-management", label: "User Management", icon: UserCog },
];

/* ── Admin display helpers ────────────────────────────────── */
export function statusBadge(status: string): string {
  switch (status) {
    case "approved":
      return "bg-success/15 text-success";
    case "in-review":
      return "bg-blue-500/15 text-blue-400";
    case "rejected":
      return "bg-red-500/15 text-red-400";
    case "new":
    default:
      return "bg-yellow/15 text-yellow";
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatBytes(n: number): string {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return `${(n / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
}

// human labels for captured onboarding fields (detail view)
export const fieldLabels: Record<string, string> = {
  driverName: "Driver Name",
  email: "Email",
  phone: "Phone",
  mcNumber: "MC Number",
  dotNumber: "DOT Number",
  truckMake: "Truck Make",
  truckModel: "Truck Model",
  truckYear: "Truck Year",
  vin: "VIN",
  truckLength: "Length",
  truckWidth: "Width",
  truckHeight: "Height",
  cargoDimensions: "Cargo Area",
  eldCompany: "ELD Company",
  eldUsername: "ELD Username",
  eldPassword: "ELD Password",
  bankName: "Bank Name",
  accountName: "Account Holder",
  routingNumber: "Routing Number",
  accountNumber: "Account Number",
  zelle: "Zelle",
};

export function prettyField(key: string): string {
  return fieldLabels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

// fields shown masked in the table preview but visible on the detail page
export const sensitiveFields = new Set(["eldPassword", "accountNumber", "routingNumber"]);

export const sectionMeta: Record<string, { title: string; desc: string }> = {
  applications: { title: "Applications", desc: "Review and process new carrier applications." },
  "document-verification": { title: "Document Verification", desc: "Verify uploaded MC, insurance, W9 and licensing documents." },
  "mc-companies": { title: "MC Companies", desc: "Your MC authorities and the documents each one requires during onboarding." },
  "dispatch-leads": { title: "Dispatch Leads", desc: "Inbound dispatch leads from the site and campaigns." },
  "owner-operators": { title: "Owner Operators", desc: "Active owner-operators, equipment and assigned dispatchers." },
  "uploaded-documents": { title: "Uploaded Documents", desc: "All documents uploaded through the onboarding portal." },
  "contact-requests": { title: "Contact Requests", desc: "Messages submitted through the contact form." },
  blog: { title: "Blog", desc: "Create and manage SEO blog posts across all categories." },
  analytics: { title: "Analytics", desc: "Traffic, conversion and revenue performance." },
  "user-management": { title: "User Management", desc: "Admin users, roles and permissions." },
};
