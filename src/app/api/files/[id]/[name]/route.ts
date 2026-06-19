import { NextResponse } from "next/server";
import { getOnboarding } from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Streams an uploaded onboarding document from Vercel Blob through our server,
 * so the raw Blob URL isn't exposed and access is gated to logged-in admins.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; name: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id, name } = await params;
  const submission = await getOnboarding(id);
  const meta = submission?.files.find((f) => f.storedName === name);
  if (!submission || !meta?.url) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  // ?dl=1 forces a download (attachment); otherwise the file opens inline.
  const download = new URL(req.url).searchParams.get("dl");
  const disposition = download ? "attachment" : "inline";
  try {
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`blob ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": meta.type || "application/octet-stream",
        "Content-Disposition": `${disposition}; filename="${meta.originalName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "File missing" }, { status: 404 });
  }
}
