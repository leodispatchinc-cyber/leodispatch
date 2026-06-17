import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import DispatchServices from "@/components/sections/DispatchServices";
import HowItWorks from "@/components/sections/HowItWorks";
import FreightMap from "@/components/sections/FreightMap";
import RevenueCalculator from "@/components/sections/RevenueCalculator";
import FAQ from "@/components/sections/FAQ";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "Dispatch Services — Leo Dispatch Inc",
  description:
    "Full-service truck dispatch: load booking, rate negotiation, broker setup, paperwork, factoring and 24/7 support across 48 states.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title={<>Full-Service <span className="text-gradient-gold">Truck Dispatch</span></>}
        subtitle="From load booking to factoring, we handle the back office so you can keep your truck moving and profitable."
      >
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
        >
          Start Onboarding <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-paper transition-all hover:border-gold hover:text-gold"
        >
          Talk to a Dispatcher
        </Link>
      </PageHeader>

      <DispatchServices />
      <HowItWorks />
      <FreightMap />
      <RevenueCalculator />
      <FAQ />
      <ContactCTA />
    </>
  );
}
