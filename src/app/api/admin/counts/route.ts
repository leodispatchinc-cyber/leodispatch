import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  listOnboarding,
  listContact,
  listApplications,
  listConversations,
} from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live counts that power the admin sidebar badges.
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [onboarding, contacts, applications, chats] = await Promise.all([
      listOnboarding(),
      listContact(),
      listApplications(),
      listConversations(),
    ]);
    return NextResponse.json({
      ok: true,
      onboarding: {
        total: onboarding.length,
        new: onboarding.filter((o) => o.status === "new").length,
      },
      applications: { total: applications.length },
      contacts: { total: contacts.length },
      chat: { unread: chats.reduce((n, c) => n + (c.adminUnread || 0), 0) },
    });
  } catch (e) {
    console.error("[api/admin/counts]", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
