"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Truck,
  Ruler,
  Cpu,
  Banknote,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Check,
  Loader2,
  Lock,
  MapPin,
  Clock,
} from "lucide-react";
import type { McCompany } from "@/lib/companies";
import { fullAddress } from "@/lib/companies";

type Status = "idle" | "sending" | "done" | "error";

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof User;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-yellow/10 text-gold">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
          {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  half,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  half?: boolean;
}) {
  return (
    <label className={half ? "block" : "block sm:col-span-2"}>
      <span className="mb-1.5 block text-sm font-medium text-muted">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className="field-input"
      />
    </label>
  );
}

export default function OnboardingForm({ company }: { company: McCompany }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) return;
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    data.append("companySlug", company.slug);
    data.append("companyName", company.name);

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/onboarding", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("done");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
        setError(json.error || "Submission failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid place-items-center rounded-3xl border border-success/40 bg-surface p-10 text-center sm:p-14"
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold">Onboarding Submitted!</h2>
        <p className="mt-3 max-w-md text-muted">
          Your documents and details have been sent to the {company.name} onboarding team. We&apos;ll
          review everything and reach out to get you set up and booking loads.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-yellow/5 px-5 py-2.5 text-sm font-semibold text-gold">
          <Clock className="h-4 w-4" /> {company.payTerms}
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {/* Driver & contact */}
      <Section icon={User} title="Driver & Contact" desc="Who we'll be working with.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Driver Full Name" name="driverName" placeholder="John Carrier" required half />
          <Field label="Phone" name="phone" type="tel" placeholder="(555) 010-2030" half />
          <Field label="Email" name="email" type="email" placeholder="you@email.com" half />
          <div className="hidden sm:block" />
          <Field label="MC Number" name="mcNumber" placeholder="MC-123456" half />
          <Field label="DOT Number" name="dotNumber" placeholder="1234567" half />
        </div>
      </Section>

      {/* Truck / equipment */}
      {company.collectTruck && (
        <Section icon={Truck} title="Truck & Equipment" desc="Make, model and VIN of the truck you'll run.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Truck Make" name="truckMake" placeholder="Freightliner" half />
            <Field label="Truck Model" name="truckModel" placeholder="Cascadia" half />
            <Field label="Year" name="truckYear" placeholder="2021" half />
            <Field label="VIN Number" name="vin" placeholder="1FUJGLDR0CLBP8834" half />
          </div>
        </Section>
      )}

      {/* Truck dimensions */}
      {company.collectTruckDimensions && (
        <Section icon={Ruler} title="Truck Dimensions" desc="Overall dimensions of your truck and cargo area.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Length" name="truckLength" placeholder="e.g. 53 ft" half />
            <Field label="Width" name="truckWidth" placeholder="e.g. 8.5 ft" half />
            <Field label="Height" name="truckHeight" placeholder="e.g. 13.5 ft" half />
            <Field label="Cargo Area (L × W × H)" name="cargoDimensions" placeholder="e.g. 48 × 8 × 9 ft" half />
          </div>
        </Section>
      )}

      {/* ELD */}
      {company.collectEld && (
        <Section
          icon={Cpu}
          title="ELD / Electronic Logging"
          desc="The DOT-compliant ELD you use, plus the login we'll use to monitor HOS."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ELD Company Name" name="eldCompany" placeholder="Motive, Samsara, etc." half />
            <div className="hidden sm:block" />
            <Field label="ELD Username" name="eldUsername" placeholder="username" half />
            <Field label="ELD Password" name="eldPassword" placeholder="••••••••" half />
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
            <Lock className="h-3.5 w-3.5 text-gold" /> Credentials are used only for dispatch &amp; compliance.
          </p>
        </Section>
      )}

      {/* Payment */}
      {company.collectBanking && (
        <Section icon={Banknote} title="Payment Details" desc="Where we'll send your pay. Bank details and/or Zelle.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bank Name" name="bankName" placeholder="Bank of America" half />
            <Field label="Account Holder Name" name="accountName" placeholder="John Carrier" half />
            <Field label="Routing Number" name="routingNumber" placeholder="021000021" half />
            <Field label="Account Number" name="accountNumber" placeholder="000123456789" half />
            <Field label="Zelle (email or phone)" name="zelle" placeholder="you@email.com or (555) 555-5555" half />
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
            <Lock className="h-3.5 w-3.5 text-gold" /> Banking details are kept private and used for payment only.
          </p>
        </Section>
      )}

      {/* Documents */}
      <Section
        icon={UploadCloud}
        title="Required Documents"
        desc="Upload clear photos or PDFs. JPG, PNG, PDF, DOC accepted."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {company.documents.map((doc) => (
            <label key={doc.key} className={doc.multiple ? "block sm:col-span-2" : "block"}>
              <span className="mb-1.5 block text-sm font-medium text-muted">
                {doc.label} {doc.required && <span className="text-gold">*</span>}
                {doc.multiple && <span className="ml-1 text-xs text-muted/70">(select multiple)</span>}
              </span>
              <input
                name={doc.key}
                type="file"
                required={doc.required}
                multiple={doc.multiple}
                accept={doc.accept ?? "image/*,.pdf,.doc,.docx"}
                className="field-input"
              />
              {doc.help && <span className="mt-1 block text-xs text-muted/80">{doc.help}</span>}
              {doc.instructions && doc.instructions.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {doc.instructions.map((ins) => (
                    <li key={ins} className="flex items-start gap-1.5 text-xs text-muted">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-gold" /> {ins}
                    </li>
                  ))}
                </ul>
              )}
            </label>
          ))}
        </div>

        {/* COI holder reminder */}
        {company.coiHolder.name && (
          <div className="mt-5 rounded-xl border border-gold/30 bg-yellow/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold">
              <MapPin className="h-3.5 w-3.5" /> List this as your COI Certificate Holder
            </div>
            <div className="mt-2 text-sm text-paper">
              <div className="font-semibold">{company.coiHolder.name}</div>
              <div className="text-muted">
                {company.coiHolder.line1}
                <br />
                {company.coiHolder.city}, {company.coiHolder.state} {company.coiHolder.zip}
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Consent + submit */}
      <div className="rounded-2xl border border-line bg-surface p-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-yellow"
          />
          <span>
            I confirm the information above is accurate and authorize {company.name} and Leo Dispatch Inc
            to use it for onboarding, dispatch and compliance.
          </span>
        </label>

        {status === "error" && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!consent || status === "sending"}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" /> Submit Onboarding
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Submitting for <span className="text-paper">{company.name}</span> ·{" "}
          {fullAddress(company.address)}
        </p>
      </div>
    </form>
  );
}
