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
    author: "Leo Dispatch Inc Team",
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
    slug: "hotshot-trucking-profit-guide",
    title: "Is Hotshot Trucking Still Profitable in 2026? The Real Numbers",
    category: "Hotshot Trucking",
    excerpt:
      "A no-fluff breakdown of hotshot trucking economics in 2026 — real RPM, weekly miles, fuel, insurance and startup costs — so you know exactly what a hotshot rig nets.",
    coverImage:
      "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Inc Team",
    status: "published",
    featured: true,
    publishedAt: "2026-06-16",
    keywords: [
      "hotshot trucking",
      "is hotshot trucking profitable",
      "hotshot trucking profit",
      "hotshot rates per mile",
      "hotshot owner operator income",
      "hotshot trucking 2026",
    ],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "Is Hotshot Trucking Profitable in 2026? Real RPM & Cost Breakdown",
    metaDescription:
      "Is hotshot trucking still profitable in 2026? A real breakdown of RPM, weekly miles, fuel, insurance and startup costs — plus how to make a hotshot rig actually pay.",
    body: [
      "Hotshot trucking is one of the fastest, lowest-cost ways to become an owner-operator in 2026 — but “quick to start” does not automatically mean profitable. Whether a hotshot rig actually makes money comes down to three numbers: your **rate per mile (RPM)**, your **weekly loaded miles**, and your **fixed costs**. In this guide we break down the real economics of hotshot trucking with current 2026 figures so you can decide if it is worth it — and exactly how to make it pay.",
      "## What Is Hotshot Trucking?",
      "Hotshot trucking means hauling smaller, time-sensitive loads with a medium-duty pickup — usually a one-ton dually like a Ram 3500 or Ford F-350/450 — pulling a gooseneck or bumper-pull flatbed trailer. Instead of a Class 8 semi, you run a Class 3–5 truck, which means lower upfront cost, cheaper insurance, and a smaller operating footprint. Typical hotshot loads include partial (LTL) freight, construction and building materials, machinery, agricultural and oilfield equipment, and anything a customer needs delivered quickly that does not require a full 53-foot trailer.",
      "## Is Hotshot Trucking Still Profitable in 2026?",
      "Short answer: **yes — if you keep the truck loaded and your deadhead low.** Hotshot freight pays a premium for speed and flexibility, and because your operating costs are far lower than a semi, you keep more of every dollar you book. The carriers who struggle are not losing because hotshot is “dead” — they are losing because they chase cheap freight, run too many empty miles, and negotiate poorly.",
      "### The weekly revenue math",
      "Let’s use realistic 2026 averages. A working hotshot earns an RPM of roughly **$1.75–$2.10** on loaded miles. Run **2,400–2,800 loaded miles a week** and the gross looks like this:",
      "- At **$1.85 RPM × 2,500 miles = $4,625 gross/week**\n- At **$2.00 RPM × 2,600 miles = $5,200 gross/week**\n- That is roughly **$18,000–$22,000 in gross revenue per month** for one truck that costs a fraction of a semi to run.",
      "### Your real operating costs",
      "Gross is not take-home. Here is where the money goes on a typical single-truck hotshot operation:",
      "- **Fuel:** $1,300–$1,800/week (a diesel dually returns about 11–14 MPG)\n- **Insurance:** $700–$1,100/month for commercial auto + cargo\n- **Truck & trailer payment:** $1,000–$1,800/month combined\n- **Maintenance & tires:** budget $300–$500/week\n- **Dispatch:** a percentage of the linehaul — and only when you are actually booked\n- **Tolls, permits, phone, factoring fees:** $150–$300/week",
      "### Example: what a hotshot rig actually nets",
      "Take a solid **$5,000 gross** week. Subtract roughly $1,500 fuel, ~$250 weekly insurance share, ~$375 truck/trailer payment, ~$400 maintenance reserve, and ~$300 dispatch and fees, and you are left with about **$2,100–$2,400 net for the week** — on a truck you can put on the road for under $80,000 all in. Across a 48-week working year that is a six-figure gross and a healthy take-home, **provided utilization stays high.**",
      "## Hotshot Trucking Startup Costs",
      "One reason hotshot is so popular is the low barrier to entry compared with a semi:",
      "- **Used 1-ton dually truck:** $25,000–$55,000\n- **Gooseneck flatbed (30–40 ft):** $8,000–$18,000\n- **MC authority, USDOT number & filings:** $300–$900 — see our [step-by-step MC authority guide](/blog/how-to-get-your-mc-authority)\n- **Insurance down payment:** $1,500–$3,000\n- **Straps, chains, tarps and binders:** $800–$1,500",
      "All in, many drivers get rolling for **$40,000–$80,000** — often half (or less) of what a comparable semi setup costs.",
      "## Where Hotshot Truckers Lose Money",
      "The difference between a profitable hotshot and a broke one is rarely the truck — it is booking discipline. The most common profit killers:",
      "- **Chasing cheap freight** just to keep the wheels turning\n- **High deadhead** miles between loads that nobody pays you for\n- **Weak rate negotiation** — taking the first number a broker posts\n- **No backhaul plan**, so you run empty on the way home\n- **Underpricing your speed** — hotshot is a premium service, so don’t sell it like a cheap dry van",
      "## How to Maximize Hotshot Profit",
      "- Keep loaded miles high and deadhead under 10–15%\n- Build direct broker relationships instead of living on the public board rate\n- Negotiate every load — even $0.15/mile more adds up to thousands a year\n- Use a [dedicated dispatcher](/services) so you are driving, not refreshing a screen\n- Set up [factoring](/services) so you are paid in 24 hours instead of 30–45 days\n- Track your cost-per-mile every month so you always know your true break-even",
      "## Best Freight and Lanes for Hotshot",
      "Hotshot shines on partial loads and time-critical freight: construction and building materials, agricultural and oilfield equipment, heavy machinery, and expedited LTL. Industrial corridors across Texas, the Southeast and the Midwest tend to offer the most consistent hotshot volume. The goal is a repeatable lane or region where you can chain loads together and minimize empty miles. If you are not sure which equipment fits your market, our [equipment guide](/equipment) covers what each trailer type pays.",
      "## Hotshot vs Box Truck vs Semi: Which Should You Run?",
      "If you are weighing your options as a new owner-operator, here is the quick comparison. A **hotshot** has the lowest startup and operating cost, requires no CDL under 26,001 lbs combined, and pays a premium for speed — but it is weight-limited to roughly 16,500 lbs of payload. A **box truck** is ideal for regional, expedited and last-mile freight and is cheap to run, but it tops out on heavier and oversized loads. A **semi** hauls the most weight and earns the highest gross per load, yet costs far more to buy, insure and fuel. Many drivers start with a hotshot or box truck to build capital and a clean safety record, then scale into a semi once cash flow is steady.",
      "### Don’t skip the maintenance reserve",
      "One number new hotshotters forget is the maintenance reserve. Dually trucks and gooseneck trailers wear tires, brakes and suspension faster under load, and a single blown tire or brake job on the road can erase a week of profit. Set aside **$0.12–$0.18 per mile** for maintenance and treat it as a fixed cost, not optional savings — your future self will thank you when a repair bill lands mid-month.",
      "### Watch your fuel, not just your rate",
      "Fuel is your largest variable cost, so a high rate on a heavy, low-MPG, headwind lane can net less than a slightly lower rate on an efficient one. Track your real cost-per-mile including fuel surcharges, plan stops around cheaper diesel, and factor deadhead fuel into every rate you accept. Protecting net — not just chasing the biggest gross number — is what keeps a hotshot profitable month after month.",
      "## Frequently Asked Questions",
      "### How much can a hotshot trucker make in 2026?",
      "A well-utilized single hotshot truck typically grosses **$15,000–$22,000 per month** and nets roughly **$6,000–$10,000** after fuel, insurance, maintenance and payments. The numbers swing with diesel prices, the lanes you run, and how consistently you stay booked.",
      "### Do you need a CDL for hotshot trucking?",
      "It depends on your truck and trailer’s combined gross vehicle weight rating (GVWR). Under 26,001 lbs combined, you generally do **not** need a CDL — but you still need your MC authority, USDOT number and proper insurance. Over that threshold, a CDL is required.",
      "### Is hotshot trucking better than running a semi?",
      "For new owner-operators with limited capital, hotshot offers lower startup and operating costs and faster entry. A semi hauls more weight per load and can earn more gross, but it costs far more to buy, insure and fuel. Many drivers start in hotshot and scale up later.",
      "### How do I keep my hotshot truck booked?",
      "The single biggest lever is dispatch. A dispatcher who works the load boards and direct brokers at the same time keeps your calendar full of high-RPM lanes, so the truck is earning instead of sitting.",
      "## The Bottom Line",
      "Hotshot trucking is still genuinely profitable in 2026 — the economics work as long as you protect your RPM, minimize deadhead, and keep the truck moving. The drivers who treat it like a real business — tracking cost-per-mile, negotiating hard, and leaning on professional dispatch — out-earn those who simply react to whatever loads pop up.",
      "> A truck that isn’t moving is losing money. Plan your week before the load board does.",
      "Ready to keep your hotshot loaded with high-paying freight? [Start onboarding with Leo Dispatch Inc](/onboarding) and get a dedicated dispatcher booking your lanes within 24 hours.",
    ].join("\n\n"),
  },
  {
    slug: "how-to-get-your-mc-authority",
    title: "How to Get Your MC Authority in 2026 (Step-by-Step Guide)",
    category: "New MC Authority",
    excerpt:
      "Everything a new owner-operator needs to file, insure and activate their MC authority the right way in 2026 — USDOT, MC number, BOC-3, insurance and the 21-day period.",
    coverImage:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Inc Team",
    status: "published",
    featured: true,
    publishedAt: "2026-06-12",
    keywords: [
      "how to get mc authority",
      "mc authority 2026",
      "fmcsa registration",
      "usdot number",
      "boc-3 filing",
      "new owner operator authority",
    ],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "How to Get Your MC Authority in 2026 (Step-by-Step Guide)",
    metaDescription:
      "A complete 2026 walkthrough for new owner-operators: USDOT + MC number, BOC-3, insurance filing, UCR, the 21-day period, costs, timeline and booking loads from day one.",
    body: [
      "Getting your own MC authority is the single biggest step toward controlling your trucking income. Run under your own authority and you keep the full linehaul instead of giving a cut to a carrier you lease onto. The process is very doable on your own — you just have to do each step in the right order. Here is the complete 2026 playbook for **how to get your MC authority**, what it costs, how long it takes, and how to be booking loads the moment you are active.",
      "## What Is an MC Authority?",
      "Your **MC (Motor Carrier) number** and **USDOT number** are the federal credentials that legally let you haul freight for hire under your own company. Together they tell the FMCSA — and every broker you work with — that you are an insured, compliant carrier responsible for your own loads. Without active authority, you can only drive for someone else or lease your truck onto another carrier’s authority.",
      "## MC Number vs USDOT Number: What’s the Difference?",
      "New drivers often confuse the two, but you need both. Your **USDOT number** is your safety identifier — it tracks your inspections, crash history and compliance data with the FMCSA. Your **MC number** (operating authority) is your permission to transport regulated freight **for hire** across state lines. Think of the USDOT number as your truck’s plate in the federal safety system, and the MC number as your business license to haul other people’s freight for money. Interstate for-hire carriers carry both; some intrastate-only operations may need only a USDOT number depending on their state.",
      "## Set Up Your Business First: LLC, EIN and Bank Account",
      "Before you file, get your business foundation in place. Form an **LLC** to separate your personal assets from business liability, get a free **EIN** from the IRS for taxes and banking, and open a **dedicated business bank account** so trucking income and expenses never mix with personal money. Brokers and factoring companies take you more seriously when invoices and W-9s carry a real business name — and clean books make tax season and any future financing far easier.",
      "## Step 1 — Register with the FMCSA (USDOT + MC Number)",
      "Start at the FMCSA’s Unified Registration System. You will apply for a **USDOT number** and **operating authority (MC number)** at the same time. You will choose your authority type (most owner-operators select **Motor Carrier of Property — for-hire**) and pay the federal application fee, which is **$300 per authority type** in 2026. Have your business entity (LLC), EIN, and business address ready before you start.",
      "## Step 2 — Designate a BOC-3 Process Agent",
      "Federal law requires every carrier to file a **BOC-3** — a form that names a registered **process agent** in each state where you operate. You do not file this yourself; you pay a BOC-3 service (typically **$20–$50, one time**) that has agents nationwide, and they file it electronically with the FMCSA on your behalf. This is a quick but mandatory step — your authority will not activate without it.",
      "## Step 3 — File Your Insurance",
      "This is the step that actually starts the clock. Your insurance agent files proof of coverage directly with the FMCSA. Standard minimums for general freight are:",
      "- **$1,000,000 auto liability** (BI/PD)\n- **$100,000 cargo coverage** (many brokers want this even though federal minimums differ)\n- **Filings the FMCSA recognizes:** a **BMC-91 or 91X** for liability and a **BMC-34** where cargo filing is required",
      "Expect to put **$1,500–$4,000 down** to bind a policy as a new authority, with monthly premiums that drop significantly after your first 12 months of clean operation.",
      "## Step 4 — Register for UCR (and State Requirements)",
      "Complete your **Unified Carrier Registration (UCR)** for the year — an annual fee based on fleet size (lowest tier is well under $200 for a single truck). Depending on your base state and the lanes you run, you may also need an **IRP apportioned plate, IFTA fuel-tax account, and a 2290 Heavy Vehicle Use Tax** filing if your truck is 55,000 lbs or more.",
      "## Step 5 — The 21-Day Protest Period & Activation",
      "Once your application and insurance are on file, the FMCSA posts your authority for a mandatory **21-day public protest period**. In practice this is a waiting window — barring a rare protest, your authority moves to **ACTIVE** at the end of it. Your MC then shows active in the FMCSA’s SAFER system, and you are legally cleared to haul for hire.",
      "## Step 6 — Set Up to Book Loads From Day One",
      "The biggest mistake new authorities make is letting the truck sit while they figure out load boards. Before your authority goes active, get these in place:",
      "- **Factoring** so your invoices are paid in 24 hours, not 30–45 days\n- **A carrier packet** (W-9, COI, authority letter, references) ready to send to brokers instantly\n- **A [dedicated dispatcher](/services)** lining up your first week of loads so you roll the day you’re cleared\n- **Broker setups** with the top brokers in your lanes",
      "## How Much Does MC Authority Cost in 2026?",
      "- **FMCSA application:** $300\n- **BOC-3 filing:** $20–$50\n- **UCR (single truck):** under $200/year\n- **Insurance down payment:** $1,500–$4,000\n- **LLC formation (optional but recommended):** $50–$500 depending on state",
      "All in, most new authorities are activated for **$2,000–$5,000** counting the insurance down payment — the insurance is by far the largest piece.",
      "## How Long Does It Take?",
      "The paperwork can be filed in a day or two. The gating factor is almost always the **21-day protest period**, so plan on roughly **3–4 weeks from application to ACTIVE**. Use that waiting window to set up factoring, build your carrier packet, and line up dispatch so you are not starting from zero on day one.",
      "## Common Mistakes to Avoid",
      "- **Letting the truck sit** during and after activation while you “figure things out”\n- **Buying the cheapest insurance** without the filings brokers actually require\n- **Skipping the LLC** and mixing personal and business finances\n- **Ignoring compliance** — keep your MCS-150 (biennial update), UCR and IFTA current to avoid your authority going inactive",
      "## Frequently Asked Questions",
      "### How long does it take to get MC authority in 2026?",
      "Filing takes a day or two, but the mandatory 21-day protest period means most carriers go active in about **3–4 weeks** from application.",
      "### Do I need an LLC to get my MC authority?",
      "No, you can file as a sole proprietor, but forming an **LLC** is strongly recommended — it separates your personal assets from business liability and looks more professional to brokers.",
      "### Can I start booking loads before my authority is active?",
      "You cannot legally haul for hire until your authority is **ACTIVE**, but you absolutely should set up factoring, your carrier packet and a dispatcher during the waiting period so you book your first load the day you’re cleared.",
      "### What insurance do I need for a new MC authority?",
      "Plan on **$1,000,000 auto liability** and **$100,000 cargo**, filed with the FMCSA (BMC-91/91X). Brokers may require equal or higher limits before they’ll tender you a load.",
      "### How do I keep my new authority active and compliant?",
      "Keep your **MCS-150** updated every two years (or whenever your info changes), renew **UCR** annually, file **IFTA** quarterly if you cross state lines, and maintain continuous insurance on file. Letting any of these lapse can flip your authority to **inactive** and stop you from booking loads — so put the renewals on a calendar from day one.",
      "## Ready to Roll the Day You’re Active",
      "Your own authority is freedom — but only if the truck moves. The carriers who win plan their first week before the FMCSA even clears them. If you want factoring, broker setups and a dedicated dispatcher ready to book your first load the moment you go active, [start onboarding with Leo Dispatch Inc](/onboarding) or explore our [MC authority programs](/carriers).",
    ].join("\n\n"),
  },
  {
    slug: "box-truck-business-startup",
    title: "How to Start a Box Truck Business in 2026 (With One Truck)",
    category: "Box Truck Business",
    excerpt:
      "From DOT registration to your first booked load — the lean, low-cost path to a profitable one-truck box truck business in 2026, including the freight that pays best.",
    coverImage:
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Inc Team",
    status: "published",
    featured: false,
    publishedAt: "2026-06-08",
    keywords: [
      "box truck business",
      "how to start a box truck business",
      "box truck dispatch",
      "box truck loads",
      "expedited freight",
      "box truck business 2026",
    ],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "How to Start a Box Truck Business in 2026 (One-Truck Startup Guide)",
    metaDescription:
      "The lean 2026 startup path for a one-truck box truck business: DOT registration, real startup costs, the freight that pays best, and how to keep your calendar booked.",
    body: [
      "A single box truck is one of the lowest-barrier ways into freight in 2026. You do not need a CDL for most box trucks, the equipment is affordable, and demand for regional and expedited delivery keeps growing. But starting lean is what separates the operators who profit from the ones who quit in six months. Here is exactly **how to start a box truck business with one truck** — the registration, the real costs, the freight that pays, and how to keep the truck booked.",
      "## Why a Box Truck Business?",
      "Box trucks (also called straight trucks) occupy a sweet spot: bigger than a cargo van, smaller and cheaper to run than a 53-foot dry van. That makes them ideal for **last-mile, regional, expedited and retail freight** that a semi is too big — or too expensive — to handle efficiently. For a new entrepreneur, that means lower fuel bills, easier parking and maneuvering, and a faster, cheaper path to your own authority.",
      "## Do You Need a CDL or DOT Number?",
      "Two thresholds decide your requirements:",
      "- **Under 26,001 lbs GVWR:** generally **no CDL required** — most 16–26 ft box trucks fall here.\n- **Crossing state lines (interstate):** you need a **USDOT number**, and if you’re hauling for hire under your own company, **MC operating authority** too.\n- **Staying within one state (intrastate):** rules vary by state, but you’ll usually still register with your state DOT.",
      "If you plan to run interstate freight for brokers, you’ll want your own authority. Our [step-by-step MC authority guide](/blog/how-to-get-your-mc-authority) walks through the entire FMCSA process.",
      "## Box Truck Startup Costs in 2026",
      "- **Used 16–26 ft box truck:** $20,000–$45,000 (or lease for $900–$1,600/month)\n- **MC authority + USDOT + filings:** $300–$900\n- **Insurance down payment:** $1,500–$3,500\n- **Liftgate, pallet jack, straps, dollies, blankets:** $800–$2,000\n- **Working capital (fuel, tolls, first month):** $2,000–$4,000",
      "Many owners launch a one-truck operation for **$25,000–$50,000** — and far less if they lease the truck instead of buying.",
      "## What Size Box Truck Should You Buy?",
      "Box trucks generally run from 16 to 26 feet, and the size you pick shapes the freight you can take. A **16–18 ft** truck is nimble, cheap to run, and perfect for last-mile, local delivery and lighter expedited loads. A **24–26 ft truck with a liftgate** opens up far more freight — furniture, appliances, palletized retail and larger expedited loads — without crossing into CDL territory if you stay under 26,001 lbs GVWR. For most owner-operators chasing broker freight, a **26 ft box truck with a liftgate and ramp** is the sweet spot: it qualifies for the widest range of loads while keeping you CDL-optional.",
      "## Box Truck Insurance in 2026",
      "Insurance is the cost that surprises new owners most. You’ll need **primary liability, cargo and physical damage** coverage, with brokers commonly requiring **$1,000,000 auto liability and $100,000 cargo**. A new authority with a clean motor-vehicle record typically pays **$600–$1,100 per month**, dropping noticeably after 12 months of clean operation. Don’t buy the cheapest policy that skips the filings brokers require — getting turned away from loads costs far more than the premium you saved. Keep your COI ready to send to brokers instantly so you never lose a load to paperwork delays.",
      "## Pick the Right Freight",
      "Profit in a box truck comes from running the lanes where you are not competing head-to-head with cheap 53-foot vans. The freight that pays best for box trucks:",
      "- **Expedited & hot-shot LTL** — time-critical partial loads that pay a premium for speed\n- **Regional & last-mile delivery** — short hauls with quick turns and high weekly utilization\n- **Retail, furniture and appliance freight** — often needs a liftgate, which many vans don’t have\n- **Amazon Relay and contract routes** — steady, repeatable volume if you qualify\n- **Local distribution and store replenishment** — consistent, schedulable work",
      "## How to Find Box Truck Loads",
      "You have three sources, and the winners use all three:",
      "- **Load boards** like DAT and Truckstop to spot lanes and brokers (see our [best load boards guide](/blog/best-load-boards-2026))\n- **Direct broker and shipper relationships**, which pay better than the public board rate\n- **A [dedicated dispatcher](/services)** who books and negotiates for you so the truck stays moving",
      "## The Secret to Profit: Utilization",
      "Here is the truth most “start a box truck business” videos skip: **rate alone doesn’t make you money — utilization does.** A truck that runs 5–6 booked days a week at a fair rate out-earns one that waits around for the occasional “home-run” load. Keep the calendar full, keep deadhead low, and your weekly average is what builds the business. That is exactly why locking in dispatch early matters more for a one-truck operation than for a big fleet.",
      "## How Much Does It Cost to Run a Box Truck?",
      "Knowing your cost-per-mile is the difference between guessing and running a business. A typical one-truck box operation spends roughly **$0.55–$0.85 per mile** all-in once you add fuel (8–12 MPG), insurance, the truck payment, a maintenance reserve, tolls and phone. On a week of 2,000 booked miles, that is about **$1,400–$1,700 in costs** — so a $1.40–$2.00 per-mile rate leaves healthy margin, while a $0.90 “cheap” load barely covers your expenses. Calculate your own number, keep it on the dash, and never accept a load that doesn’t clear it with room to spare.",
      "## How to Scale From One Truck",
      "- **Reinvest profit** into maintenance reserves and a second truck before you take on big personal expenses\n- **Track cost-per-mile** so you know your true break-even on every lane\n- **Build broker relationships** that follow you as you add trucks\n- **Add drivers carefully** — your first hire should free you to manage, not just drive\n- **Lean on dispatch** so growth doesn’t mean drowning in phone calls",
      "## Common Mistakes to Avoid",
      "- Buying too much truck (or too little) for your target freight\n- Underinsuring and getting turned away by brokers\n- Letting the truck sit between loads instead of pre-booking\n- Competing on price with full-size dry vans instead of selling speed and service",
      "## Frequently Asked Questions",
      "### How much can a box truck business make in 2026?",
      "A well-booked single box truck commonly grosses **$8,000–$14,000 per month**, netting roughly **$3,500–$6,500** after fuel, insurance and payments. Expedited and contract work tends to land at the higher end.",
      "### Do I need authority to run a box truck?",
      "If you haul for hire across state lines, **yes** — you need a USDOT number and MC operating authority. Local intrastate work has different, usually lighter, requirements that vary by state.",
      "### Is a box truck business still worth it?",
      "Yes — demand for regional and last-mile delivery keeps climbing, and the low startup cost means you can reach profitability quickly **if** you keep the truck utilized.",
      "### How do I keep my box truck booked?",
      "Use a dispatcher who works expedited and regional lanes so your truck stays loaded instead of waiting on the board.",
      "### What documents do I need to start booking box truck loads?",
      "Brokers will ask for your **MC authority letter, a current COI (certificate of insurance) listing them as certificate holder, a signed W-9, and your carrier packet**. Having these ready as a single PDF means you can get set up with a new broker in minutes instead of losing a load while you scramble for paperwork.",
      "## Get Your Box Truck Booked",
      "Starting lean and staying booked is the whole game. If you want a dedicated dispatcher finding high-paying expedited and regional freight for your box truck — so you drive while we handle the brokers and paperwork — [start onboarding with Leo Dispatch Inc](/onboarding) today.",
    ].join("\n\n"),
  },
  {
    slug: "best-load-boards-2026",
    title: "The Best Load Boards for Owner-Operators in 2026",
    category: "Load Boards",
    excerpt:
      "DAT vs Truckstop vs direct broker relationships in 2026 — where the high-paying freight actually lives, and how the best carriers use boards as a tool, not a strategy.",
    coverImage:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1600&q=70",
    author: "Leo Dispatch Inc Team",
    status: "published",
    featured: false,
    publishedAt: "2026-06-04",
    keywords: [
      "best load boards",
      "load boards 2026",
      "dat load board",
      "truckstop load board",
      "owner operator loads",
      "find freight loads",
    ],
    ogImage: "",
    canonicalUrl: "",
    noindex: false,
    metaTitle: "Best Load Boards for Owner-Operators in 2026 (DAT vs Truckstop & More)",
    metaDescription:
      "The best load boards for owner-operators in 2026 compared — DAT, Truckstop, 123Loadboard and direct brokers — and how top carriers use boards as a tool, not a strategy.",
    body: [
      "Every owner-operator starts on a load board — and most stay stuck there longer than they should. Load boards are how you find freight when you’re new, but the carriers who actually make money treat them as **one tool, not the whole strategy.** This 2026 guide compares the best load boards for owner-operators, shows you where the high-paying freight really lives, and explains how top carriers layer direct brokers and dispatch on top of the boards to keep their RPM high.",
      "## What a Load Board Actually Does",
      "A load board is a marketplace where freight brokers and shippers post available loads, and carriers search for lanes that fit their truck, location and equipment. You see origin, destination, equipment type, weight and a posted rate (or a “call for rate”). It’s a fast way to find freight — but the **posted number is rarely the best number**, because everyone with the same subscription sees it too.",
      "## DAT — The Industry Standard",
      "**DAT** has the largest volume of posted loads in North America, which makes it the default starting point for most owner-operators. Its biggest value isn’t just the load count — it’s the **rate data**. DAT’s rate tools show you the average broker-to-carrier rate on a lane, which is leverage when you negotiate. Plans scale from basic load search up to full analytics, so you can start lean and upgrade as you grow.",
      "### Best for",
      "Carriers who want the deepest pool of loads and real market rate data to negotiate with. If you only buy one board, this is usually it.",
      "## Truckstop — Strong Rates & Vetting",
      "**Truckstop** is the other major board, with a large load volume, solid rate insight, and strong broker-credit and vetting tools that help you avoid slow-paying or risky brokers. Many carriers run **both DAT and Truckstop** because brokers don’t always post the same load to both — running two boards simply widens the net.",
      "### Best for",
      "Carriers who want broker vetting and credit visibility alongside a big load pool.",
      "## Other Boards Worth Knowing",
      "- **123Loadboard** — a lower-cost option that’s popular with box trucks, hotshots and smaller operators\n- **Truckstop / DAT mobile apps** — book on the go without living at a desktop\n- **Niche & free boards** — useful as a supplement, but volume and rate quality vary; treat them as extra coverage, not your foundation",
      "## How to Actually Use Load Boards (Without Living on Them)",
      "The mistake is treating the board like a slot machine — refreshing all day and grabbing whatever pops up. Use it like a pro instead:",
      "- **Filter tightly** by your equipment, lanes and minimum RPM so you’re not wading through junk\n- **Check the rate data first**, then negotiate up from the broker’s posted number — never accept the first offer\n- **Note the brokers** posting good freight on your lanes and build a direct relationship with them\n- **Plan backhauls** before you take the outbound, so you’re not stuck running empty\n- **Track your cost-per-mile** so you instantly know whether a load is profitable or a trap",
      "## The Real Edge: Direct Brokers + Dispatch",
      "Here’s what separates a carrier grossing top dollar from one scraping by on the same board: the public board rate is the **floor**, not the ceiling. The best freight moves through **direct broker relationships and repeat lanes** that never hit the open board at full price. Building those relationships takes time and constant phone work — which is exactly the time you should be spending driving.",
      "That’s why most successful owner-operators eventually pair the boards with a [dedicated dispatcher](/services). A good dispatcher works DAT, Truckstop **and** direct brokers simultaneously, negotiates every load, and keeps your truck booked on high-RPM lanes — so you’re earning miles instead of refreshing a screen. Pair that with [factoring](/services) and you’re paid in 24 hours instead of waiting on broker terms.",
      "## How Much Do Load Boards Cost in 2026?",
      "Load board pricing in 2026 generally runs **$40–$150+ per month** depending on the platform and the features you add. DAT’s plans tier up from a basic load search to full load-and-rate analytics, while Truckstop offers comparable tiers with broker-credit and vetting tools. Budget options like 123Loadboard sit at the lower end and appeal to box trucks and hotshots. Some carriers also use free or niche boards to supplement, but treat those as extra coverage — their volume and rate accuracy rarely match the paid majors. For a single truck, one strong paid board plus its rate-analytics add-on is usually enough; a board that costs $150/month pays for itself if its rate data wins you even **one** better-negotiated load.",
      "## Load Board Red Flags to Avoid",
      "Not every posting is a good deal — protect yourself with a few habits:",
      "- **Double brokering:** if a “broker” seems to be re-posting another broker’s load, verify authority and avoid it — you may not get paid.\n- **Unrealistically high rates:** a rate far above market can signal a scam or a load nobody else will touch for a reason.\n- **New or poorly rated brokers:** check broker credit scores and days-to-pay before you haul; slow-pay brokers wreck your cash flow.\n- **Vague load details:** missing weight, commodity or appointment times often mean trouble at pickup or delivery.\n- **Phantom freight:** loads that vanish the moment you call signal a board cluttered with stale or fake postings.",
      "## Frequently Asked Questions",
      "### What is the best load board for owner-operators in 2026?",
      "**DAT** is the most popular for its load volume and rate data, with **Truckstop** a close second for broker vetting. Many carriers run both, because brokers don’t always post a load to both boards.",
      "### Are there free load boards worth using?",
      "Free and low-cost boards (like 123Loadboard’s entry tiers and various niche boards) can supplement your search, but they typically have less volume and weaker rate data. Use them as extra coverage, not your only source.",
      "### How do I get higher-paying loads off a board?",
      "Check the lane’s rate data, negotiate up from the posted rate, build direct relationships with the brokers posting good freight, and minimize deadhead. A dispatcher does all of this for you at scale.",
      "### Do I still need load boards if I have a dispatcher?",
      "A dispatcher typically uses the boards plus direct brokers on your behalf, so you don’t have to. Boards remain useful for spot-checking the market, but you stop living on them.",
      "### How do brokers and load boards make money?",
      "Brokers earn a margin between what the shipper pays and what they pay you, and load boards charge carriers and brokers a subscription to access the marketplace. That’s why the posted rate already has the broker’s cut baked in — and why building direct relationships and negotiating hard is how you claw back more of the linehaul.",
      "### Can a new authority use load boards right away?",
      "Yes. Once your MC authority is active and your insurance is on file, you can subscribe and start booking. Just have your carrier packet — authority letter, COI and W-9 — ready so brokers can set you up quickly. See our [MC authority guide](/blog/how-to-get-your-mc-authority) to get active first.",
      "## The Bottom Line",
      "Load boards in 2026 are essential for finding freight — but they’re the starting line, not the finish. The carriers who win use boards to spot lanes and brokers, then build direct relationships and lean on professional dispatch to keep RPM high and the truck moving. If you’d rather drive than refresh a load board all day, [start onboarding with Leo Dispatch Inc](/onboarding) and let a dedicated dispatcher keep your truck booked with high-paying freight.",
    ].join("\n\n"),
  },
];
