/* ============================================================
   Minimal admin auth — no database, no external service.
   Credentials live in env vars; the session is a signed cookie
   (HMAC-SHA256). Used by server components / server actions.
   The Edge middleware verifies the same cookie with Web Crypto.
   ============================================================ */
import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ld_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "insecure-dev-secret-set-ADMIN_SESSION_SECRET";
}

function hmac(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/** Signed token: base64url(json).hmac */
export function createSessionToken(username: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ u: username, exp })).toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): { u: string } | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = hmac(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
    return { u: String(data.u) };
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value) !== null;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Validate a login attempt against the configured credentials. */
export function checkCredentials(username: string, password: string): boolean {
  const U = process.env.ADMIN_USERNAME || "admin";
  const P = process.env.ADMIN_PASSWORD || "";
  if (!P) return false; // no password configured → login disabled
  const okU = safeEqual(username.trim().toLowerCase(), U.trim().toLowerCase());
  const okP = safeEqual(password, P);
  return okU && okP;
}
