import { notFound } from "next/navigation";
import BlogEditor from "@/components/admin/BlogEditor";
import { getPostById } from "@/lib/store";
import { postToInput } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return <BlogEditor mode="edit" id={post.id} initial={postToInput(post)} siteUrl={SITE_URL} />;
}
