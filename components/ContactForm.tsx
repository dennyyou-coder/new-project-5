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
    <div className="form">
      <TallyButton form={form}>
        Submit Inquiry
      </TallyButton>
      <p className="form-status">
        Complete a short form and your inquiry will be added to our lead system.
      </p>
    </div>
  );
}
