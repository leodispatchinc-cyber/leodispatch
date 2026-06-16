/* ============================================================
   LEO DISPATCH — MC Authority companies
   Each entry powers a public onboarding page (/onboarding/[slug]),
   a requirements page (/onboarding/[slug]/requirements),
   the document-collection form, and the admin "MC Companies" view.
   Add a company here → fully working pages appear.
   ============================================================ */

export interface RequiredDoc {
  /** stable key used as the upload field name + storage key */
  key: string;
  label: string;
  /** short helper shown under the upload control */
  help?: string;
  required?: boolean;
  /** allow more than one file (e.g. truck pictures) */
  multiple?: boolean;
  /** override the accepted file types (defaults to image/pdf/doc) */
  accept?: string;
  /** detailed bullet instructions shown on the requirements page */
  instructions?: string[];
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  zip: string;
}

export interface McCompany {
  slug: string;
  /** display name */
  name: string;
  /** legal name, as it should appear on documents */
  legalName: string;
  authorityType: string; // e.g. "MC Authority"
  status: "active" | "coming-soon";
  /** company email carriers should send certificates to */
  email?: string;
  address: Address;
  /** headline shown on the company onboarding page */
  tagline: string;
  /** payment terms, e.g. "Payment in 24 to 48 hours" */
  payTerms: string;
  /** who the COI must list as the certificate holder */
  coiHolder: Address & { name: string };
  /** optional insurance-limit / additional-insured requirements */
  coiRequirements?: string[];
  /** structured data we collect in addition to uploads */
  collectTruck: boolean; // make, model, year, VIN
  collectTruckDimensions?: boolean; // length, width, height
  collectEld: boolean; // ELD provider + credentials
  collectBanking: boolean; // typed pay account info
  /** documents the driver must upload */
  documents: RequiredDoc[];
}

export function fullAddress(a: Address) {
  return `${a.line1}, ${a.city}, ${a.state} ${a.zip}`;
}

/* ── Move Em Out — standard owner-operator document set ──────── */
const MOVE_EM_OUT_DOCS: RequiredDoc[] = [
  { key: "drivers_license", label: "Driver's License", help: "Clear, readable copy of the driver's license (front).", required: true },
  { key: "coi", label: "Certificate of Insurance (COI)", help: "Must list the company below as the certificate holder.", required: true },
  { key: "medical_certificate", label: "Driver Medical Certificate", help: "Current DOT medical examiner's certificate.", required: true },
  { key: "dot_inspection", label: "Latest DOT Truck Inspection Report", help: "Your most recent annual DOT inspection.", required: true },
  { key: "w9", label: "W-9 Form", help: "Completed and signed IRS W-9.", required: true },
  { key: "lease_agreement", label: "Lease Agreement", help: "Signed equipment / owner-operator lease agreement.", required: true },
];

/* ── Base Cargo — document set ──────────────────────────────── */
const BASE_CARGO_DOCS: RequiredDoc[] = [
  {
    key: "coi",
    label: "Certificate of Insurance (COI)",
    help: "Must meet the limits below and list us as Holder + Additional Insured.",
    required: true,
    accept: "image/*,.pdf",
    instructions: [
      "$1,000,000 liability limit",
      "$100,000 cargo limit",
      "Add BASE CARGO LLC as Certificate Holder AND Additional Insured",
      "Email the certificate to baseintcargo@gmail.com",
    ],
  },
  { key: "drivers_license", label: "Driver's License", help: "Clear, readable copy of the driver's license (front).", required: true },
  { key: "void_check", label: "VOID Check", help: "A voided check — this is your bank info we'll use for payment.", required: true },
  {
    key: "truck_pictures",
    label: "Truck Pictures",
    help: "Photos from the front, rear, both sides, and the cargo area.",
    required: true,
    multiple: true,
    accept: "image/*",
  },
  { key: "vehicle_registration", label: "Vehicle Registration", help: "Current vehicle registration document.", required: true },
];

export const mcCompanies: McCompany[] = [
  {
    slug: "move-em-out-llc",
    name: "Move Em Out LLC",
    legalName: "MOVE EM OUT LLC",
    authorityType: "MC Authority",
    status: "active",
    address: { line1: "78 Lucinda Ct", city: "Hampton", state: "VA", zip: "23666" },
    tagline: "Lease onto an established authority and start booking high-paying loads — paid in 24–48 hours.",
    payTerms: "Payment in 24 to 48 hours",
    coiHolder: { name: "MOVE EM OUT LLC", line1: "78 Lucinda Ct", city: "Hampton", state: "VA", zip: "23666" },
    collectTruck: true,
    collectEld: true,
    collectBanking: true,
    documents: MOVE_EM_OUT_DOCS,
  },
  {
    slug: "base-cargo-llc",
    name: "Base Cargo LLC",
    legalName: "BASE CARGO LLC",
    authorityType: "MC Authority",
    status: "active",
    email: "baseintcargo@gmail.com",
    address: { line1: "5908 Lawn Ave", city: "Cleveland", state: "OH", zip: "44102" },
    tagline: "Lease onto Base Cargo and get paid every Monday — submit your documents below to get started.",
    payTerms: "Payment every Monday — 10%",
    coiHolder: { name: "BASE CARGO LLC", line1: "5908 Lawn Ave", city: "Cleveland", state: "OH", zip: "44102" },
    coiRequirements: [
      "$1,000,000 liability limit",
      "$100,000 cargo limit",
      "List BASE CARGO LLC as Certificate Holder AND Additional Insured",
      "Email the signed certificate to baseintcargo@gmail.com",
    ],
    collectTruck: false,
    collectTruckDimensions: true,
    collectEld: false,
    collectBanking: false,
    documents: BASE_CARGO_DOCS,
  },
  {
    slug: "silver-arrow-logistics-llc",
    name: "Silver Arrow Logistics LLC",
    legalName: "SILVER ARROW LOGISTICS LLC",
    authorityType: "MC Authority",
    status: "active",
    address: { line1: "104 S Main St Ste 800 #1032", city: "Greenville", state: "SC", zip: "29601" },
    tagline: "Lease onto Silver Arrow Logistics and start booking high-paying loads — paid in 24–48 hours.",
    payTerms: "Payment in 24 to 48 hours",
    coiHolder: {
      name: "SILVER ARROW LOGISTICS LLC",
      line1: "104 S Main St Ste 800 #1032",
      city: "Greenville",
      state: "SC",
      zip: "29601",
    },
    collectTruck: true,
    collectEld: true,
    collectBanking: true,
    documents: MOVE_EM_OUT_DOCS,
  },
];

export function getCompany(slug: string): McCompany | undefined {
  return mcCompanies.find((c) => c.slug === slug);
}
