/* ============================================================
   Local persistence — file-based store (server only)
   ------------------------------------------------------------
   Makes onboarding / contact / application submissions land in
   the admin dashboard WITHOUT requiring any external service.
   Records live in   .data/<collection>.json
   Uploaded files in .data/uploads/<submissionId>/<file>

   ⚠️ Security note: this stores form data (incl. fields the
   onboarding form marks sensitive, like ELD/bank details) as
   plaintext on the local disk. It is fine for local/internal
   use, but before exposing publicly you should: add auth to
   /admin + /api/files, and move secrets to encrypted storage
   (e.g. Supabase + a vault). The Supabase path in lib/leads.ts
   remains available as a drop-in upgrade.
   ============================================================ */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { seedPosts, type BlogPost } from "./blog";

const DATA_DIR = path.join(process.cwd(), ".data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function fileFor(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`);
}

async function readCollection<T>(collection: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(fileFor(collection), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeCollection<T>(collection: string, rows: T[]) {
  await ensureDir(DATA_DIR);
  await fs.writeFile(fileFor(collection), JSON.stringify(rows, null, 2), "utf8");
}

export interface StoredFile {
  key: string; // which document slot
  label: string; // human label
  originalName: string;
  storedName: string; // on-disk name
  size: number;
  type: string;
}

export interface OnboardingSubmission {
  id: string;
  companySlug: string;
  companyName: string;
  status: "new" | "in-review" | "approved" | "rejected";
  createdAt: string;
  // free-form captured fields (driver, truck, eld, banking, …)
  fields: Record<string, string>;
  files: StoredFile[];
}

export interface ContactSubmission {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ApplicationSubmission {
  id: string;
  createdAt: string;
  fields: Record<string, string>;
}

export function newId() {
  return crypto.randomUUID();
}

/* ── Uploads ──────────────────────────────────────────────── */
export async function saveUpload(
  submissionId: string,
  key: string,
  label: string,
  file: File
): Promise<StoredFile> {
  const dir = path.join(UPLOAD_DIR, submissionId);
  await ensureDir(dir);
  const safeBase = (file.name || `${key}`).replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  // unique token keeps multiple files for the same field (e.g. truck pictures) from colliding
  const uniq = crypto.randomUUID().slice(0, 8);
  const storedName = `${key}__${uniq}__${safeBase}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, storedName), buf);
  return {
    key,
    label,
    originalName: file.name || storedName,
    storedName,
    size: file.size,
    type: file.type || "application/octet-stream",
  };
}

export async function readUpload(submissionId: string, storedName: string) {
  // guard against path traversal
  const safe = path.basename(storedName);
  const full = path.join(UPLOAD_DIR, path.basename(submissionId), safe);
  return fs.readFile(full);
}

/* ── Onboarding submissions ───────────────────────────────── */
export async function saveOnboarding(
  rec: Omit<OnboardingSubmission, "id" | "createdAt" | "status">
): Promise<OnboardingSubmission> {
  const rows = await readCollection<OnboardingSubmission>("onboarding");
  const full: OnboardingSubmission = {
    id: newId(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...rec,
  };
  rows.unshift(full);
  await writeCollection("onboarding", rows);
  return full;
}

export async function listOnboarding(): Promise<OnboardingSubmission[]> {
  return readCollection<OnboardingSubmission>("onboarding");
}

export async function getOnboarding(id: string): Promise<OnboardingSubmission | undefined> {
  const rows = await readCollection<OnboardingSubmission>("onboarding");
  return rows.find((r) => r.id === id);
}

export async function updateOnboarding(
  id: string,
  patch: Partial<OnboardingSubmission>
): Promise<OnboardingSubmission | undefined> {
  const rows = await readCollection<OnboardingSubmission>("onboarding");
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  rows[idx] = { ...rows[idx], ...patch, id: rows[idx].id };
  await writeCollection("onboarding", rows);
  return rows[idx];
}

/* ── Contact + applications ───────────────────────────────── */
export async function saveContact(rec: Omit<ContactSubmission, "id" | "createdAt">) {
  const rows = await readCollection<ContactSubmission>("contact");
  rows.unshift({ id: newId(), createdAt: new Date().toISOString(), ...rec });
  await writeCollection("contact", rows);
}

export async function listContact(): Promise<ContactSubmission[]> {
  return readCollection<ContactSubmission>("contact");
}

export async function saveApplication(rec: Omit<ApplicationSubmission, "id" | "createdAt">) {
  const rows = await readCollection<ApplicationSubmission>("applications");
  rows.unshift({ id: newId(), createdAt: new Date().toISOString(), ...rec });
  await writeCollection("applications", rows);
}

export async function listApplications(): Promise<ApplicationSubmission[]> {
  return readCollection<ApplicationSubmission>("applications");
}

/* ── Live chat ────────────────────────────────────────────── */
export interface ChatMessage {
  id: string;
  from: "visitor" | "admin";
  text: string;
  at: string;
}

export interface Conversation {
  id: string; // visitor-generated id (kept in their browser)
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  /** visitor messages the admin hasn't read yet */
  adminUnread: number;
}

async function readChats(): Promise<Conversation[]> {
  return readCollection<Conversation>("chats");
}

export async function listConversations(): Promise<Conversation[]> {
  const rows = await readChats();
  return rows.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
  return (await readChats()).find((c) => c.id === id);
}

export async function addVisitorMessage(
  id: string,
  name: string,
  email: string,
  text: string
): Promise<Conversation> {
  const rows = await readChats();
  const now = new Date().toISOString();
  const msg: ChatMessage = { id: newId(), from: "visitor", text, at: now };
  let conv = rows.find((c) => c.id === id);
  if (!conv) {
    conv = { id, name, email, createdAt: now, updatedAt: now, messages: [msg], adminUnread: 1 };
    rows.unshift(conv);
  } else {
    if (name && !conv.name) conv.name = name;
    if (email && !conv.email) conv.email = email;
    conv.messages.push(msg);
    conv.updatedAt = now;
    conv.adminUnread += 1;
  }
  await writeCollection("chats", rows);
  return conv;
}

export async function addAdminMessage(id: string, text: string): Promise<Conversation | undefined> {
  const rows = await readChats();
  const conv = rows.find((c) => c.id === id);
  if (!conv) return undefined;
  const now = new Date().toISOString();
  conv.messages.push({ id: newId(), from: "admin", text, at: now });
  conv.updatedAt = now;
  await writeCollection("chats", rows);
  return conv;
}

export async function markConversationRead(id: string): Promise<void> {
  const rows = await readChats();
  const conv = rows.find((c) => c.id === id);
  if (conv && conv.adminUnread !== 0) {
    conv.adminUnread = 0;
    await writeCollection("chats", rows);
  }
}

/* ── Blog posts (CMS) ─────────────────────────────────────── */
// Bump SEED_VERSION whenever the seed posts in lib/blog.ts change. On the next
// request the store re-applies the seed — updating seed-managed posts to the
// latest content (keeping their id + createdAt) while preserving any
// admin-created posts — so content edits actually reach a deployed instance
// that already has a persisted .data volume.
const SEED_VERSION = "2026-06-18-1";

interface BlogMeta {
  seedVersion: string;
}

async function readBlogMeta(): Promise<BlogMeta> {
  try {
    const raw = await fs.readFile(fileFor("blog.meta"), "utf8");
    const m = JSON.parse(raw);
    return { seedVersion: typeof m?.seedVersion === "string" ? m.seedVersion : "" };
  } catch {
    return { seedVersion: "" };
  }
}

async function writeBlogMeta(m: BlogMeta): Promise<void> {
  await ensureDir(DATA_DIR);
  await fs.writeFile(fileFor("blog.meta"), JSON.stringify(m, null, 2), "utf8");
}

async function ensureBlogSeeded(): Promise<void> {
  const existing = await readCollection<BlogPost>("blog");
  const meta = await readBlogMeta();
  if (existing.length > 0 && meta.seedVersion === SEED_VERSION) return;

  const now = new Date().toISOString();
  const seedSlugs = new Set(seedPosts.map((p) => p.slug));
  // keep any admin-created posts (slugs that aren't part of the seed)
  const adminPosts = existing.filter((p) => !seedSlugs.has(p.slug));
  // (re)apply every seed post, preserving its existing id + createdAt if present
  const seeded: BlogPost[] = seedPosts.map((p) => {
    const prev = existing.find((e) => e.slug === p.slug);
    return {
      ...p,
      id: prev?.id ?? newId(),
      createdAt: prev?.createdAt ?? now,
      updatedAt: now,
    };
  });
  await writeCollection("blog", [...seeded, ...adminPosts]);
  await writeBlogMeta({ seedVersion: SEED_VERSION });
}

function sortPosts(rows: BlogPost[]): BlogPost[] {
  return [...rows].sort((a, b) => {
    const da = a.publishedAt || a.createdAt;
    const db = b.publishedAt || b.createdAt;
    return da < db ? 1 : da > db ? -1 : 0;
  });
}

export async function listAllPosts(): Promise<BlogPost[]> {
  await ensureBlogSeeded();
  return sortPosts(await readCollection<BlogPost>("blog"));
}

export async function listPublishedPosts(): Promise<BlogPost[]> {
  return (await listAllPosts()).filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await ensureBlogSeeded();
  const rows = await readCollection<BlogPost>("blog");
  return rows.find((p) => p.slug === slug);
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  await ensureBlogSeeded();
  const rows = await readCollection<BlogPost>("blog");
  return rows.find((p) => p.id === id);
}

/** Ensure a slug is unique, ignoring the post being edited (ignoreId). */
export async function uniqueSlug(desired: string, ignoreId?: string): Promise<string> {
  const rows = await readCollection<BlogPost>("blog");
  const taken = new Set(rows.filter((p) => p.id !== ignoreId).map((p) => p.slug));
  const base = desired || "post";
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export async function createPost(
  rec: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<BlogPost> {
  await ensureBlogSeeded();
  const rows = await readCollection<BlogPost>("blog");
  const now = new Date().toISOString();
  const full: BlogPost = { ...rec, id: newId(), createdAt: now, updatedAt: now };
  rows.unshift(full);
  await writeCollection("blog", rows);
  return full;
}

export async function updatePost(
  id: string,
  patch: Partial<BlogPost>
): Promise<BlogPost | undefined> {
  const rows = await readCollection<BlogPost>("blog");
  const idx = rows.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  rows[idx] = { ...rows[idx], ...patch, id: rows[idx].id, updatedAt: new Date().toISOString() };
  await writeCollection("blog", rows);
  return rows[idx];
}

export async function deletePost(id: string): Promise<void> {
  const rows = await readCollection<BlogPost>("blog");
  await writeCollection(
    "blog",
    rows.filter((p) => p.id !== id)
  );
}
