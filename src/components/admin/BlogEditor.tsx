"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Eye, ArrowLeft, Loader2, Search, Star } from "lucide-react";
import { savePost } from "@/app/admin/blog/actions";
import { blogCategories, slugify, readingTime, type PostInput } from "@/lib/blog";

function Counter({ value, ideal }: { value: number; ideal: number }) {
  const tone = value === 0 ? "text-muted" : value <= ideal ? "text-success" : "text-yellow";
  return (
    <span className={`text-[11px] font-medium ${tone}`}>
      {value}/{ideal}
    </span>
  );
}

export default function BlogEditor({
  mode,
  id,
  initial,
  siteUrl,
}: {
  mode: "new" | "edit";
  id?: string;
  initial: PostInput;
  siteUrl: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<PostInput>(initial);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState("");

  function set<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitle(v: string) {
    setForm((f) => ({ ...f, title: v, slug: slugTouched ? f.slug : slugify(v) }));
  }

  const previewSlug = slugify(form.slug || form.title) || "post-url";
  const previewTitle = (form.metaTitle || form.title || "Post title").slice(0, 65);
  const previewDesc = (form.metaDescription || form.excerpt || "Your meta description preview…").slice(0, 165);
  const readTime = useMemo(() => readingTime(form.body), [form.body]);
  const words = useMemo(() => form.body.trim().split(/\s+/).filter(Boolean).length, [form.body]);

  function submit() {
    setError("");
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }
    startTransition(async () => {
      try {
        await savePost(form, id);
        router.push("/admin/blog");
        router.refresh();
      } catch (e) {
        setError("Could not save the post. Please try again.");
        console.error(e);
      }
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-paper">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          <h1 className="mt-3 font-display text-2xl font-extrabold">
            {mode === "new" ? "New blog post" : "Edit post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {mode === "edit" && form.status === "published" && (
            <Link
              href={`/blog/${previewSlug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted hover:border-gold hover:text-gold"
            >
              <Eye className="h-4 w-4" /> View live
            </Link>
          )}
          <button
            onClick={submit}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-gold disabled:opacity-70"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {form.status === "published" ? "Publish" : "Save draft"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── Main column ── */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <Field label="Title">
              <input className="field-input" value={form.title} onChange={(e) => onTitle(e.target.value)} placeholder="How to Get Your MC Authority in 2025" />
            </Field>
            <Field label="URL slug" hint={`${siteUrl}/blog/`}>
              <input
                className="field-input"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                placeholder="how-to-get-your-mc-authority"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Excerpt" counter={<Counter value={form.excerpt.length} ideal={160} />}>
                <textarea
                  className="field-input min-h-[90px] resize-y"
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="Short summary shown on cards and search results."
                />
              </Field>
              <Field label="Cover image URL">
                <input className="field-input" value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…/cover.jpg" />
                {form.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.coverImage} alt="" className="mt-2 h-24 w-full rounded-lg border border-line object-cover" />
                ) : (
                  <div className="mt-2 grid h-24 w-full place-items-center rounded-lg border border-dashed border-line text-xs text-muted">
                    No cover image
                  </div>
                )}
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted">Body (Markdown)</label>
              <span className="text-[11px] text-muted">
                {words} words · {readTime}
              </span>
            </div>
            <textarea
              className="field-input mt-2 min-h-[420px] resize-y font-mono text-[13px] leading-relaxed"
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"## Section heading\n\nWrite your article here.\n\n- bullet point\n- another point\n\n**Bold**, *italic*, [links](https://example.com) and ![image](https://…/pic.jpg) all work."}
            />
            <p className="mt-2 text-[11px] text-muted">
              Supports <code className="text-paper">## headings</code>, <code className="text-paper">- lists</code>,{" "}
              <code className="text-paper">**bold**</code>, <code className="text-paper">*italic*</code>,{" "}
              <code className="text-paper">{"> quotes"}</code>, <code className="text-paper">[links](url)</code> and{" "}
              <code className="text-paper">![image](url)</code>.
            </p>
          </div>

          {/* SEO */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-gold">
              <Search className="h-4 w-4" /> Search engine (SEO)
            </h2>

            {/* Google preview */}
            <div className="mt-4 rounded-xl border border-line bg-ink p-4">
              <div className="text-[11px] text-muted">Google preview</div>
              <div className="mt-2 truncate text-xs text-success">
                {siteUrl.replace(/^https?:\/\//, "")} › blog › {previewSlug}
              </div>
              <div className="mt-0.5 truncate text-lg text-[#8ab4f8]">{previewTitle}</div>
              <div className="mt-0.5 line-clamp-2 text-sm text-muted">{previewDesc}</div>
            </div>

            <div className="mt-4">
              <Field label="Meta title" counter={<Counter value={form.metaTitle.length} ideal={60} />}>
                <input className="field-input" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Defaults to the post title" />
              </Field>
              <Field label="Meta description" counter={<Counter value={form.metaDescription.length} ideal={160} />}>
                <textarea className="field-input min-h-[80px] resize-y" value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} placeholder="Defaults to the excerpt" />
              </Field>
              <Field label="Focus keywords (comma separated)">
                <input className="field-input" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="mc authority, owner operator, fmcsa" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Social share image (OG)">
                  <input className="field-input" value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="Defaults to cover image" />
                </Field>
                <Field label="Canonical URL (optional)">
                  <input className="field-input" value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} placeholder="Leave empty for self" />
                </Field>
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" className="accent-yellow" checked={form.noindex} onChange={(e) => set("noindex", e.target.checked)} />
                Hide from search engines (noindex)
              </label>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold">Publish</h2>
            <Field label="Status">
              <select className="field-input" value={form.status} onChange={(e) => set("status", e.target.value as PostInput["status"])}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Publish date">
              <input type="date" className="field-input" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
            </Field>
            <label className="mt-1 flex items-center gap-2 text-sm text-paper">
              <input type="checkbox" className="accent-yellow" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
              <Star className="h-4 w-4 text-gold" /> Feature on blog home
            </label>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-gold">Organize</h2>
            <Field label="Category">
              <select className="field-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {blogCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Author">
              <input className="field-input" value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Leo Dispatch Team" />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block last:mb-0">
      <span className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted">
          {label}
          {hint && <span className="ml-1 text-[11px] text-muted/70">{hint}</span>}
        </span>
        {counter}
      </span>
      {children}
    </label>
  );
}
