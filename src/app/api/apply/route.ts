import { NextResponse } from "next/server";
import { persistLead, notifyLead, leadToHtml } from "@/lib/leads";
import { saveApplication } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.email) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const lead = {
      type: "application" as const,
      full_name: body.fullName,
      email: body.email,
      phone: body.phone ?? "",
      company: body.company ?? "",
      mc_number: body.mcNumber ?? "",
      dot_number: body.dotNumber ?? "",
      equipment: body.equipment ?? "",
      documents: Array.isArray(body.documents) ? body.documents.join(", ") : "",
      created_at: new Date().toISOString(),
    };

    // local store (powers the admin dashboard with no external service)
    await saveApplication({
      fields: {
        fullName: lead.full_name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        mcNumber: lead.mc_number,
        dotNumber: lead.dot_number,
        equipment: lead.equipment,
        documents: lead.documents,
      },
    });
    await persistLead("applications", lead);
    await notifyLead(`New Carrier Application — ${lead.full_name}`, leadToHtml(lead));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/apply]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
