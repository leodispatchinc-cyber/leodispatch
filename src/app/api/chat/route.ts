import { NextResponse } from "next/server";
import { addVisitorMessage, getConversation } from "@/lib/store";
import { notifyLead } from "@/lib/leads";
import { emailShell, detailsTable, messageBlock } from "@/lib/email";

export const runtime = "nodejs";

/** Visitor sends a message. Creates the conversation on first contact. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const conversationId = String(body.conversationId ?? "").trim();
    const text = String(body.text ?? "").trim();
    if (!conversationId || !text) {
      return NextResponse.json({ ok: false, error: "Missing message" }, { status: 400 });
    }
    if (text.length > 4000) {
      return NextResponse.json({ ok: false, error: "Message too long" }, { status: 400 });
    }

    const conv = await addVisitorMessage(
      conversationId,
      String(body.name ?? "").trim().slice(0, 80),
      String(body.email ?? "").trim().slice(0, 120),
      text
    );

    // notify on the first message of a conversation (no-op unless email is set)
    if (conv.messages.filter((m) => m.from === "visitor").length === 1) {
      const body =
        detailsTable([
          ["Name", conv.name || "Website visitor"],
          ["Email", conv.email],
        ]) + messageBlock("First message", text);
      await notifyLead(
        `New live chat — ${conv.name || "Website visitor"}`,
        emailShell({
          eyebrow: "Live chat",
          title: "New live chat started",
          bodyHtml: body,
        })
      );
    }

    return NextResponse.json({ ok: true, messages: conv.messages });
  } catch (e) {
    console.error("[api/chat] POST", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/** Visitor polls for new messages (incl. admin replies). */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("conversationId");
  if (!id) return NextResponse.json({ ok: false, messages: [] }, { status: 400 });
  const conv = await getConversation(id);
  return NextResponse.json({ ok: true, messages: conv?.messages ?? [] });
}
