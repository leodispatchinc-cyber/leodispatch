import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkCredentials,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let username = "";
  let password = "";
  try {
    const body = await req.json();
    username = String(body?.username ?? "");
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect username or password." },
      { status: 401 }
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(username.trim().toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}
