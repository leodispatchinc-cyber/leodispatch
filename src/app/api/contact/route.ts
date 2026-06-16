import { NextResponse } from "next/server";
import { persistLead, notifyLead, leadToHtml } from "@/lib/leads";
import { saveContact } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.email) {
      return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    const lead = {
      type: "contact" as const,
      name: body.name ?? "",
      email: body.email,
      phone: body.phone ?? "",
      message: body.message ?? "",
      created_at: new Date().toISOString(),
    };

    // local store (powers the admin dashboard with no external service)
    await saveContact({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
    });
    await persistLead("contact_requests", lead);
    await notifyLead(`New Contact Request — ${lead.name || lead.email}`, leadToHtml(lead));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/contact]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
