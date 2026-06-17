import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Search, Clock, Newspaper, Calendar } from "lucide-react";
import { listPublishedPosts } from "@/lib/store";
import { blogCategories, formatPostDate, readingTime, type BlogPost } from "@/lib/blog";
import PageHeader from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trucking Blog — Dispatch, MC Authority & Owner-Operator Guides | Leo Dispatch Inc",
  description:
    "Practical guides for owner operators and small fleets: MC authority, hotshot trucking, box truck business, load boards, factoring, fuel savings and dispatch tips.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Leo Dispatch Inc Trucking Blog",
    description: "Guides to help owner operators run a more profitable trucking business.",
    type: "website",
  },
};

function CoverFallback({ category }: { category: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-surface-2 via-surface to-ink">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">{category}</span>
    </div>
  );
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const all = await listPublishedPosts();

  const query = (q ?? "").trim().toLowerCase();
  let posts = all;
  if (category) posts = posts.filter((p) => p.category === category);
  if (query) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  // Featured = a flagged post (only when no filters active), else the newest
  const noFilter = !category && !query;
  const featured = noFilter ? posts.find((p) => p.featured) ?? posts[0] : undefined;
  const rest = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  // categories that actually have posts
  const activeCats = blogCategories.filter((c) => all.some((p) => p.category === c));

  return (
    <div className="min-h-screen bg-ink">
      <PageHeader
        eyebrow="Leo Dispatch Inc Blog"
        title={
          <>
            Win the road with <span className="text-gradient-gold">smarter trucking</span>
          </>
        }
        subtitle="Field-tested guides on authority, freight, factoring and dispatch — written to help owner operators keep their trucks moving and profitable."
      />

      <div className="container-x py-12 sm:py-16">
        {/* Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                !category ? "border-gold bg-yellow/10 text-gold" : "border-line bg-surface text-muted hover:border-gold hover:text-gold"
              }`}
            >
              All
            </Link>
            {activeCats.map((c) => (
              <Link
                key={c}
                href={`/blog?category=${encodeURIComponent(c)}`}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  category === c ? "border-gold bg-yellow/10 text-gold" : "border-line bg-surface text-muted hover:border-gold hover:text-gold"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          <form action="/blog" method="get" className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search articles…"
              className="field-input !pl-10"
            />
          </form>
        </div>

        {posts.length === 0 ? (
          <div className="mt-16 grid place-items-center rounded-3xl border border-dashed border-line bg-surface py-24 text-center">
            <Newspaper className="h-10 w-10 text-gold" />
            <p className="mt-4 max-w-sm text-sm text-muted">
              {query || category ? "No articles match your filters yet." : "No articles published yet — check back soon."}
            </p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && <FeaturedCard post={featured} />}

            {/* Grid */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-10 grid overflow-hidden rounded-3xl border border-line bg-surface transition-colors hover:border-gold/40 lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CoverFallback category={post.category} />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
          Featured
        </span>
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-9">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</span>
        <h2 className="mt-3 font-display text-2xl font-black leading-tight tracking-tight sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-muted">{post.excerpt}</p>
        <div className="mt-6 flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {formatPostDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {readingTime(post.body)}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-gold">
            Read <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CoverFallback category={post.category} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</span>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug">{post.title}</h3>
        <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>{formatPostDate(post.publishedAt)} · {readingTime(post.body)}</span>
          <ArrowUpRight className="h-4 w-4 transition-all group-hover:-translate-y-0.5 group-hover:text-gold" />
        </div>
      </div>
    </Link>
  );
}
