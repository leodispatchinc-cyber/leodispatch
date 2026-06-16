import { notFound } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";
import { getPostById } from "@/lib/store";
import { postToInput } from "@/lib/blog";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return <BlogEditor mode="edit" id={post.id} initial={postToInput(post)} siteUrl={SITE_URL} />;
}
