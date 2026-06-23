/* Branded HTML email building blocks for notification emails.
   Table-based + inline styles for broad email-client support, and a
   UTF-8 doctype so special characters (—, ', etc.) render correctly. */

const BRAND = "#FFD400";
const INK = "#0a0a0a";
const SITE = "https://leodispatchinc.com";

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** "driverName" / "mc_number" → "Driver Name" / "Mc Number". */
export function labelize(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatWhen(iso?: string): string {
  if (!iso) return "";
  try {
    return (
      new Date(iso).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }) + " UTC"
    );
  } catch {
    return "";
  }
}

/** Labeled key/value rows. Blank values are skipped. */
export function detailsTable(pairs: [string, string | undefined][]): string {
  const rows = pairs
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([label, val]) => `<tr>
        <td style="padding:9px 16px 9px 0;color:#6b7280;font-size:13px;width:150px;vertical-align:top;border-bottom:1px solid #f0f0f0;">${esc(label)}</td>
        <td style="padding:9px 0;color:#111827;font-size:14px;font-weight:600;border-bottom:1px solid #f0f0f0;">${esc(val)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`;
}

/** A quoted message block (e.g. contact message or chat text). */
export function messageBlock(label: string, text: string): string {
  return `<div style="margin-top:18px;">
    <div style="color:#6b7280;font-size:13px;margin-bottom:6px;">${esc(label)}</div>
    <div style="background:#f9fafb;border-left:3px solid ${BRAND};border-radius:6px;padding:12px 14px;color:#111827;font-size:14px;line-height:1.5;white-space:pre-wrap;">${esc(text)}</div>
  </div>`;
}

/** A simple bulleted list (e.g. uploaded documents). */
export function bulletList(label: string, items: string[]): string {
  if (!items.length) return "";
  const lis = items
    .map((i) => `<li style="margin:2px 0;color:#111827;font-size:14px;">${esc(i)}</li>`)
    .join("");
  return `<div style="margin-top:18px;">
    <div style="color:#6b7280;font-size:13px;margin-bottom:6px;">${esc(label)}</div>
    <ul style="margin:0;padding-left:20px;">${lis}</ul>
  </div>`;
}

/** Wrap content in the branded email shell with a dashboard CTA. */
export function emailShell(opts: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bodyHtml: string;
}): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f4f4f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:${INK};padding:18px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="color:${BRAND};font-weight:800;font-size:17px;letter-spacing:.06em;">LEO DISPATCH INC</td>
            <td align="right" style="color:#9ca3af;font-size:12px;">${esc(opts.eyebrow || "")}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0;font-size:20px;color:#111827;font-weight:800;">${esc(opts.title)}</h1>
          ${opts.subtitle ? `<p style="margin:6px 0 0;color:#6b7280;font-size:13px;">${esc(opts.subtitle)}</p>` : ""}
          <div style="margin-top:20px;">${opts.bodyHtml}</div>
          <a href="${SITE}/admin" style="display:inline-block;margin-top:26px;background:${BRAND};color:${INK};text-decoration:none;font-weight:700;font-size:14px;padding:11px 24px;border-radius:999px;">Open dashboard &rarr;</a>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#fafafa;border-top:1px solid #eee;color:#9ca3af;font-size:12px;">
          Automated notification from <a href="${SITE}" style="color:#6b7280;text-decoration:none;">leodispatchinc.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
