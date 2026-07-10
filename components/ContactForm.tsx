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
    <div className="contact-tally-panel">
      <TallyButton
        className="button tally-cta-button"
        ctaLocation="contact_selected_route"
        form={form}
      >
        Talk With Denny
      </TallyButton>
    </div>
  );
}
