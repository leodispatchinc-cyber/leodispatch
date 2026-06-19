import { NextResponse } from "next/server";
import path from "path";
import { readBlogImage } from "@/lib/store";

export const runtime = "nodejs";

// Blog images appear on public pages, so this route is intentionally public.
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  try {
    const buf = await readBlogImage(name);
    const ext = path.extname(name).toLowerCase();
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        // images are content-addressed (unique name per upload) → cache hard
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
}
