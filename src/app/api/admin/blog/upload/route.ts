import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { saveBlogImage } from "@/lib/store";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

// POST a multipart form with `file` → stores the image and returns its URL.
// Auth is checked here because middleware only guards /admin (not /api).
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Only image files (JPG, PNG, WebP, GIF, AVIF, SVG) are allowed." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be under 8 MB." }, { status: 413 });
  }

  const { url } = await saveBlogImage(file);
  return NextResponse.json({ ok: true, url });
}
