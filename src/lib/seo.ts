/* Shared schema.org structured data builders. Kept server-safe (no client
   imports) so they can be rendered into JSON-LD from any server component. */
import { site, faqs } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const DESCRIPTION =
  "Dedicated truck dispatch for owner operators, box trucks, hotshots, dry vans, reefers, flatbeds and small fleets across all 48 states. We find the loads — you drive.";

/** Site-wide company identity — powers brand/knowledge-panel signals. */
export const organizationLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.name,
  legalName: site.name,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon.svg`,
  image: `${SITE_URL}/opengraph-image`,
  description: DESCRIPTION,
  email: site.email,
  telephone: site.phoneHref.replace("tel:", ""),
  areaServed: { "@type": "Country", name: "United States" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    contactType: "customer service",
    areaServed: "US",
    availableLanguage: "English",
  },
};

/** Site descriptor, linked to the organization as publisher. */
export const websiteLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: site.name,
  description: DESCRIPTION,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
};

/** FAQ rich-result schema built from the shared FAQ content. */
export const faqPageLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/** Build a BreadcrumbList from ordered { name, path } crumbs. */
export function breadcrumbLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
