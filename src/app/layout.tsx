import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Leo Dispatch — Keep Your Truck Moving",
  description:
    "Dedicated truck dispatch for Owner Operators, Box Trucks, Hotshots, Dry Vans, Reefers and Small Fleets across the USA. We find the loads. You drive.",
  keywords: [
    "truck dispatch",
    "owner operator dispatch",
    "hotshot dispatch",
    "box truck dispatch",
    "load booking",
    "freight dispatch USA",
  ],
  openGraph: {
    title: "Leo Dispatch — Keep Your Truck Moving",
    description: "We find the loads. You drive. 24/7 dedicated dispatch across 48 states.",
    type: "website",
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
