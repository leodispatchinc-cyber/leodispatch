import { NextResponse } from "next/server";
import { saveOnboarding, saveUpload, updateOnboarding, type StoredFile } from "@/lib/store";
import { getCompany } from "@/lib/companies";
import { notifyLead } from "@/lib/leads";

// Uploads can be sizeable — allow generous body parsing.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const companySlug = String(form.get("companySlug") ?? "");
    const company = getCompany(companySlug);
    if (!company) {
      return NextResponse.json({ ok: false, error: "Unknown company" }, { status: 400 });
    }

    const fields: Record<string, string> = {};
    const fileEntries: { key: string; file: File }[] = [];

    for (const [key, value] of form.entries()) {
      if (key === "companySlug" || key === "companyName") continue;
      if (typeof value === "object" && value !== null && "arrayBuffer" in value) {
        const file = value as File;
        if (file.size > 0) fileEntries.push({ key, file });
      } else {
        const str = String(value).trim();
        if (str) fields[key] = str;
      }
    }

    // minimal validation: a contact name + a way to reach the driver
    if (!fields.driverName || !(fields.email || fields.phone)) {
      return NextResponse.json(
        { ok: false, error: "Driver name and an email or phone are required." },
        { status: 400 }
      );
    }

    // Persist the record first so we have an id for the uploads folder.
    const submission = await saveOnboarding({
      companySlug: company.slug,
      companyName: company.name,
      fields,
      files: [],
    });

    const labelFor = (key: string) =>
      company.documents.find((d) => d.key === key)?.label ?? key.replace(/_/g, " ");

    const files: StoredFile[] = [];
    for (const { key, file } of fileEntries) {
      try {
        files.push(await saveUpload(submission.id, key, labelFor(key), file));
      } catch (e) {
        console.error(`[api/onboarding] failed saving upload "${key}"`, e);
      }
    }

    // attach uploaded-file metadata to the saved record
    if (files.length) {
      await updateOnboarding(submission.id, { files });
    }

    // optional email alert (no-op unless Resend is configured)
    await notifyLead(
      `New onboarding — ${fields.driverName} → ${company.name}`,
      onboardingEmail(company.name, fields, files)
    );

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (e) {
    console.error("[api/onboarding]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

function onboardingEmail(company: string, fields: Record<string, string>, files: StoredFile[]) {
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px;color:#888">${k}</td><td style="padding:4px 12px"><b>${v}</b></td></tr>`
    )
    .join("");
  const docs = files.map((f) => `<li>${f.label} — ${f.originalName}</li>`).join("");
  return `<h2>New onboarding for ${company}</h2><table>${rows}</table><h3>Documents</h3><ul>${docs}</ul>`;
}
