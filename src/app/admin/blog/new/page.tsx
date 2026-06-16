import BlogEditor from "@/components/admin/BlogEditor";
import { emptyPostInput } from "@/lib/blog";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function NewPostPage() {
  return <BlogEditor mode="new" initial={emptyPostInput()} siteUrl={SITE_URL} />;
}
