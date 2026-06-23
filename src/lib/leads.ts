/* ============================================================
   Lead handling — Supabase (persist) + email notify
   Notifications are sent via Gmail/SMTP (lib/mailer) when SMTP is
   configured, falling back to Resend if a key is present, else they
   log only. If nothing is configured the functions degrade
   gracefully (never throw), so submissions still succeed.
   ============================================================ */

import { isMailConfigured, sendMail } from "./mailer";
import { emailShell, detailsTable, messageBlock, formatWhen } from "./email";

/** Where submission notifications are sent. Overridable via env. */
const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL || "ghufranakram83@gmail.com";

type LeadType = "application" | "contact";

interface Lead {
  type: LeadType;
  [key: string]: unknown;
}

export async function persistLead(table: string, payload: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.info(`[leads] Supabase not configured — skipping persist to "${table}"`, payload);
    return { stored: false };
  }
  try {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    return { stored: res.ok };
  } catch (e) {
    console.error("[leads] persist failed", e);
    return { stored: false };
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|tr|h[1-6]|div|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

/** Email a submission notification. Gmail/SMTP first, then Resend, else log. */
export async function notifyLead(subject: string, html: string) {
  const to = NOTIFY_TO;

  // Preferred: Gmail / SMTP via nodemailer (lib/mailer)
  if (isMailConfigured()) {
    try {
      await sendMail({ to, subject, text: htmlToText(html), html });
      return { sent: true };
    } catch (e) {
      console.error("[leads] SMTP notify failed", e);
      // fall through to Resend if available
    }
  }

  // Fallback: Resend REST API (if a key is configured)
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "Leo Dispatch Inc <onboarding@resend.dev>",
          to: [to],
          subject,
          html,
        }),
      });
      return { sent: res.ok };
    } catch (e) {
      console.error("[leads] Resend notify failed", e);
      return { sent: false };
    }
  }

  console.info(`[leads] email not configured — would notify ${to}: ${subject}`);
  return { sent: false };
}

const LEAD_LABELS: Record<string, string> = {
  name: "Name",
  full_name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  mc_number: "MC Number",
  dot_number: "DOT Number",
  equipment: "Equipment",
  documents: "Documents",
};

export function leadToHtml(lead: Lead) {
  const isContact = lead.type === "contact";
  const pairs: [string, string | undefined][] = [];
  let message: string | undefined;
  for (const [k, v] of Object.entries(lead)) {
    if (k === "type" || k === "created_at") continue;
    if (k === "message") {
      message = String(v);
      continue;
    }
    pairs.push([LEAD_LABELS[k] || k, v == null ? "" : String(v)]);
  }
  let body = detailsTable(pairs);
  if (message) body += messageBlock("Message", message);
  return emailShell({
    eyebrow: isContact ? "Contact" : "Application",
    title: isContact ? "New contact request" : "New carrier application",
    subtitle: typeof lead.created_at === "string" ? `Received ${formatWhen(lead.created_at)}` : undefined,
    bodyHtml: body,
  });
}
