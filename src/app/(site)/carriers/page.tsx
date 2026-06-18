import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import CarrierPrograms from "@/components/sections/CarrierPrograms";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Recruitment from "@/components/sections/Recruitment";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "Carriers & MC Authority Programs — Leo Dispatch Inc",
  description:
    "Lease your truck onto an established MC authority, upload your documents once, and start booking high-paying loads with dedicated dispatch.",
  alternates: { canonical: "/carriers" },
  openGraph: {
    title: "Carriers & MC Authority Programs — Leo Dispatch Inc",
    description:
      "Lease your truck onto an established MC authority, upload your documents once, and start booking high-paying loads with dedicated dispatch.",
    url: "/carriers",
    type: "website",
    siteName: "Leo Dispatch Inc",
  },
};

export default function CarriersPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Owner-Operators"
        title={<>Run Under An <span className="text-gradient-gold">Established Authority</span></>}
        subtitle="Skip the headaches of your own authority. Lease on, get compliant fast, and let us keep you loaded and paid."
      />
      <CarrierPrograms />
      <WhyChooseUs />
      <Recruitment />
      <ContactCTA />
    </>
  );
}
