import PageHeader from "@/components/ui/PageHeader";
import { site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy — Leo Dispatch Inc",
  description:
    "How Leo Dispatch Inc collects, uses, and protects the information you share through our website, onboarding, and dispatch services.",
  path: "/privacy",
});

const UPDATED = "June 18, 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-3 font-display text-xl font-bold text-paper">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed text-muted">{children}</p>;
}
function LI({ children }: { children: React.ReactNode }) {
  return <li className="text-sm leading-relaxed text-muted">{children}</li>;
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={<>Privacy <span className="text-gradient-gold">Policy</span></>}
        subtitle={`Last updated: ${UPDATED}`}
      />
      <section className="container-x max-w-3xl py-16 sm:py-20">
        <P>
          This Privacy Policy explains how {site.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) collects, uses, and protects information when you visit our website,
          contact us, or onboard as a carrier. By using our website or services, you agree to the
          practices described here.
        </P>

        <H2>Information we collect</H2>
        <P>We collect the information you choose to provide, including:</P>
        <ul className="mb-4 list-disc space-y-2 pl-5">
          <LI><strong className="text-paper">Contact details</strong> — name, email address, phone number, and any message you send through our contact form or live chat.</LI>
          <LI><strong className="text-paper">Carrier onboarding information</strong> — your MC authority and company details, driver and vehicle information, and documents you upload (such as driver&rsquo;s license, certificate of insurance, medical certificate, DOT inspection, W-9, lease agreement, and vehicle registration).</LI>
          <LI><strong className="text-paper">Payment-related information</strong> — banking or voided-check details you provide so we can set up payment and factoring on your behalf.</LI>
          <LI><strong className="text-paper">Technical data</strong> — basic, non-identifying information your browser sends automatically (such as device and usage data) used to operate and secure the site.</LI>
        </ul>

        <H2>How we use your information</H2>
        <ul className="mb-4 list-disc space-y-2 pl-5">
          <LI>To provide dispatch services, onboard your authority, and book and manage loads.</LI>
          <LI>To communicate with you about your account, loads, paperwork, and support requests.</LI>
          <LI>To set up payment, invoicing, and factoring.</LI>
          <LI>To operate, maintain, secure, and improve our website and services.</LI>
          <LI>To comply with legal, tax, and safety/compliance obligations.</LI>
        </ul>

        <H2>How we share information</H2>
        <P>
          We do not sell your personal information. We share it only as needed to provide our
          services — for example, with freight brokers, shippers, factoring companies, and the MC
          authority you lease onto — and with service providers who help us operate (such as email
          and hosting providers). We may also disclose information when required by law.
        </P>

        <H2>Data retention &amp; security</H2>
        <P>
          We keep your information for as long as needed to provide our services and meet legal
          obligations, and we use reasonable safeguards to protect it. No method of transmission or
          storage is 100% secure, but we work to protect your data against unauthorized access.
        </P>

        <H2>Your choices</H2>
        <P>
          You may request access to, correction of, or deletion of your personal information, or ask
          us to stop contacting you, by emailing{" "}
          <a href={`mailto:${site.email}`} className="text-gold hover:underline">{site.email}</a>.
          We will respond within a reasonable time and as required by applicable law.
        </P>

        <H2>Children&rsquo;s privacy</H2>
        <P>
          Our website and services are intended for businesses and individuals who are at least 18
          years old. We do not knowingly collect information from children.
        </P>

        <H2>Changes to this policy</H2>
        <P>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &ldquo;Last updated&rdquo; date above. Continued use of our website or services means you
          accept the updated policy.
        </P>

        <H2>Contact us</H2>
        <P>
          Questions about this policy? Contact {site.name} at{" "}
          <a href={`mailto:${site.email}`} className="text-gold hover:underline">{site.email}</a> or{" "}
          <a href={site.phoneHref} className="text-gold hover:underline">{site.phone}</a>.
        </P>
      </section>
    </>
  );
}
