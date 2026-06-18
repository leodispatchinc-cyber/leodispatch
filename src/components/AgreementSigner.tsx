"use client";

import { useState } from "react";
import {
  FileSignature,
  Download,
  ExternalLink,
  UploadCloud,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import type { Agreement } from "@/lib/agreements";

type Status = "idle" | "sending" | "done" | "error";

const PDF_EDITOR_URL = "https://rahatools.com/pdf-editor";

/** strip curly quotes / dashes so jsPDF's core fonts render cleanly */
function ascii(s: string) {
  return s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-");
}

/** Generate the blank agreement PDF (with signature lines) for download + signing. */
async function buildAgreementPdf(agreement: Agreement) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxW = pageW - margin * 2;
  let y = margin;
  const ensure = (space: number) => {
    if (y + space > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const titleLines = doc.splitTextToSize(ascii(agreement.title), maxW);
  ensure(titleLines.length * 18);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 18 + 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const intro = doc.splitTextToSize(ascii(agreement.intro.replace("{{DATE}}", "____________")), maxW);
  ensure(intro.length * 14);
  doc.text(intro, margin, y);
  y += intro.length * 14 + 12;

  for (const s of agreement.sections) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    ensure(28);
    doc.text(ascii(s.heading), margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    const lines = doc.splitTextToSize(ascii(s.body), maxW);
    ensure(lines.length * 14);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 12;
  }

  /* signature block — blank lines for the operator + carrier to sign */
  ensure(150);
  y += 8;
  doc.setDrawColor(150);
  doc.line(margin, y, pageW - margin, y);
  y += 26;

  const sigBlock = (label: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(label, margin, y);
    y += 30;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setDrawColor(120);
    doc.line(margin, y, margin + 280, y);
    doc.line(margin + 320, y, pageW - margin, y);
    y += 13;
    doc.text("Signature", margin, y);
    doc.text("Date", margin + 320, y);
    y += 34;
  };

  sigBlock("Operator");
  sigBlock(ascii(agreement.carrier));

  const safe = `${agreement.carrier}-Indemnity-Agreement`.replace(/[^a-zA-Z0-9-]+/g, "-").replace(/-+/g, "-");
  return { doc, filename: `${safe}.pdf`, blob: doc.output("blob") as Blob };
}

export default function AgreementSigner({
  companySlug,
  companyName,
  agreement,
}: {
  companySlug: string;
  companyName: string;
  agreement: Agreement;
}) {
  const [downloading, setDownloading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function download() {
    setDownloading(true);
    try {
      const { doc, filename } = await buildAgreementPdf(agreement);
      doc.save(filename);
    } finally {
      setDownloading(false);
    }
  }

  async function upload() {
    if (!name.trim()) {
      setError("Please enter your full legal name.");
      return;
    }
    if (!file) {
      setError("Please choose your signed agreement file to upload.");
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const fd = new FormData();
      fd.append("companySlug", companySlug);
      fd.append("signerName", name.trim());
      fd.append("email", email.trim());
      fd.append("file", file, file.name);
      const res = await fetch("/api/agreement", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setError(json.error || "Upload failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-success/40 bg-surface p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold text-paper">Signed agreement received</h3>
        <p className="mt-1.5 text-sm text-muted">
          Your signed agreement for {companyName} was sent to the Leo Dispatch Inc team. We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-yellow/[0.06] to-transparent p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
        <FileSignature className="h-4 w-4" /> Required Agreement
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-paper">{agreement.title}</h3>
      <p className="mt-1.5 text-sm text-muted">
        Download the agreement, add your signature, and upload the signed copy back to us.
      </p>

      <ol className="mt-5 flex flex-col gap-5">
        {/* Step 1 — download */}
        <li className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-sm font-bold text-gold">
            1
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-paper">Download the agreement</p>
            <button
              type="button"
              onClick={download}
              disabled={downloading}
              className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-60"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download Agreement (PDF)
            </button>
          </div>
        </li>

        {/* Step 2 — sign via PDF editor */}
        <li className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-sm font-bold text-gold">
            2
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-paper">Sign it</p>
            <p className="mt-0.5 text-sm text-muted">
              Open the free PDF editor, upload the agreement, add your signature, and save it.
            </p>
            <a
              href={PDF_EDITOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-5 py-2.5 text-sm font-semibold text-paper transition-all hover:border-gold hover:text-gold"
            >
              Open PDF Editor <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </li>

        {/* Step 3 — upload signed copy */}
        <li className="flex gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-sm font-bold text-gold">
            3
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-paper">Upload your signed agreement</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full legal name *"
                className="field-input"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email (optional)"
                className="field-input"
              />
            </div>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="field-input mt-3"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            <button
              type="button"
              onClick={upload}
              disabled={status === "sending"}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-60"
            >
              {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Send to Leo Dispatch Inc
            </button>
          </div>
        </li>
      </ol>

      <p className="mt-5 inline-flex items-center gap-1.5 border-t border-gold/15 pt-4 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-gold" /> Your signed agreement is sent securely to our team.
      </p>
    </div>
  );
}
