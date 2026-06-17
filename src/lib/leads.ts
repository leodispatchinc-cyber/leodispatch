/* ============================================================
   Lead handling — Supabase (persist) + Resend (notify)
   Implemented with plain fetch against each service's REST API
   so we ship ZERO heavy SDKs. If env keys are missing the
   functions degrade gracefully (log only) and never throw.
   ============================================================ */

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

export async function notifyLead(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.info(`[leads] Resend not configured — would email: ${subject}`);
    return { sent: false };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Leo Dispatch Inc <onboarding@leodispatchinc.com>",
        to: [to],
        subject,
        html,
      }),
    });
    return { sent: res.ok };
  } catch (e) {
    console.error("[leads] notify failed", e);
    return { sent: false };
  }
}

export function leadToHtml(lead: Lead) {
  const rows = Object.entries(lead)
    .map(([k, v]) => `<tr><td style="padding:4px 12px;color:#888">${k}</td><td style="padding:4px 12px"><b>${String(v)}</b></td></tr>`)
    .join("");
  return `<h2>New ${lead.type}</h2><table>${rows}</table>`;
}
