import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import PageHeader from "@/components/ui/PageHeader";
import CarrierPrograms from "@/components/sections/CarrierPrograms";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Recruitment from "@/components/sections/Recruitment";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Carriers & MC Authority Programs — Leo Dispatch Inc",
  description:
    "Lease your truck onto an established MC authority, upload your documents once, and start booking high-paying loads with dedicated dispatch.",
  path: "/carriers",
});

export default function CarriersPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Carriers", path: "/carriers" },
          ]),
        ]}
      />
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
