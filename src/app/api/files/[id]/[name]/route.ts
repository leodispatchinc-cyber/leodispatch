import { NextResponse } from "next/server";
import { getOnboarding, readUpload } from "@/lib/store";

export const runtime = "nodejs";

/**
 * Serves an uploaded onboarding document.
 * ⚠️ No auth yet — add admin authentication before exposing publicly.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; name: string }> }
) {
  const { id, name } = await params;
  const submission = await getOnboarding(id);
  const meta = submission?.files.find((f) => f.storedName === name);
  if (!submission || !meta) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  // ?dl=1 forces a download (attachment); otherwise the file opens inline.
  const download = new URL(req.url).searchParams.get("dl");
  const disposition = download ? "attachment" : "inline";
  try {
    const buf = await readUpload(id, name);
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
