/**
 * WCB lead forms: three short forms (subscribe, business inquiry, expo registration) that all post to
 * /api/leads, which stores the contact in Brevo. Shared by the client forms and the API route.
 */

export const ROLES = [
  { value: "brand", label: "Brand or retailer" },
  { value: "buyer", label: "Distributor or buyer" },
  { value: "manufacturer", label: "Manufacturer, OEM or ODM" },
  { value: "components", label: "Component supplier" },
  { value: "investor", label: "Investor or analyst" },
  { value: "media", label: "Media" },
  { value: "other", label: "Other" }
] as const;

export const INTERESTS = [
  { value: "robot-vacuums", label: "Robot vacuums" },
  { value: "vacuum-cleaners", label: "Vacuum cleaners" },
  { value: "floor-washers", label: "Floor washers" },
  { value: "pool-robots", label: "Pool robots" },
  { value: "robotic-mowers", label: "Robotic mowers" },
  { value: "commercial-cleaning", label: "Commercial cleaning" },
  { value: "power-tools", label: "Power tools and outdoor" }
] as const;

export const NEEDS = [
  { value: "supplier", label: "Find a supplier or factory" },
  { value: "partnership", label: "Partnership or advertising" },
  { value: "media", label: "Media or interview" },
  { value: "correction", label: "Correction to a profile or article" },
  { value: "other", label: "Something else" }
] as const;

export type LeadKind = "subscribe" | "inquiry" | "expo";
export type ExpoRole = "visitor" | "exhibitor";

export type Lead = {
  kind: LeadKind;
  email: string;
  consent: boolean;
  name?: string;
  company?: string;
  country?: string;
  role?: string;
  interests?: string[];
  need?: string;
  category?: string;
  message?: string;
  expoRole?: ExpoRole;
  phone?: string;
  /** Inquiry and expo forms: also subscribe to the weekly brief. */
  subscribe?: boolean;
  reportId?: string;
  sourcePage?: string;
  ctaLocation?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (value: unknown, max = 200) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const oneOf = <T extends readonly { value: string }[]>(list: T, value: unknown) =>
  list.some((item) => item.value === value) ? (value as string) : "";

/** Bots fill hidden fields and submit within a second or two; people do neither. */
export function looksAutomated(input: Record<string, unknown>, now = Date.now()) {
  if (clean(input.website)) return true;
  const started = Number(input.startedAt);
  return Number.isFinite(started) && started > 0 && now - started < 1500;
}

export function validateLead(input: Record<string, unknown>): { ok: true; lead: Lead } | { ok: false; error: string; field?: string } {
  const kind = input.kind;
  if (kind !== "subscribe" && kind !== "inquiry" && kind !== "expo") return { ok: false, error: "Unknown form" };
  const email = clean(input.email, 160).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email address", field: "email" };
  const lead: Lead = {
    kind,
    email,
    consent: input.consent === true,
    name: clean(input.name, 80),
    company: clean(input.company, 120),
    country: clean(input.country, 80),
    role: oneOf(ROLES, input.role),
    interests: Array.isArray(input.interests) ? input.interests.filter((item) => INTERESTS.some((interest) => interest.value === item)).slice(0, 7) as string[] : [],
    need: oneOf(NEEDS, input.need),
    category: oneOf(INTERESTS, input.category),
    message: clean(input.message, 2000),
    expoRole: input.expoRole === "exhibitor" ? "exhibitor" : input.expoRole === "visitor" ? "visitor" : undefined,
    phone: clean(input.phone, 60),
    subscribe: input.subscribe === true,
    reportId: clean(input.reportId, 80),
    sourcePage: clean(input.sourcePage, 200),
    ctaLocation: clean(input.ctaLocation, 80)
  };
  if (kind === "subscribe" && !lead.consent) return { ok: false, error: "Tick the box to receive WCB emails", field: "consent" };
  if (kind === "inquiry") {
    if (!lead.need) return { ok: false, error: "Choose what you need", field: "need" };
    if (!lead.name) return { ok: false, error: "Enter your name", field: "name" };
    if (!lead.company) return { ok: false, error: "Enter your company and country", field: "company" };
  }
  if (kind === "expo") {
    if (!lead.expoRole) return { ok: false, error: "Choose visit or exhibit", field: "expoRole" };
    if (!lead.name) return { ok: false, error: "Enter your name", field: "name" };
    if (!lead.company) return { ok: false, error: "Enter your company", field: "company" };
  }
  return { ok: true, lead };
}

/** Contact attributes as Brevo stores them (attribute names must exist in the Brevo account). */
export function brevoAttributes(lead: Lead): Record<string, string> {
  const attributes: Record<string, string | undefined> = {
    FIRSTNAME: lead.name,
    COMPANY: lead.company,
    COUNTRY: lead.country,
    ROLE: lead.role,
    INTERESTS: lead.interests?.length ? lead.interests.join(",") : lead.category,
    NEED: lead.need,
    PHONE_WECHAT: lead.phone,
    LEAD_TYPE: lead.kind === "expo" ? `expo-${lead.expoRole}` : lead.kind === "inquiry" ? `inquiry-${lead.need}` : lead.reportId ? "report" : "newsletter",
    REPORT_ID: lead.reportId,
    SOURCE_PAGE: lead.sourcePage
  };
  return Object.fromEntries(Object.entries(attributes).filter(([, value]) => value)) as Record<string, string>;
}

export type LeadLists = { newsletter?: number; inquiry?: number; expoVisitor?: number; expoExhibitor?: number };

/** The non-marketing list a submission belongs to; the newsletter list is added separately when the reader opts in. */
export function directListFor(lead: Lead, lists: LeadLists) {
  if (lead.kind === "inquiry") return lists.inquiry;
  if (lead.kind === "expo") return lead.expoRole === "exhibitor" ? lists.expoExhibitor : lists.expoVisitor;
  return undefined;
}

/** Whether the person asked for the weekly brief (always true for the subscribe form). */
export function wantsNewsletter(lead: Lead) {
  return lead.kind === "subscribe" || (lead.subscribe === true && lead.consent);
}

/** Which of the old Tally form keys maps to which new form. */
export function leadKindForForm(form: string): { kind: LeadKind; expoRole?: ExpoRole; need?: string } {
  if (form === "newsletter" || form === "reports") return { kind: "subscribe" };
  if (form === "wceExhibitor") return { kind: "expo", expoRole: "exhibitor" };
  if (form === "wceVisitor" || form === "expo") return { kind: "expo", expoRole: "visitor" };
  if (form === "sourcing") return { kind: "inquiry", need: "supplier" };
  return { kind: "inquiry" };
}
