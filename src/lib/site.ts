/** Canonical public origin of the site, with no trailing slash.
 *  Used for the sitemap, robots.txt, and page metadata (canonical/OG URLs).
 *  Defaults to the production domain so these are correct even when no env var
 *  is set (the Docker build has no NEXT_PUBLIC_SITE_URL at build time). Override
 *  with NEXT_PUBLIC_SITE_URL for previews or local tooling. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://leodispatchinc.com"
).replace(/\/$/, "");
