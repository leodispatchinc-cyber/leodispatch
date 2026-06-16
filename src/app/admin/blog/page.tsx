import Link from "next/link";
import { Plus, Newspaper, Pencil, Eye, Star, ExternalLink } from "lucide-react";
import { listAllPosts } from "@/lib/store";
import { formatPostDate } from "@/lib/blog";
import DeletePostButton from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogList({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;
  const all = await listAllPosts();
  const posts =
    filter === "published"
      ? all.filter((p) => p.status === "published")
      : filter === "draft"
        ? all.filter((p) => p.status === "draft")
        : all;

  const tabs = [
    { key: "all", label: "All", n: all.length },
    { key: "published", label: "Published", n: all.filter((p) => p.status === "published").length },
    { key: "draft", label: "Drafts", n: all.filter((p) => p.status === "draft").length },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Blog</h1>
          <p className="mt-1 text-sm text-muted">
            Write, optimize and publish SEO articles — they go live on the website instantly.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/blog?filter=${t.key}`}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === t.key
                ? "border-gold bg-yellow/10 text-gold"
                : "border-line bg-surface text-muted hover:text-paper"
            }`}
          >
            {t.label} <span className="text-xs opacity-70">{t.n}</span>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-line bg-surface py-20 text-center">
          <Newspaper className="h-10 w-10 text-gold" />
          <p className="mt-4 max-w-sm text-sm text-muted">No posts here yet.</p>
          <Link href="/admin/blog/new" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
            <Plus className="h-4 w-4" /> Write your first post
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Post</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-line align-middle">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt="" className="h-10 w-14 shrink-0 rounded-md border border-line object-cover" />
                      ) : (
                        <div className="grid h-10 w-14 shrink-0 place-items-center rounded-md border border-line bg-ink">
                          <Newspaper className="h-4 w-4 text-muted" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-medium text-paper">
                          {p.featured && <Star className="h-3.5 w-3.5 shrink-0 text-gold" />}
                          <span className="truncate">{p.title}</span>
                        </div>
                        <div className="truncate text-xs text-muted">/blog/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{p.category}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.status === "published" ? "bg-success/15 text-success" : "bg-yellow/15 text-yellow"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{formatPostDate(p.publishedAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === "published" && (
                        <Link
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-gold hover:text-gold"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${p.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-gold hover:text-gold"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <DeletePostButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        <ExternalLink className="h-3.5 w-3.5 text-gold" />
        Published posts appear at <code className="text-paper">/blog</code> with full SEO metadata, Open Graph tags and
        article structured data.
      </p>
    </div>
  );
}
