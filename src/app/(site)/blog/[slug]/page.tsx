import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, Calendar, ChevronRight, User } from "lucide-react";
import { getPostBySlug, listPublishedPosts } from "@/lib/store";
import { formatPostDate, readingTime, type BlogPost } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") {
    return { title: "Article not found — Leo Dispatch Inc Blog" };
  }
  const url = `/blog/${post.slug}`;
  const image = post.ogImage || post.coverImage || undefined;
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: post.canonicalUrl || url },
    robots: post.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url,
      siteName: "Leo Dispatch Inc",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.keywords,
      ...(image ? { images: [{ url: image, alt: post.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const published = await listPublishedPosts();
  const related = [
    ...published.filter((p) => p.id !== post.id && p.category === post.category),
    ...published.filter((p) => p.id !== post.id && p.category !== post.category),
  ].slice(0, 3);

  const image = post.ogImage || post.coverImage || undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    ...(image ? { image: [image] } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Leo Dispatch Inc",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    keywords: (post.keywords || []).join(", "),
    articleSection: post.category,
  };

  return (
    <div className="min-h-screen bg-ink">
      <script
        type="application/ld+json"
        // schema is server-built JSON; escape < to keep it script-safe
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="pt-28 sm:pt-32">
        <div className="container-x max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-paper">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="hover:text-paper">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-paper">
              {post.category}
            </Link>
          </nav>

          <span className="mt-6 block text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</span>
          <h1 className="mt-2 font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-gold" /> {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gold" /> {formatPostDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gold" /> {readingTime(post.body)}
            </span>
          </div>
        </div>

        {/* Cover */}
        {post.coverImage && (
          <div className="container-x mt-8 max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="aspect-[16/8] w-full rounded-3xl border border-line object-cover"
            />
          </div>
        )}

        {/* Body */}
        <div className="container-x mt-10 max-w-3xl pb-4 text-base sm:text-lg">
          {renderMarkdown(post.body)}
        </div>

        {/* Keyword tags */}
        {post.keywords.length > 0 && (
          <div className="container-x mt-8 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((k) => (
                <span key={k} className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
                  #{k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="container-x mt-12 max-w-3xl">
          <div className="rounded-3xl border border-gold/40 bg-gradient-to-br from-surface to-ink p-8 text-center sm:p-10">
            <h3 className="font-display text-2xl font-bold">Ready to keep your truck moving?</h3>
            <p className="mt-2 text-sm text-muted">Get a dedicated dispatcher and start booking loads in 24 hours.</p>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex rounded-full bg-yellow px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gold"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="container-x mt-16 max-w-5xl pb-20">
            <h2 className="font-display text-2xl font-extrabold">Keep reading</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-surface-2 via-surface to-ink">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/70">{post.category}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</span>
        <h3 className="mt-2 font-display text-base font-bold leading-snug">{post.title}</h3>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>{readingTime(post.body)}</span>
          <ArrowUpRight className="h-4 w-4 transition-all group-hover:-translate-y-0.5 group-hover:text-gold" />
        </div>
      </div>
    </Link>
  );
}
