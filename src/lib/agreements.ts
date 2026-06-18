/* ============================================================
   Independent Operator Indemnity & Hold-Harmless agreements
   ------------------------------------------------------------
   Each MC authority can attach an agreement the operator must
   read + sign. The signer (src/components/AgreementSigner.tsx)
   renders this text, captures a signature, generates a signed
   PDF and can send it straight to the admin dashboard.
   ============================================================ */

export interface AgreementSection {
  heading: string;
  body: string;
}

export interface Agreement {
  /** the legal carrier name, as it appears in the document + signature block */
  carrier: string;
  title: string;
  intro: string;
  sections: AgreementSection[];
}

/** Build the standard indemnity agreement for a given carrier name. */
function buildAgreement(carrier: string, shortName: string = carrier): Agreement {
  return {
    carrier,
    title: `${carrier} Independent Operator Indemnity and Hold Harmless Agreement`,
    intro:
      `This Indemnity and Hold Harmless Agreement (the “Agreement”) is entered into as of {{DATE}}, ` +
      `by and between ${carrier} (“${shortName}”) and the undersigned independent operator (“Operator”).`,
    sections: [
      {
        heading: "1. Purpose",
        body:
          `This Agreement sets forth the understanding that the Operator is an independent contractor who is leasing onto ${carrier}’s ` +
          `Motor Carrier (MC) and Department of Transportation (DOT) authority solely for the purpose of transporting freight. ` +
          `The Operator is operating their own vehicle and providing their own insurance coverage.`,
      },
      {
        heading: "2. Independent Contractor Status",
        body:
          `The Operator acknowledges that they are not an employee of ${carrier} and that they are solely responsible for their own ` +
          `actions, equipment, and liabilities. The Operator is responsible for maintaining all necessary insurance policies on their ` +
          `vehicle and ensuring that their insurance meets the requirements set forth by ${carrier}.`,
      },
      {
        heading: "3. Assumption of Risk and Indemnity",
        body:
          `The Operator agrees that they assume all risks associated with the operation of their own vehicle. ${carrier} is not ` +
          `responsible for any injury, loss, damage, or liability that the Operator may incur while operating under ${carrier}’s authority.`,
      },
      {
        heading: "4. Hold Harmless Clause",
        body:
          `The Operator agrees to hold harmless, defend, and indemnify ${carrier} from any and all claims, demands, liabilities, losses, ` +
          `damages, or expenses, including legal fees, arising out of or related to the Operator’s use of their own equipment under this Agreement.`,
      },
      {
        heading: "5. Insurance Requirements",
        body:
          `The Operator shall maintain at their own expense a valid insurance policy that meets or exceeds the minimum coverage levels ` +
          `required by ${carrier} and by applicable law. Such insurance must list ${carrier} as an additional insured and certificate holder.`,
      },
      {
        heading: "6. Conclusion",
        body:
          `By signing below, the Operator acknowledges that they have read, understood, and agreed to the terms of this Agreement and that ` +
          `they are solely responsible for their own equipment and any associated liabilities.`,
      },
    ],
  };
}

/** Agreements keyed by MC authority slug. Add an entry to attach one. */
export const agreementBySlug: Record<string, Agreement> = {
  "silver-arrow-logistics-llc": buildAgreement("Silver Arrow Logistics", "Silver Arrow"),
  "move-em-out-llc": buildAgreement("Move Em Out LLC"),
};

export function getAgreement(slug: string): Agreement | undefined {
  return agreementBySlug[slug];
}
