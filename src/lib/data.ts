/* ============================================================
   LEO DISPATCH — Central content model
   Everything content-driven lives here so the admin panel can
   edit copy / document requirements without touching components.
   ============================================================ */

import {
  Truck,
  Package,
  Container,
  Snowflake,
  LayoutGrid,
  Zap,
  Bus,
  Layers,
  DollarSign,
  UserCheck,
  ShieldCheck,
  Handshake,
  PhoneCall,
  FileText,
  Banknote,
  Headphones,
  type LucideIcon,
} from "lucide-react";

/* ── Hero stats ───────────────────────────────────────────── */
export const heroStats = [
  { value: 500, suffix: "+", label: "Loads Booked Monthly" },
  { value: 48, suffix: "", label: "States Covered" },
  { value: 24, suffix: "/7", label: "Dispatch Support" },
  { value: 1, suffix: ":1", label: "Dedicated Dispatcher" },
];

/* ── Trusted-by marquee ───────────────────────────────────── */
export const trustedBy = [
  "DAT",
  "Truckstop",
  "FMCSA",
  "RTS Financial",
  "OTR Solutions",
  "Apex Capital",
  "Comdata",
  "EFS",
];

/* ── How it works ─────────────────────────────────────────── */
export const howItWorks = [
  { step: "01", title: "Upload Documents", desc: "Send your MC, insurance and W9. Onboarding takes minutes, not days." },
  { step: "02", title: "Dispatcher Assignment", desc: "You're paired with one dedicated dispatcher who knows your lanes." },
  { step: "03", title: "Load Booking", desc: "We find high-paying loads and negotiate the best rate for every mile." },
  { step: "04", title: "Start Earning", desc: "You drive, we handle the paperwork. Keep your truck moving and profitable." },
];

/* ── Truck types ──────────────────────────────────────────── */
export const truckTypes: { name: string; icon: LucideIcon; blurb: string }[] = [
  { name: "Hotshot", icon: Zap, blurb: "Pickup + gooseneck. Fast, flexible, high RPM freight." },
  { name: "Box Truck", icon: Package, blurb: "Local & regional freight, Amazon, expedited loads." },
  { name: "Dry Van", icon: Container, blurb: "The backbone of freight. Consistent, steady lanes." },
  { name: "Reefer", icon: Snowflake, blurb: "Temperature-controlled. Premium produce & food loads." },
  { name: "Flatbed", icon: LayoutGrid, blurb: "Steel, lumber, machinery. Strong rates year-round." },
  { name: "Power Only", icon: Truck, blurb: "Pull pre-loaded trailers. Drop and hook efficiency." },
  { name: "Sprinter Van", icon: Bus, blurb: "Expedited & cargo van loads. First-in, first-out." },
  { name: "Step Deck", icon: Layers, blurb: "Tall & oversized freight the flatbed can't handle." },
];

/* ── Why owner operators choose us ────────────────────────── */
export const whyChoose: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: "High Paying Loads", desc: "We chase rate-per-mile, not volume. Your truck earns more per trip.", icon: DollarSign },
  { title: "Dedicated Dispatcher", desc: "One person, your number, your lanes. No call-center roulette.", icon: UserCheck },
  { title: "No Forced Dispatch", desc: "You always have the final say. Reject any load, no penalties.", icon: ShieldCheck },
  { title: "Rate Negotiation", desc: "We fight brokers on every load so you keep more of the line haul.", icon: Handshake },
  { title: "Broker Communication", desc: "We handle the calls, check-ins and tracking updates for you.", icon: PhoneCall },
  { title: "Paperwork Management", desc: "Rate cons, BOLs, PODs — filed, tracked and organized.", icon: FileText },
  { title: "Factoring Assistance", desc: "Get paid fast. We set up and manage your factoring flow.", icon: Banknote },
  { title: "24/7 Support", desc: "Breakdown at 2am? We answer. Dispatch never sleeps.", icon: Headphones },
];

/* Carrier programs are now modeled as real MC authorities in
   src/lib/companies.ts (see `mcCompanies`). */

/* ── Live freight lanes (map) ─────────────────────────────── */
export const freightLanes = [
  { from: "Dallas", to: "Atlanta", x1: 55, y1: 67, x2: 73, y2: 60 },
  { from: "Chicago", to: "Houston", x1: 64, y1: 38, x2: 56, y2: 76 },
  { from: "Los Angeles", to: "Phoenix", x1: 14, y1: 60, x2: 26, y2: 63 },
  { from: "New Jersey", to: "Florida", x1: 87, y1: 38, x2: 80, y2: 84 },
];

/* ── Revenue calculator equipment presets ─────────────────── */
export const equipmentPresets: { type: string; rpm: number }[] = [
  { type: "Hotshot", rpm: 1.85 },
  { type: "Box Truck", rpm: 1.6 },
  { type: "Dry Van", rpm: 2.1 },
  { type: "Reefer", rpm: 2.45 },
  { type: "Flatbed", rpm: 2.55 },
  { type: "Power Only", rpm: 1.75 },
];

/* ── Testimonials ─────────────────────────────────────────── */
export const testimonials = [
  { name: "Marcus T.", role: "Hotshot Owner — TX", quote: "Switched to Leo and my weekly gross jumped 22%. My dispatcher actually picks up the phone.", earn: "$8,400/wk" },
  { name: "Dana R.", role: "Box Truck Owner — GA", quote: "They kept me loaded through the slow season when everyone else said there was nothing.", earn: "$5,100/wk" },
  { name: "Sergei K.", role: "Dry Van Owner — IL", quote: "No forced dispatch, real rate negotiation. First dispatcher that treats my truck like a business.", earn: "$7,250/wk" },
  { name: "Andre P.", role: "Reefer Owner — CA", quote: "Premium produce lanes every week. Paperwork and factoring just handled. I only drive.", earn: "$9,600/wk" },
];

/* ── Dispatch services ────────────────────────────────────── */
export const dispatchServices = [
  { title: "Load Booking", desc: "High-RPM loads sourced and booked daily across 48 states." },
  { title: "Rate Negotiation", desc: "We push every broker for top dollar on each line haul." },
  { title: "Broker Setup", desc: "Carrier packets and broker onboarding handled for you." },
  { title: "Carrier Packets", desc: "Completed, signed and submitted so you never miss a load." },
  { title: "POD Management", desc: "Proof of delivery collected, tracked and filed instantly." },
  { title: "Invoice Support", desc: "Clean invoices sent and followed up until you're paid." },
  { title: "Factoring Setup", desc: "Same-day funding partners connected to your account." },
  { title: "Route Planning", desc: "Fuel-smart routing that keeps deadhead miles near zero." },
  { title: "Safety Compliance", desc: "FMCSA, IFTA and DOT paperwork kept current and clean." },
];

/* ── FAQ ──────────────────────────────────────────────────── */
export const faqs = [
  { q: "How much do you charge?", a: "We charge a flat percentage of the line haul — no hidden fees, no sign-up cost. You only pay when we book you a load." },
  { q: "Do you work with new MCs?", a: "Yes. Our New Authority Program is built specifically for carriers with an MC under 90 days, including factoring setup and broker onboarding." },
  { q: "Do you dispatch box trucks?", a: "Absolutely. Box trucks, Sprinter vans, hotshots, dry vans, reefers, flatbeds, step decks and power-only — we cover them all." },
  { q: "Do you provide hotshot loads?", a: "Yes. Hotshot is one of our highest-volume equipment types, with dedicated lanes and high-RPM freight." },
  { q: "Can I reject loads?", a: "Always. We never force-dispatch. Every load is your decision — we only book what you approve." },
  { q: "How quickly can I start?", a: "Most carriers are onboarded and booking their first load within 24 hours of uploading documents." },
];

/* ── Recruitment roles ────────────────────────────────────── */
export const recruitmentRoles = [
  { title: "Hotshot Owner Operators", desc: "High-RPM expedited freight, flexible lanes." },
  { title: "Box Truck Owner Operators", desc: "Local, regional and expedited box freight." },
  { title: "Dry Van Owner Operators", desc: "Steady, consistent long-haul van lanes." },
  { title: "Fleet Owners", desc: "Scale 3+ trucks with dedicated fleet dispatch." },
];

/* ── Site config (company contact details) ────────────────── */
export const site = {
  name: "Leo Dispatch Inc",
  tagline: "We find the loads. You drive.",
  phone: "(360) 524-3663",
  phoneHref: "tel:+13605243663",
  email: "leodispatchinc@gmail.com",
  hours: "Mon–Sun · 24/7 Dispatch",
  location: "United States · 48 States",
};

/* ── Primary navigation (real page routes) ────────────────── */
export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Equipment", href: "/equipment" },
  { label: "Carriers", href: "/carriers" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/* ── Footer (label + href) ────────────────────────────────── */
export const footerColumns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Admin", href: "/admin" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Load Booking", href: "/services" },
      { label: "Rate Negotiation", href: "/services" },
      { label: "Factoring Setup", href: "/services" },
      { label: "POD Management", href: "/services" },
      { label: "Safety Compliance", href: "/services" },
    ],
  },
  {
    title: "Equipment",
    links: [
      { label: "Hotshot", href: "/equipment" },
      { label: "Box Truck", href: "/equipment" },
      { label: "Dry Van", href: "/equipment" },
      { label: "Reefer", href: "/equipment" },
      { label: "Flatbed", href: "/equipment" },
    ],
  },
  {
    title: "Carriers",
    links: [
      { label: "Carrier Programs", href: "/carriers" },
      { label: "Start Onboarding", href: "/onboarding" },
      { label: "Revenue Calculator", href: "/services#calculator" },
      { label: "Apply Now", href: "/onboarding" },
    ],
  },
];
