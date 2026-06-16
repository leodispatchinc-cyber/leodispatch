# Leo Dispatch — Premium Owner-Operator Dispatch Platform

A "Tesla-meets-trucking" marketing site + onboarding portal + admin dashboard for a
USA truck dispatch company. Built to look more trustworthy than every other dispatcher
site the moment an owner-operator lands on the page.

## Tech Stack

| Area | Choice | Notes |
|------|--------|-------|
| Framework | **Next.js 15** (App Router) | React 19, server components |
| Language | **TypeScript** | strict mode |
| Styling | **Tailwind CSS v4** | brand tokens in `globals.css` `@theme` |
| Animation | **Framer Motion** + CSS/SVG | chosen over Three.js/GSAP to stay **fast** |
| Smooth scroll | **Lenis** | `src/components/SmoothScroll.tsx` |
| Forms | **React Hook Form** | onboarding wizard validation |
| Backend (scaffolded) | **Supabase** + **Resend** | via REST `fetch` — no heavy SDKs |
| Uploads (scaffolded) | **UploadThing** | wire your token in `.env.local` |

> Speed note: Homepage ships ~195 KB First Load JS. Three.js + GSAP were intentionally
> left out (they add ~600 KB and fight the "must be fast" goal). The structure makes
> adding a 3D hero trivial later if desired.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
# or
npm run build && npm run start
```

## Brand System
Defined in `src/app/globals.css`:
`#000` background · `#FFD000` yellow · `#F4B400` gold · `#FFFFFF` text ·
`#A1A1AA` gray · `#262626` border · `#16A34A` success.

## Structure

```
src/
  app/
    layout.tsx                  # fonts + metadata (root)
    globals.css                 # brand tokens, utilities, form styles
    icon.svg                    # favicon (auto-served by Next.js)
    (site)/                     # public marketing site (shared Navbar/Footer + Lenis)
      layout.tsx                #   SmoothScroll + Navbar + Footer wrapper
      page.tsx                  #   Home
      services/  equipment/     #   marketing pages
      carriers/  about/  contact/
      onboarding/               #   MC-authority chooser
        page.tsx                #     index of authorities
        [company]/page.tsx      #     per-authority page + document form
      blog/                     #   SEO blog (index + post pages)
    admin/                      # dashboard (own layout, no site chrome)
      page.tsx                  #   live KPIs + recent onboarding
      onboarding/page.tsx       #   all submissions
      onboarding/[id]/page.tsx  #   submission detail + document downloads
      [section]/page.tsx        #   MC companies, contact requests, applications, …
    api/
      onboarding/route.ts       # multipart submit → saves fields + files
      files/[id]/[name]/route.ts# serves an uploaded document
      contact/route.ts apply/route.ts
  components/
    Navbar.tsx  Footer.tsx  SmoothScroll.tsx  LeoLogo.tsx
    OnboardingForm.tsx  ContactForm.tsx
    sections/             # Hero, TrustedBy, HowItWorks, TruckTypes, WhyChooseUs,
                          # CarrierPrograms, FreightMap, RevenueCalculator,
                          # SuccessStories, DispatchServices, FAQ, Recruitment, ContactCTA
    ui/                   # PageHeader, Reveal, Counter, SectionHeading, Button, Spotlight
  lib/
    companies.ts          # MC authorities (drives onboarding pages + forms + admin)
    store.ts              # local file-based persistence (.data/) + uploads
    data.ts               # site content, nav, footer, site config
    admin.ts  blog.ts     # admin nav/helpers + blog content
    leads.ts  utils.ts    # Supabase/Resend (optional) + helpers
public/                   # hero video/posters
.data/                    # (gitignored) submissions JSON + uploaded files
```

## Pages
- **Home** `/` — Hero, Trusted By, How It Works, Why Choose Us, MC Authorities, Success Stories, CTA
- **Services** `/services` · **Equipment** `/equipment` · **Carriers** `/carriers` · **About** `/about` · **Contact** `/contact` · **Blog** `/blog`
- **Onboarding** `/onboarding` → `/onboarding/<company>` — per-MC-authority document-collection form

## Carrier Onboarding & Dashboard
Each MC authority in `src/lib/companies.ts` generates a public onboarding page with a full
document-collection form (driver, truck/VIN, ELD + credentials, payment, and document uploads
— license, COI, medical certificate, DOT inspection, W-9, lease agreement).

Submissions POST to `/api/onboarding`, which **saves every field to `.data/onboarding.json`
and writes uploaded files to `.data/uploads/<id>/`** — so the admin captures everything with
**no external service required**. The admin dashboard (`/admin` → Carrier Onboarding) lists all
submissions and links to each document.

> Add another authority by appending an entry to `mcCompanies` — a working page appears at
> `/onboarding/<slug>` automatically.

⚠️ **Security:** the local store keeps submissions (including sensitive fields like ELD/bank
details) as plaintext on disk, and `/admin` + `/api/files` have **no auth yet**. Add admin
authentication and move secrets to encrypted storage before exposing this publicly.

## Going live (optional backend)
The local store works out of the box. To add a hosted DB + email, copy
`.env.local.example` → `.env.local` and fill in **Supabase** / **Resend** keys —
`src/lib/leads.ts` already mirrors submissions to Supabase and sends alerts when configured.
