import {
  LEAD_FORM_TYPES,
  type LeadFormType
} from "@/lib/leadTracking";

export { LEAD_FORM_TYPES };

type TallyFormDefinition = {
  id: string;
  url: string;
  formType: LeadFormType;
};

function defineForm(id: string | undefined, formType: LeadFormType) {
  const normalizedId = id?.trim() || "";

  return {
    id: normalizedId,
    url: normalizedId ? `https://tally.so/r/${normalizedId}` : "",
    formType
  } satisfies TallyFormDefinition;
}

export const TALLY_FORMS = {
  contact: defineForm("MeV8L8", "contact"),
  sourcing: defineForm("1ARG4M", "sourcing"),
  reports: defineForm("ZjeGvz", "reports"),
  expo: defineForm("lbzVN6", "wce_visitor"),
  newsletter: defineForm(
    process.env.NEXT_PUBLIC_TALLY_NEWSLETTER_FORM_ID,
    "newsletter"
  ),
  wceExhibitor: defineForm(
    process.env.NEXT_PUBLIC_TALLY_WCE_EXHIBITOR_FORM_ID,
    "wce_exhibitor"
  ),
  wceVisitor: defineForm("lbzVN6", "wce_visitor")
} as const;

export type TallyFormKey = keyof typeof TALLY_FORMS;

export function getTallyForm(key: TallyFormKey): TallyFormDefinition {
  return TALLY_FORMS[key];
}
