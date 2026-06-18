import HeroBanner from "@/components/HeroBanner";
import AuthoritiesOrbit from "@/components/sections/AuthoritiesOrbit";
import TrustedBy from "@/components/sections/TrustedBy";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import CarrierPrograms from "@/components/sections/CarrierPrograms";
import SuccessStories from "@/components/sections/SuccessStories";
import ContactCTA from "@/components/sections/ContactCTA";
import RevealSection from "@/components/ui/RevealSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <HeroBanner />
      {/* Each section flows normally (fully visible) and plays its own
          entrance animation the first time it scrolls into view. */}
      <RevealSection variant="fadeUp">
        <TrustedBy />
      </RevealSection>
      <RevealSection variant="zoom">
        <AuthoritiesOrbit />
      </RevealSection>
      <RevealSection variant="left">
        <HowItWorks />
      </RevealSection>
      <RevealSection variant="right">
        <WhyChooseUs />
      </RevealSection>
      <RevealSection variant="blur">
        <CarrierPrograms />
      </RevealSection>
      <RevealSection variant="flip">
        <SuccessStories />
      </RevealSection>
      <RevealSection variant="rise">
        <ContactCTA />
      </RevealSection>
    </>
  );
}
