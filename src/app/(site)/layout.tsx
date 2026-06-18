import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import JsonLd from "@/components/seo/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      {/* Site-wide company + website structured data (renders on every public page) */}
      <JsonLd data={[organizationLd, websiteLd]} />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ChatWidget />
    </SmoothScroll>
  );
}
