export type LeadEventName =
  | "cta_view"
  | "cta_click"
  | "form_open"
  | "form_submit"
  | "form_success";

export type LeadEventPayload = {
  conversion_group: "sourcing" | "reports" | "contact" | "expo";
  form_type: string;
  source_page: string;
  cta_location: string;
  inquiry_intent?: string;
  product_category?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

declare global {
  interface Window {
    gtag?: (command: "event", name: LeadEventName, payload: LeadEventPayload) => void;
  }
}

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function currentAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    utmKeys.flatMap((key) => {
      const value = params.get(key);
      return value ? [[key, value]] : [];
    })
  );
}

export function trackLeadEvent(name: LeadEventName, payload: LeadEventPayload) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, { ...payload, ...currentAttribution() });
}

export function buildTrackedFormUrl(url: string, payload: LeadEventPayload) {
  const tracked = new URL(url);
  const values = { ...payload, ...currentAttribution() };
  Object.entries(values).forEach(([key, value]) => {
    if (value) tracked.searchParams.set(key, value);
  });
  return tracked.toString();
}
