/* ============================================================
   LEO DISPATCH — Blog content model
   Posts are stored at runtime in .data/blog.json (see lib/store.ts),
   seeded from the posts below on first run. The admin CMS
   (/admin/blog) creates/edits/deletes them with full SEO control.
   ============================================================ */

export const blogCategories = [
  "Owner Operators",
  "Hotshot Trucking",
  "Box Truck Business",
  "New MC Authority",
  "Load Boards",
  "Truck Dispatch Tips",
  "FMCSA Updates",
  "Factoring",
  "Fuel Savings",
  "Trucking Business Growth",
];

export type PostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  /** Markdown body */
  body: string;
  /** Cover/hero image URL (optional) */
  coverImage: string;
  author: string;
  status: PostStatus;
  featured: boolean;
  /** Display + schema publish date (ISO) */
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  /* ── SEO ── */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  /** Optional canonical override (absolute URL). Empty = self. */
  canonicalUrl: string;
  noindex: boolean;
}

/** Shape the admin editor works with (keywords as a comma string). */
export interface PostInput {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  status: PostStatus;
  featured: boolean;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
  noindex: boolean;
}

/* ── Text helpers (safe on client + server) ───────────────── */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function stripMarkdown(md: string): string {
  return (md || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTime(md: string): string {
  const words = stripMarkdown(md).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export function autoExcerpt(md: string, max = 160): string {
  const text = stripMarkdown(md);
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

export function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export function postToInput(p: BlogPost): PostInput {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    body: p.body,
    coverImage: p.coverImage,
    author: p.author,
    status: p.status,
    featured: p.featured,
    publishedAt: (p.publishedAt || "").slice(0, 10),
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    keywords: (p.keywords || []).join(", "),
    ogImage: p.ogImage,
    canonicalUrl: p.canonicalUrl,
    noindex: p.noindex,
  };
}

export function emptyPostInput(): PostInput {
  return {
    slug: "",
    title: "",
    category: blogCategories[0],
    excerpt: "",
    body: "",
    coverImage: "",
    author: "Leo Dispatch Team",
    status: "draft",
    featured: false,
    publishedAt: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
  };
}

/* ── Seed posts (used to initialize the store on first run) ── */
type SeedPost = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

export const seedPosts: SeedPost[] = [
  {
    slug: "how-to-get-your-mc-authority",
    title: "How to Get Your MC Authority in 2025 (Step by Step)",
    category: "New MC Authority",
    excerpt:
      "Everything a new owner operator needs to file, insure and activate their MC authority the right way.",
    coverImage:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Team",
    status: "published",
    featured: true,
    publishedAt: "2025-06-06",
    keywords: ["mc authority", "fmcsa", "owner operator", "usdot number", "boc-3"],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "How to Get Your MC Authority in 2025 (Step-by-Step Guide)",
    metaDescription:
      "A complete 2025 walkthrough for new owner operators: USDOT + MC number, BOC-3, insurance filing, the 21-day protest period, and booking loads from day one.",
    body: [
      "Getting your own authority is the single biggest step toward controlling your trucking income. Here's the full playbook.",
      "## Step 1 — Register with the FMCSA",
      "Register for a **USDOT number** and an **MC number** through the FMCSA. This is what legally lets you haul freight under your own authority instead of leasing onto someone else's.",
      "## Step 2 — File your BOC-3 and insurance",
      "Secure your **BOC-3 process agent**, then file your insurance — typically **$1,000,000 auto liability + $100,000 cargo**. Once insurance is filed, the clock starts on the mandatory **21-day protest period**.",
      "## Step 3 — Be booking from day one",
      "The biggest mistake new authorities make is letting the truck sit while they figure out load boards. Set up **factoring** and a **dedicated dispatcher** before your authority goes active so you're booking high-paying loads the moment you're cleared.",
      "> A truck that isn't moving is losing money. Plan your first week before the authority is even active.",
    ].join("\n\n"),
  },
  {
    slug: "hotshot-trucking-profit-guide",
    title: "Is Hotshot Trucking Still Profitable? The Real Numbers",
    category: "Hotshot Trucking",
    excerpt: "We break down RPM, fuel, and insurance so you know exactly what a hotshot rig nets per week.",
    coverImage:
      "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Team",
    status: "published",
    featured: false,
    publishedAt: "2025-06-04",
    keywords: ["hotshot trucking", "rpm", "hotshot profit", "owner operator income"],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "Is Hotshot Trucking Still Profitable in 2025? Real Numbers",
    metaDescription:
      "A no-fluff breakdown of hotshot trucking economics — average RPM, weekly miles, fuel and insurance — so you know what a hotshot rig really nets.",
    body: [
      "Hotshot trucking can be extremely profitable — **if** you run the right lanes and keep deadhead low.",
      "## The weekly math",
      "With an average RPM of **$1.85** and **2,500 weekly miles**, gross sits near **$4,600** before fuel. The key is consistent load booking and tight rate negotiation.",
      "## Where hotshotters lose money",
      "- Chasing cheap freight just to keep moving",
      "- High deadhead between loads",
      "- Weak rate negotiation with brokers",
      "A good dispatcher fixes all three by keeping your calendar full of high-RPM lanes.",
    ].join("\n\n"),
  },
  {
    slug: "box-truck-business-startup",
    title: "Starting a Box Truck Business With One Truck",
    category: "Box Truck Business",
    excerpt:
      "From DOT registration to your first booked load — the lean path to a profitable box truck operation.",
    coverImage:
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Team",
    status: "published",
    featured: false,
    publishedAt: "2025-06-02",
    keywords: ["box truck business", "box truck dispatch", "expedited freight"],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "How to Start a Box Truck Business With One Truck (2025)",
    metaDescription:
      "The lean startup path for a one-truck box truck business: DOT registration, the freight that pays best, and how to keep your calendar booked.",
    body: [
      "A single box truck is one of the lowest-barrier ways into freight. Here's how to start lean and scale.",
      "## Pick the right freight",
      "Focus on **expedited and regional freight** where box trucks shine. These lanes pay well and don't put you head-to-head with 53-foot dry vans.",
      "## Keep the calendar full",
      "Lock in a dispatcher early so your truck stays booked instead of sitting between loads. Utilization — not rate alone — is what makes a one-truck operation profitable.",
    ].join("\n\n"),
  },
  {
    slug: "best-load-boards-2025",
    title: "The Best Load Boards for Owner Operators in 2025",
    category: "Load Boards",
    excerpt:
      "DAT vs Truckstop vs direct broker relationships — where the high-paying freight actually lives.",
    coverImage:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Team",
    status: "published",
    featured: false,
    publishedAt: "2025-05-30",
    keywords: ["load boards", "dat", "truckstop", "freight rates", "owner operator"],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "Best Load Boards for Owner Operators in 2025 (DAT vs Truckstop)",
    metaDescription:
      "DAT, Truckstop and direct broker relationships compared — where high-paying freight actually lives and how the best carriers use boards as a tool, not a strategy.",
    body: [
      "Load boards are a tool, not a strategy. The carriers who win build broker relationships **on top** of them.",
      "## DAT and Truckstop",
      "Both are strong starting points for finding freight, but the public rate is rarely the best rate. Use them to spot lanes and brokers, not to settle for the first posted number.",
      "## The real edge: direct brokers",
      "A good dispatcher works the boards and direct brokers simultaneously to keep your RPM high — so you're not refreshing a screen all day instead of driving.",
    ].join("\n\n"),
  },
];
