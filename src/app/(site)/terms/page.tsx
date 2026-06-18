import PageHeader from "@/components/ui/PageHeader";
import { site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service — Leo Dispatch Inc",
  description:
    "The terms that govern your use of the Leo Dispatch Inc website and dispatch services.",
  path: "/terms",
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

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={<>Terms of <span className="text-gradient-gold">Service</span></>}
        subtitle={`Last updated: ${UPDATED}`}
      />
      <section className="container-x max-w-3xl py-16 sm:py-20">
        <P>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the{" "}
          {site.name} website and dispatch services (the &ldquo;Services&rdquo;). By using our
          website or engaging our Services, you agree to these Terms.
        </P>

        <H2>1. Our services</H2>
        <P>
          {site.name} provides truck dispatching and back-office support for owner-operators and
          carriers, including load sourcing, rate negotiation, broker setup, paperwork management,
          and factoring assistance. We act as your dispatch agent; we are not a motor carrier,
          broker, or freight forwarder, and we do not own or operate the freight or equipment.
        </P>

        <H2>2. Eligibility</H2>
        <P>
          To use our Services you must be at least 18 years old and an authorized carrier or
          owner-operator with valid operating authority and insurance. You are responsible for
          keeping your authority, insurance, and credentials active and in good standing.
        </P>

        <H2>3. Your responsibilities</H2>
        <ul className="mb-4 list-disc space-y-2 pl-5">
          <LI>Provide accurate, current, and complete information and documents.</LI>
          <LI>Maintain valid MC/DOT authority, insurance, and all required compliance.</LI>
          <LI>Communicate availability and load decisions promptly.</LI>
          <LI>Perform booked loads safely and in compliance with all applicable laws and regulations.</LI>
        </ul>

        <H2>4. No forced dispatch</H2>
        <P>
          You always have the final say on any load. We never force-dispatch — we only book loads
          you approve. You are responsible for confirming that each load fits your equipment,
          schedule, and operating limits.
        </P>

        <H2>5. Fees</H2>
        <P>
          Our fees are a percentage of the line haul or as otherwise agreed in writing with you.
          Specific rates, billing, and payment terms are set out in your dispatch agreement. Unless
          stated otherwise, fees are earned when a load is booked on your behalf.
        </P>

        <H2>6. No guarantee of results</H2>
        <P>
          We work hard to source high-paying freight, but freight markets fluctuate. We do not
          guarantee any specific load volume, rate, revenue, or earnings. Any examples, calculators,
          or figures on this website are illustrative only and are not a promise of results.
        </P>

        <H2>7. Third parties</H2>
        <P>
          Loads are provided by brokers and shippers, and payment may involve factoring companies
          and the MC authority you lease onto. We are not responsible for the acts, omissions, or
          payment practices of these third parties, though we will assist in resolving issues where
          we reasonably can.
        </P>

        <H2>8. Intellectual property</H2>
        <P>
          The website, its content, and the {site.name} name and branding are owned by {site.name}
          and may not be copied or used without our permission.
        </P>

        <H2>9. Limitation of liability</H2>
        <P>
          To the fullest extent permitted by law, {site.name} is not liable for any indirect,
          incidental, or consequential damages, or for lost profits or revenue, arising from your
          use of the Services. Our total liability for any claim is limited to the fees you paid us
          for the Services giving rise to the claim.
        </P>

        <H2>10. Termination</H2>
        <P>
          Either party may end the dispatch relationship as described in your dispatch agreement. We
          may suspend or terminate access to the Services if you breach these Terms or provide false
          information.
        </P>

        <H2>11. Changes to these terms</H2>
        <P>
          We may update these Terms from time to time. When we do, we will revise the &ldquo;Last
          updated&rdquo; date above. Continued use of the Services means you accept the updated
          Terms.
        </P>

        <H2>12. Contact</H2>
        <P>
          Questions about these Terms? Contact {site.name} at{" "}
          <a href={`mailto:${site.email}`} className="text-gold hover:underline">{site.email}</a> or{" "}
          <a href={site.phoneHref} className="text-gold hover:underline">{site.phone}</a>.
        </P>
      </section>
    </>
  );
}
