import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/store";
import { mcCompanies } from "@/lib/companies";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/services",
    "/equipment",
    "/carriers",
    "/about",
    "/contact",
    "/blog",
    "/onboarding",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: p === "" || p === "/blog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/privacy" || p === "/terms" ? 0.3 : 0.7,
  }));

  // Per-authority onboarding + requirements pages
  const companyEntries: MetadataRoute.Sitemap = mcCompanies.flatMap((c) => [
    {
      url: `${SITE_URL}/onboarding/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/onboarding/${c.slug}/requirements`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]);

  const posts = await listPublishedPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...companyEntries, ...postEntries];
}
