import { NextResponse } from "next/server";
import { listConversations, addAdminMessage, markConversationRead } from "@/lib/store";

export const runtime = "nodejs";

/**
 * Admin chat console endpoint.
 * ⚠️ No auth yet — add admin authentication before exposing publicly.
 */
export async function GET() {
  const conversations = await listConversations();
  return NextResponse.json({ ok: true, conversations });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.conversationId ?? "").trim();
    if (!id) return NextResponse.json({ ok: false, error: "Missing conversation" }, { status: 400 });

    if (body.action === "read") {
      await markConversationRead(id);
      return NextResponse.json({ ok: true });
    }

    const text = String(body.text ?? "").trim();
    if (!text) return NextResponse.json({ ok: false, error: "Empty reply" }, { status: 400 });

    const conv = await addAdminMessage(id, text.slice(0, 4000));
    if (!conv) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, conversation: conv });
  } catch (e) {
    console.error("[api/chat/admin] POST", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
