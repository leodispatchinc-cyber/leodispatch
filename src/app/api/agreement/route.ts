import { NextResponse } from "next/server";
import { saveOnboarding, saveUpload, updateOnboarding, type StoredFile } from "@/lib/store";
import { getCompany } from "@/lib/companies";
import { getAgreement } from "@/lib/agreements";
import { notifyLead } from "@/lib/leads";
import { emailShell, detailsTable, bulletList } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Receives a signed indemnity agreement (a generated PDF) and files it as an
 * onboarding submission so it shows up in the admin dashboard — independently
 * of whether the carrier completes the full onboarding form.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const companySlug = String(form.get("companySlug") ?? "");
    const company = getCompany(companySlug);
    const agreement = getAgreement(companySlug);
    if (!company || !agreement) {
      return NextResponse.json({ ok: false, error: "Unknown company / agreement" }, { status: 400 });
    }

    const signerName = String(form.get("signerName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const fileVal = form.get("file");

    if (!signerName) {
      return NextResponse.json({ ok: false, error: "Signer name is required." }, { status: 400 });
    }
    if (!fileVal || typeof fileVal !== "object" || !("arrayBuffer" in fileVal)) {
      return NextResponse.json({ ok: false, error: "Signed PDF is missing." }, { status: 400 });
    }
    const file = fileVal as File;
    if (file.size === 0) {
      return NextResponse.json({ ok: false, error: "Signed PDF is empty." }, { status: 400 });
    }

    const fields: Record<string, string> = {
      driverName: signerName,
      type: "Signed Agreement",
      agreement: agreement.title,
    };
    if (email) fields.email = email;

    const submission = await saveOnboarding({
      companySlug: company.slug,
      companyName: company.name,
      fields,
      files: [],
    });

    const stored: StoredFile = await saveUpload(
      submission.id,
      "signed_agreement",
      "Signed Indemnity Agreement",
      file
    );
    await updateOnboarding(submission.id, { files: [stored] });

    await notifyLead(
      `Signed agreement — ${signerName} → ${company.name}`,
      emailShell({
        eyebrow: "Agreement",
        title: "Signed indemnity agreement",
        bodyHtml:
          detailsTable([
            ["Signer", signerName],
            ["Email", email || undefined],
            ["Authority", company.name],
            ["Agreement", agreement.title],
          ]) + bulletList("Document", [stored.originalName]),
      })
    );

    return NextResponse.json({ ok: true, id: submission.id });
  } catch (e) {
    console.error("[api/agreement]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
