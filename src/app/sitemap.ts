import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/store";

export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

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
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: p === "" || p === "/blog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  const posts = await listPublishedPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
