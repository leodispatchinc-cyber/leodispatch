/* ============================================================
   Postgres connection + schema (Vercel Postgres / Neon).
   Reads POSTGRES_URL from the environment (auto-set when you
   create a Postgres store in the Vercel project). Tables are
   created lazily on first use, so there is no separate migrate
   step — deploy and go.
   ============================================================ */
import { sql } from "@vercel/postgres";

export { sql };

let schemaReady: Promise<void> | null = null;

/** Create tables if they don't exist. Memoized per server instance. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) schemaReady = createSchema();
  return schemaReady;
}

async function createSchema(): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS blog_posts (
    id text PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    title text NOT NULL DEFAULT '',
    category text NOT NULL DEFAULT '',
    excerpt text NOT NULL DEFAULT '',
    body text NOT NULL DEFAULT '',
    cover_image text NOT NULL DEFAULT '',
    author text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'draft',
    featured boolean NOT NULL DEFAULT false,
    published_at text NOT NULL DEFAULT '',
    created_at text NOT NULL,
    updated_at text NOT NULL,
    meta_title text NOT NULL DEFAULT '',
    meta_description text NOT NULL DEFAULT '',
    keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
    og_image text NOT NULL DEFAULT '',
    canonical_url text NOT NULL DEFAULT '',
    noindex boolean NOT NULL DEFAULT false
  )`;

  await sql`CREATE TABLE IF NOT EXISTS app_meta (
    key text PRIMARY KEY,
    value text NOT NULL
  )`;

  await sql`CREATE TABLE IF NOT EXISTS onboarding (
    id text PRIMARY KEY,
    company_slug text NOT NULL DEFAULT '',
    company_name text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'new',
    created_at text NOT NULL,
    fields jsonb NOT NULL DEFAULT '{}'::jsonb,
    files jsonb NOT NULL DEFAULT '[]'::jsonb
  )`;

  await sql`CREATE TABLE IF NOT EXISTS contact (
    id text PRIMARY KEY,
    created_at text NOT NULL,
    name text NOT NULL DEFAULT '',
    email text NOT NULL DEFAULT '',
    phone text NOT NULL DEFAULT '',
    message text NOT NULL DEFAULT ''
  )`;

  await sql`CREATE TABLE IF NOT EXISTS applications (
    id text PRIMARY KEY,
    created_at text NOT NULL,
    fields jsonb NOT NULL DEFAULT '{}'::jsonb
  )`;

  await sql`CREATE TABLE IF NOT EXISTS chats (
    id text PRIMARY KEY,
    name text NOT NULL DEFAULT '',
    email text NOT NULL DEFAULT '',
    created_at text NOT NULL,
    updated_at text NOT NULL,
    admin_unread integer NOT NULL DEFAULT 0,
    messages jsonb NOT NULL DEFAULT '[]'::jsonb
  )`;
}
