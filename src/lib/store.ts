/* ============================================================
   Persistence layer — Vercel Postgres (data) + Vercel Blob (files)
   ------------------------------------------------------------
   Onboarding / contact / application / chat submissions and the
   blog CMS live in Postgres. Uploaded documents and blog images
   live in Vercel Blob (public, unguessable URLs).

   Env required (auto-set when you create the stores in Vercel):
     POSTGRES_URL            — Vercel Postgres / Neon
     BLOB_READ_WRITE_TOKEN   — Vercel Blob

   Tables are created on first use (see lib/db.ts) — no migrate step.
   ============================================================ */

import crypto from "crypto";
import { put, del } from "@vercel/blob";
import { sql, ensureSchema } from "./db";
import { seedPosts, type BlogPost, type PostStatus } from "./blog";

export interface StoredFile {
  key: string; // which document slot
  label: string; // human label
  originalName: string;
  storedName: string; // unique blob pathname (also the /api/files route key)
  size: number;
  type: string;
  url: string; // public Blob URL
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

/* ── Uploads (Vercel Blob) ────────────────────────────────── */
export async function saveUpload(
  submissionId: string,
  key: string,
  label: string,
  file: File
): Promise<StoredFile> {
  const safeBase = (file.name || key).replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  // slash-free, unique token — also serves as the /api/files/[id]/[name] key
  const storedName = `${key}__${crypto.randomUUID().slice(0, 8)}__${safeBase}`;
  const blob = await put(`onboarding/${submissionId}/${storedName}`, file, {
    access: "public",
  });
  return {
    key,
    label,
    originalName: file.name || safeBase,
    storedName,
    size: file.size,
    type: file.type || "application/octet-stream",
    url: blob.url,
  };
}

/** Editor-uploaded blog image → public Blob URL stored in the post markdown. */
export async function saveBlogImage(file: File): Promise<{ url: string }> {
  const safeBase = (file.name || "image").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
  const blob = await put(`blog/${safeBase}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { url: blob.url };
}

/* ── Onboarding submissions ───────────────────────────────── */
interface OnboardingRow {
  id: string;
  company_slug: string;
  company_name: string;
  status: OnboardingSubmission["status"];
  created_at: string;
  fields: Record<string, string>;
  files: StoredFile[];
}

function rowToOnboarding(r: OnboardingRow): OnboardingSubmission {
  return {
    id: r.id,
    companySlug: r.company_slug,
    companyName: r.company_name,
    status: r.status,
    createdAt: r.created_at,
    fields: r.fields || {},
    files: Array.isArray(r.files) ? r.files : [],
  };
}

export async function saveOnboarding(
  rec: Omit<OnboardingSubmission, "id" | "createdAt" | "status">
): Promise<OnboardingSubmission> {
  await ensureSchema();
  const full: OnboardingSubmission = {
    id: newId(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...rec,
  };
  await sql`INSERT INTO onboarding (id, company_slug, company_name, status, created_at, fields, files)
    VALUES (${full.id}, ${full.companySlug}, ${full.companyName}, ${full.status}, ${full.createdAt},
            ${JSON.stringify(full.fields)}::jsonb, ${JSON.stringify(full.files)}::jsonb)`;
  return full;
}

export async function listOnboarding(): Promise<OnboardingSubmission[]> {
  await ensureSchema();
  const { rows } = await sql<OnboardingRow>`SELECT * FROM onboarding ORDER BY created_at DESC`;
  return rows.map(rowToOnboarding);
}

export async function getOnboarding(id: string): Promise<OnboardingSubmission | undefined> {
  await ensureSchema();
  const { rows } = await sql<OnboardingRow>`SELECT * FROM onboarding WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToOnboarding(rows[0]) : undefined;
}

/** Delete a submission and its uploaded files (from Blob), freeing storage. */
export async function deleteOnboarding(id: string): Promise<void> {
  await ensureSchema();
  const sub = await getOnboarding(id);
  const urls = (sub?.files || []).map((f) => f.url).filter(Boolean);
  if (urls.length) {
    try {
      await del(urls);
    } catch (e) {
      console.error("[store] failed deleting onboarding blobs", e);
    }
  }
  await sql`DELETE FROM onboarding WHERE id = ${id}`;
}

export async function updateOnboarding(
  id: string,
  patch: Partial<OnboardingSubmission>
): Promise<OnboardingSubmission | undefined> {
  await ensureSchema();
  const cur = await getOnboarding(id);
  if (!cur) return undefined;
  const next: OnboardingSubmission = { ...cur, ...patch, id: cur.id };
  await sql`UPDATE onboarding SET
    company_slug = ${next.companySlug},
    company_name = ${next.companyName},
    status = ${next.status},
    fields = ${JSON.stringify(next.fields)}::jsonb,
    files = ${JSON.stringify(next.files)}::jsonb
    WHERE id = ${id}`;
  return next;
}

/* ── Contact + applications ───────────────────────────────── */
export async function saveContact(rec: Omit<ContactSubmission, "id" | "createdAt">) {
  await ensureSchema();
  await sql`INSERT INTO contact (id, created_at, name, email, phone, message)
    VALUES (${newId()}, ${new Date().toISOString()}, ${rec.name}, ${rec.email}, ${rec.phone}, ${rec.message})`;
}

export async function deleteContact(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM contact WHERE id = ${id}`;
}

export async function listContact(): Promise<ContactSubmission[]> {
  await ensureSchema();
  const { rows } = await sql<{
    id: string; created_at: string; name: string; email: string; phone: string; message: string;
  }>`SELECT * FROM contact ORDER BY created_at DESC`;
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
  }));
}

export async function saveApplication(rec: Omit<ApplicationSubmission, "id" | "createdAt">) {
  await ensureSchema();
  await sql`INSERT INTO applications (id, created_at, fields)
    VALUES (${newId()}, ${new Date().toISOString()}, ${JSON.stringify(rec.fields)}::jsonb)`;
}

export async function deleteApplication(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM applications WHERE id = ${id}`;
}

export async function listApplications(): Promise<ApplicationSubmission[]> {
  await ensureSchema();
  const { rows } = await sql<{ id: string; created_at: string; fields: Record<string, string> }>`
    SELECT * FROM applications ORDER BY created_at DESC`;
  return rows.map((r) => ({ id: r.id, createdAt: r.created_at, fields: r.fields || {} }));
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

interface ChatRow {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  admin_unread: number;
  messages: ChatMessage[];
}

function rowToConversation(r: ChatRow): Conversation {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    messages: Array.isArray(r.messages) ? r.messages : [],
    adminUnread: r.admin_unread || 0,
  };
}

export async function listConversations(): Promise<Conversation[]> {
  await ensureSchema();
  const { rows } = await sql<ChatRow>`SELECT * FROM chats ORDER BY updated_at DESC`;
  return rows.map(rowToConversation);
}

export async function getConversation(id: string): Promise<Conversation | undefined> {
  await ensureSchema();
  const { rows } = await sql<ChatRow>`SELECT * FROM chats WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToConversation(rows[0]) : undefined;
}

export async function addVisitorMessage(
  id: string,
  name: string,
  email: string,
  text: string
): Promise<Conversation> {
  await ensureSchema();
  const now = new Date().toISOString();
  const msg: ChatMessage = { id: newId(), from: "visitor", text, at: now };
  const existing = await getConversation(id);
  if (!existing) {
    const conv: Conversation = {
      id, name, email, createdAt: now, updatedAt: now, messages: [msg], adminUnread: 1,
    };
    await sql`INSERT INTO chats (id, name, email, created_at, updated_at, admin_unread, messages)
      VALUES (${id}, ${name}, ${email}, ${now}, ${now}, ${1}, ${JSON.stringify(conv.messages)}::jsonb)`;
    return conv;
  }
  const conv: Conversation = {
    ...existing,
    name: existing.name || name,
    email: existing.email || email,
    messages: [...existing.messages, msg],
    updatedAt: now,
    adminUnread: existing.adminUnread + 1,
  };
  await sql`UPDATE chats SET
    name = ${conv.name}, email = ${conv.email}, updated_at = ${now},
    admin_unread = ${conv.adminUnread}, messages = ${JSON.stringify(conv.messages)}::jsonb
    WHERE id = ${id}`;
  return conv;
}

export async function addAdminMessage(id: string, text: string): Promise<Conversation | undefined> {
  await ensureSchema();
  const existing = await getConversation(id);
  if (!existing) return undefined;
  const now = new Date().toISOString();
  const conv: Conversation = {
    ...existing,
    messages: [...existing.messages, { id: newId(), from: "admin", text, at: now }],
    updatedAt: now,
  };
  await sql`UPDATE chats SET updated_at = ${now}, messages = ${JSON.stringify(conv.messages)}::jsonb
    WHERE id = ${id}`;
  return conv;
}

export async function markConversationRead(id: string): Promise<void> {
  await ensureSchema();
  await sql`UPDATE chats SET admin_unread = 0 WHERE id = ${id}`;
}

export async function deleteConversation(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM chats WHERE id = ${id}`;
}

/* ── Blog posts (CMS) ─────────────────────────────────────── */
// Bump SEED_VERSION whenever the seed posts in lib/blog.ts change. On the next
// request the store re-applies the seed — updating seed-managed posts to the
// latest content (keeping their id + created_at) while preserving any
// admin-created posts.
const SEED_VERSION = "2026-06-18-1";

interface PostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  cover_image: string;
  author: string;
  status: PostStatus;
  featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  og_image: string;
  canonical_url: string;
  noindex: boolean;
}

function rowToPost(r: PostRow): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    excerpt: r.excerpt,
    body: r.body,
    coverImage: r.cover_image,
    author: r.author,
    status: r.status,
    featured: r.featured,
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    keywords: Array.isArray(r.keywords) ? r.keywords : [],
    ogImage: r.og_image,
    canonicalUrl: r.canonical_url,
    noindex: r.noindex,
  };
}

type PostContent = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

/** Insert a post (new id + timestamps), upserting on slug. Used for seeding. */
async function upsertSeedPost(p: PostContent, now: string): Promise<void> {
  await sql`INSERT INTO blog_posts (
    id, slug, title, category, excerpt, body, cover_image, author, status, featured,
    published_at, created_at, updated_at, meta_title, meta_description, keywords,
    og_image, canonical_url, noindex
  ) VALUES (
    ${newId()}, ${p.slug}, ${p.title}, ${p.category}, ${p.excerpt}, ${p.body}, ${p.coverImage},
    ${p.author}, ${p.status}, ${p.featured}, ${p.publishedAt}, ${now}, ${now}, ${p.metaTitle},
    ${p.metaDescription}, ${JSON.stringify(p.keywords)}::jsonb, ${p.ogImage}, ${p.canonicalUrl}, ${p.noindex}
  )
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title, category = EXCLUDED.category, excerpt = EXCLUDED.excerpt,
    body = EXCLUDED.body, cover_image = EXCLUDED.cover_image, author = EXCLUDED.author,
    status = EXCLUDED.status, featured = EXCLUDED.featured, published_at = EXCLUDED.published_at,
    updated_at = EXCLUDED.updated_at, meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description, keywords = EXCLUDED.keywords,
    og_image = EXCLUDED.og_image, canonical_url = EXCLUDED.canonical_url, noindex = EXCLUDED.noindex`;
}

let seededThisInstance = false;

async function ensureBlogSeeded(): Promise<void> {
  await ensureSchema();
  if (seededThisInstance) return;
  const [{ rows: metaRows }, { rows: countRows }] = await Promise.all([
    sql<{ value: string }>`SELECT value FROM app_meta WHERE key = 'blog_seed_version' LIMIT 1`,
    sql<{ n: number }>`SELECT count(*)::int AS n FROM blog_posts`,
  ]);
  const version = metaRows[0]?.value ?? "";
  const count = countRows[0]?.n ?? 0;
  if (count > 0 && version === SEED_VERSION) {
    seededThisInstance = true;
    return;
  }
  const now = new Date().toISOString();
  for (const p of seedPosts) await upsertSeedPost(p as PostContent, now);
  await sql`INSERT INTO app_meta (key, value) VALUES ('blog_seed_version', ${SEED_VERSION})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
  seededThisInstance = true;
}

export async function listAllPosts(): Promise<BlogPost[]> {
  await ensureBlogSeeded();
  const { rows } = await sql<PostRow>`SELECT * FROM blog_posts
    ORDER BY COALESCE(NULLIF(published_at, ''), created_at) DESC`;
  return rows.map(rowToPost);
}

export async function listPublishedPosts(): Promise<BlogPost[]> {
  return (await listAllPosts()).filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await ensureBlogSeeded();
  const { rows } = await sql<PostRow>`SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ? rowToPost(rows[0]) : undefined;
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  await ensureBlogSeeded();
  const { rows } = await sql<PostRow>`SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToPost(rows[0]) : undefined;
}

/** Ensure a slug is unique, ignoring the post being edited (ignoreId). */
export async function uniqueSlug(desired: string, ignoreId?: string): Promise<string> {
  await ensureSchema();
  const { rows } = await sql<{ slug: string }>`SELECT slug FROM blog_posts
    WHERE id <> ${ignoreId ?? ""}`;
  const taken = new Set(rows.map((r) => r.slug));
  const base = desired || "post";
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export async function createPost(rec: PostContent): Promise<BlogPost> {
  await ensureSchema();
  const now = new Date().toISOString();
  const full: BlogPost = { ...rec, id: newId(), createdAt: now, updatedAt: now };
  await sql`INSERT INTO blog_posts (
    id, slug, title, category, excerpt, body, cover_image, author, status, featured,
    published_at, created_at, updated_at, meta_title, meta_description, keywords,
    og_image, canonical_url, noindex
  ) VALUES (
    ${full.id}, ${full.slug}, ${full.title}, ${full.category}, ${full.excerpt}, ${full.body},
    ${full.coverImage}, ${full.author}, ${full.status}, ${full.featured}, ${full.publishedAt},
    ${full.createdAt}, ${full.updatedAt}, ${full.metaTitle}, ${full.metaDescription},
    ${JSON.stringify(full.keywords)}::jsonb, ${full.ogImage}, ${full.canonicalUrl}, ${full.noindex}
  )`;
  return full;
}

export async function updatePost(id: string, patch: Partial<BlogPost>): Promise<BlogPost | undefined> {
  await ensureSchema();
  const cur = await getPostById(id);
  if (!cur) return undefined;
  const next: BlogPost = { ...cur, ...patch, id: cur.id, updatedAt: new Date().toISOString() };
  await sql`UPDATE blog_posts SET
    slug = ${next.slug}, title = ${next.title}, category = ${next.category}, excerpt = ${next.excerpt},
    body = ${next.body}, cover_image = ${next.coverImage}, author = ${next.author}, status = ${next.status},
    featured = ${next.featured}, published_at = ${next.publishedAt}, updated_at = ${next.updatedAt},
    meta_title = ${next.metaTitle}, meta_description = ${next.metaDescription},
    keywords = ${JSON.stringify(next.keywords)}::jsonb, og_image = ${next.ogImage},
    canonical_url = ${next.canonicalUrl}, noindex = ${next.noindex}
    WHERE id = ${id}`;
  return next;
}

export async function deletePost(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM blog_posts WHERE id = ${id}`;
}
