import React from "react";

/* ============================================================
   Tiny, dependency-free Markdown renderer (server-side).
   Supports: # / ## / ### headings, - / * and 1. lists,
   > blockquotes, --- rules, ![alt](url) images,
   and inline **bold**, *italic*, `code`, [text](url).
   Content is rendered to React nodes (auto-escaped) and link
   hrefs are sanitized, so it is safe for admin-authored posts.
   ============================================================ */

function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(h)) return h;
  return null;
}

const INLINE = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;

function parseInline(text: string, kp: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      out.push(<strong key={`${kp}-${i}`}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      out.push(<em key={`${kp}-${i}`}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      out.push(
        <code key={`${kp}-${i}`} className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em] text-gold">
          {m[4]}
        </code>
      );
    } else if (m[5] !== undefined) {
      const href = safeHref(m[6]);
      if (href) {
        const ext = /^https?:\/\//i.test(href);
        out.push(
          <a
            key={`${kp}-${i}`}
            href={href}
            className="font-medium text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {m[5]}
          </a>
        );
      } else {
        out.push(m[5]);
      }
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function isSpecial(line: string): boolean {
  const t = line.trim();
  return (
    /^#{1,3}\s+/.test(t) ||
    /^[-*]\s+/.test(t) ||
    /^\d+\.\s+/.test(t) ||
    /^>\s?/.test(t) ||
    /^---+$/.test(t) ||
    /^!\[[^\]]*\]\([^)]+\)$/.test(t) ||
    t === ""
  );
}

export function renderMarkdown(md: string): React.ReactNode {
  const lines = (md || "").replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (line === "") {
      i++;
      continue;
    }

    // Heading
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const content = parseInline(h[2], `h${key}`);
      if (level === 1) {
        blocks.push(
          <h2 key={key} className="mt-10 font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
            {content}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h2 key={key} className="mt-10 font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
            {content}
          </h2>
        );
      } else {
        blocks.push(
          <h3 key={key} className="mt-8 font-display text-lg font-bold text-paper">
            {content}
          </h3>
        );
      }
      key++;
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line)) {
      blocks.push(<hr key={key} className="my-8 border-line" />);
      key++;
      i++;
      continue;
    }

    // Image block
    const img = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
    if (img) {
      const src = safeHref(img[2]);
      if (src) {
        blocks.push(
          <figure key={key} className="my-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={img[1]} loading="lazy" className="w-full rounded-2xl border border-line" />
            {img[1] && <figcaption className="mt-2 text-center text-xs text-muted">{img[1]}</figcaption>}
          </figure>
        );
        key++;
      }
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={key}
          className="my-6 border-l-4 border-gold bg-surface/60 px-5 py-3 text-lg italic text-paper/90"
        >
          {parseInline(buf.join(" "), `q${key}`)}
        </blockquote>
      );
      key++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key} className="my-5 ml-5 list-disc space-y-2 text-paper/90 marker:text-gold">
          {items.map((it, idx) => (
            <li key={idx} className="pl-1.5 leading-relaxed">
              {parseInline(it, `ul${key}-${idx}`)}
            </li>
          ))}
        </ul>
      );
      key++;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key} className="my-5 ml-5 list-decimal space-y-2 text-paper/90 marker:text-gold marker:font-semibold">
          {items.map((it, idx) => (
            <li key={idx} className="pl-1.5 leading-relaxed">
              {parseInline(it, `ol${key}-${idx}`)}
            </li>
          ))}
        </ol>
      );
      key++;
      continue;
    }

    // Paragraph — gather consecutive normal lines
    const para: string[] = [raw];
    i++;
    while (i < lines.length && !isSpecial(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key} className="my-5 leading-relaxed text-paper/90">
        {parseInline(para.join(" ").trim(), `p${key}`)}
      </p>
    );
    key++;
  }

  return <>{blocks}</>;
}
