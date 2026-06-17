import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import TruckTypes from "@/components/sections/TruckTypes";
import RevenueCalculator from "@/components/sections/RevenueCalculator";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "Equipment We Dispatch — Leo Dispatch Inc",
  description:
    "We dispatch hotshots, box trucks, dry vans, reefers, flatbeds, power only, sprinter vans and step decks across all 48 states.",
};

export default function EquipmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Equipment"
        title={<>Every Truck. <span className="text-gradient-gold">Every Lane.</span></>}
        subtitle="Whatever you drive, we have the lanes and the broker relationships to keep it loaded with high-RPM freight."
      >
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 text-sm font-semibold text-black transition-all hover:bg-gold active:scale-[0.98]"
        >
          Get Dispatched <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      <TruckTypes />
      <RevenueCalculator />
      <ContactCTA />
    </>
  );
}
