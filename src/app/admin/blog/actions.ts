"use server";

import { revalidatePath } from "next/cache";
import { createPost, updatePost, deletePost, uniqueSlug } from "@/lib/store";
import { slugify, autoExcerpt, type PostInput, type BlogPost } from "@/lib/blog";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalize(input: PostInput): Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "slug"> {
  const title = input.title.trim() || "Untitled post";
  const excerpt = input.excerpt.trim() || autoExcerpt(input.body);
  return {
    title,
    category: input.category || "Owner Operators",
    excerpt,
    body: input.body,
    coverImage: input.coverImage.trim(),
    author: input.author.trim() || "Leo Dispatch Inc Team",
    status: input.status === "published" ? "published" : "draft",
    featured: !!input.featured,
    publishedAt: (input.publishedAt || todayISO()).slice(0, 10),
    metaTitle: input.metaTitle.trim() || title,
    metaDescription: input.metaDescription.trim() || excerpt,
    keywords: input.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    ogImage: input.ogImage.trim() || input.coverImage.trim(),
    canonicalUrl: input.canonicalUrl.trim(),
    noindex: !!input.noindex,
  };
}

function revalidateBlog(slug: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function savePost(
  input: PostInput,
  id?: string
): Promise<{ ok: true; id: string; slug: string }> {
  const data = normalize(input);
  const slug = await uniqueSlug(slugify(input.slug || input.title), id);

  if (id) {
    const updated = await updatePost(id, { ...data, slug });
    revalidateBlog(slug);
    return { ok: true, id, slug: updated?.slug ?? slug };
  }

  const created = await createPost({ ...data, slug });
  revalidateBlog(created.slug);
  return { ok: true, id: created.id, slug: created.slug };
}

export async function deletePostAction(id: string): Promise<void> {
  await deletePost(id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
}

export async function setPostStatus(id: string, status: "draft" | "published"): Promise<void> {
  const updated = await updatePost(id, { status });
  if (updated) revalidateBlog(updated.slug);
}
