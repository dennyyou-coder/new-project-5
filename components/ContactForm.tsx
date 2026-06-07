"use client";

import { useSearchParams } from "next/navigation";
import { TallyButton } from "@/components/LeadForms";
import type { TallyFormKey } from "@/lib/tallyForms";

const inquiryFormMap: Record<string, TallyFormKey> = {
  sourcing: "sourcing",
  expo: "expo",
  media: "contact",
  general: "contact"
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "general";
  const form = inquiryFormMap[type] || "contact";

  return (
    <div className="tally-cta-panel contact-tally-panel">
      <p className="tally-cta-eyebrow">Lead Capture</p>
      <h3>Choose The Right Inquiry Form</h3>
      <p>
        Your submission goes through Tally and is saved directly in Airtable for
        follow-up.
      </p>
      <TallyButton className="button tally-cta-button" form={form}>
        Submit Inquiry
      </TallyButton>
    </div>
  );
}
