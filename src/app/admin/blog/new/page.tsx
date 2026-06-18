import BlogEditor from "@/components/admin/BlogEditor";
import { emptyPostInput } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return <BlogEditor mode="new" initial={emptyPostInput()} siteUrl={SITE_URL} />;
}
