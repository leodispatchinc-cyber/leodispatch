import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Leo Dispatch Inc — Keep Your Truck Moving",
    description: "We find the loads. You drive. 24/7 dedicated dispatch across 48 states.",
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
      <body className="bg-ink text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
