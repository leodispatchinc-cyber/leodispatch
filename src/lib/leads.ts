/* ============================================================
   Lead handling — Supabase (persist) + email notify
   Notifications are sent via Gmail/SMTP (lib/mailer) when SMTP is
   configured, falling back to Resend if a key is present, else they
   log only. If nothing is configured the functions degrade
   gracefully (never throw), so submissions still succeed.
   ============================================================ */

import { isMailConfigured, sendMail } from "./mailer";

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

export function leadToHtml(lead: Lead) {
  const rows = Object.entries(lead)
    .map(([k, v]) => `<tr><td style="padding:4px 12px;color:#888">${k}</td><td style="padding:4px 12px"><b>${String(v)}</b></td></tr>`)
    .join("");
  return `<h2>New ${lead.type}</h2><table>${rows}</table>`;
}
