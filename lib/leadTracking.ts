export const LEAD_FORM_TYPES = [
  "contact",
  "sourcing",
  "reports",
  "newsletter",
  "wce_exhibitor",
  "wce_visitor"
] as const;

export const LOCAL_ANALYTICS_DEBUG_HOSTS = [
  "localhost",
  "127.0.0.1",
  "::1"
] as const;

export function isLocalAnalyticsDebugHost(hostname: string): boolean {
  return LOCAL_ANALYTICS_DEBUG_HOSTS.some((host) => host === hostname);
}

export type LeadFormType = (typeof LEAD_FORM_TYPES)[number];

export type ConversionGroup =
  | "sourcing"
  | "reports"
  | "expo"
  | "contact"
  | "newsletter";

export function getConversionGroup(formType: LeadFormType): ConversionGroup {
  if (formType === "wce_exhibitor" || formType === "wce_visitor") {
    return "expo";
  }

  return formType;
}

export type LeadEventName =
  | "cta_view"
  | "cta_click"
  | "form_open"
  | "form_submit"
  | "form_success"
  | "form_error";

export type LeadAttribution = {
  form_type: LeadFormType;
  conversion_group: ConversionGroup;
  conversion_value: number;
  source_page: string;
  cta_location: string;
  language: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  report_id: string;
  product_category: string;
  inquiry_type: string;
  inquiry_intent: string;
};

type AttributionInput = {
  formType: LeadFormType;
  sourcePage: string;
  ctaLocation: string;
  language?: string;
  search?: string;
  reportId?: string;
  productCategory?: string;
  inquiryType?: string;
  inquiryIntent?: string;
};

type LeadEventParameters = Partial<LeadAttribution> & {
  form_type: LeadFormType;
  source_page: string;
  cta_location: string;
  language: string;
  response_id?: string;
  error_reason?: string;
  open_method?: "popup" | "fallback" | "inline";
  cta_type?: string;
  article_slug?: string;
  article_category?: string;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: LeadEventName,
      parameters: LeadEventParameters
    ) => void;
  }
}

export function createLeadAttribution({
  formType,
  sourcePage,
  ctaLocation,
  language = "en",
  search = "",
  reportId = "",
  productCategory = "",
  inquiryType = "",
  inquiryIntent = ""
}: AttributionInput): LeadAttribution {
  const params = new URLSearchParams(search);

  return {
    form_type: formType,
    conversion_group: getConversionGroup(formType),
    conversion_value: 0,
    source_page: sourcePage,
    cta_location: ctaLocation,
    language,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    report_id: reportId,
    product_category: productCategory,
    inquiry_type: inquiryType,
    inquiry_intent: inquiryIntent
  };
}

export function buildContactFallbackUrl({
  conversion_group,
  cta_location
}: Pick<LeadAttribution, "conversion_group" | "cta_location">): string {
  const params = new URLSearchParams({
    intent: conversion_group,
    source: cta_location
  });

  return `/contact?${params.toString()}`;
}

export function buildTallyUrl(
  baseUrl: string,
  attribution: LeadAttribution
): string {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(attribution)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

export function trackLeadEvent(
  eventName: LeadEventName,
  parameters: LeadEventParameters
): boolean {
  if (typeof window === "undefined" || !window.gtag) return false;

  window.gtag("event", eventName, parameters);
  return true;
}
