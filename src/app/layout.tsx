import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { OG_IMAGE } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Leo Dispatch Inc — Keep Your Truck Moving",
  description:
    "Dedicated truck dispatch for Owner Operators, Box Trucks, Hotshots, Dry Vans, Reefers and Small Fleets across the USA. We find the loads. You drive.",
  applicationName: "Leo Dispatch Inc",
  keywords: [
    "truck dispatch",
    "owner operator dispatch",
    "hotshot dispatch",
    "box truck dispatch",
    "load booking",
    "freight dispatch USA",
  ],
  openGraph: {
    title: "Leo Dispatch Inc — Keep Your Truck Moving",
    description: "We find the loads. You drive. 24/7 dedicated dispatch across 48 states.",
    type: "website",
    siteName: "Leo Dispatch Inc",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leo Dispatch Inc — Keep Your Truck Moving",
    description: "We find the loads. You drive. 24/7 dedicated dispatch across 48 states.",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <head>
        {/* Google tag (gtag.js) — Google Ads (AW-18273366324) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18273366324"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18273366324');`,
          }}
        />
      </head>
      <body className="bg-ink text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
