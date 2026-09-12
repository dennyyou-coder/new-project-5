"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TallyFallbackDialog } from "./TallyFallbackDialog";
import type { TallySubmission } from "@/lib/tallySubmission";
import { getTallyForm, type TallyFormKey } from "@/lib/tallyForms";
import {
  buildContactFallbackUrl,
  buildTallyUrl,
  createLeadAttribution,
  getConversionGroup,
  trackLeadEvent,
  type ConversionGroup,
  type LeadAttribution
} from "@/lib/leadTracking";

const popupWidth = 620;
const tallyWidgetSrc = "https://tally.so/widgets/embed.js";
let tallyWidgetPromise: Promise<void> | undefined;

function loadTallyWidget() {
  if (window.Tally?.openPopup) return Promise.resolve();
  if (tallyWidgetPromise) return tallyWidgetPromise;

  tallyWidgetPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${tallyWidgetSrc}"]`
    );
    const script = existing || document.createElement("script");
    const timeout = window.setTimeout(
      () => reject(new Error("Tally widget timed out")),
      5000
    );
    const finish = (callback: () => void) => {
      window.clearTimeout(timeout);
      callback();
    };

    script.addEventListener("load", () => finish(resolve), { once: true });
    script.addEventListener(
      "error",
      () => finish(() => reject(new Error("Tally widget failed to load"))),
      { once: true }
    );

    if (!existing) {
      script.src = tallyWidgetSrc;
      script.async = true;
      document.head.append(script);
    }
  }).catch((error) => {
    tallyWidgetPromise = undefined;
    throw error;
  });

  return tallyWidgetPromise;
}

type TallySubmitPayload = TallySubmission;

type TallyMessageData = {
  event?: string;
  payload?: {
    formId?: string;
    responseId?: string;
  };
};

declare global {
  interface Window {
    Tally?: {
      openPopup: (
        formId: string,
        options?: {
          layout?: "modal";
          width?: number;
          emoji?: {
            text: string;
            animation: string;
          };
          hiddenFields?: LeadAttribution;
          onOpen?: () => void;
          onSubmit?: (payload: TallySubmitPayload) => void;
        }
      ) => void;
    };
  }
}

export function TallyReportButton({
  className = "button",
  children = "Get Free Reports",
  ctaLocation,
  reportId,
  onOpen
}: {
  className?: string;
  children?: ReactNode;
  ctaLocation: string;
  reportId?: string;
  onOpen?: () => void;
}) {
  return (
    <TallyButton
      className={className}
      ctaLocation={ctaLocation}
      form="reports"
      onOpen={onOpen}
      reportId={reportId}
    >
      {children}
    </TallyButton>
  );
}

export function TallyButton({
  className = "button",
  children,
  form,
  ctaLocation,
  reportId,
  productCategory,
  productId,
  inquiryType,
  inquiryIntent,
  eventContext,
  onOpen
}: {
  className?: string;
  children: ReactNode;
  form: TallyFormKey;
  ctaLocation: string;
  reportId?: string;
  conversionGroup?: ConversionGroup;
  productCategory?: string;
  productId?: string;
  inquiryType?: string;
  inquiryIntent?: string;
  trackClick?: boolean;
  eventContext?: {
    cta_type?: string;
    article_slug?: string;
    article_category?: string;
  };
  onClickTrack?: () => void;
  onOpen?: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "unavailable" | "fallback" | "success"
  >("idle");
  const triggerRef = useRef<HTMLSpanElement>(null);
  const viewedRef = useRef(false);
  const submittedRef = useRef(false);
  const submissionIdsRef = useRef(new Set<string>());
  const openingRef = useRef(false);
  const [fallbackAttribution, setFallbackAttribution] = useState<LeadAttribution | null>(null);
  const tallyForm = getTallyForm(form);
  const fallbackUrl = buildContactFallbackUrl({
    conversion_group: getConversionGroup(tallyForm.formType),
    cta_location: ctaLocation
  });

  useEffect(() => {
    const node = triggerRef.current;
    if (!node || viewedRef.current) return;

    const sendView = () => {
      if (viewedRef.current) return;
      viewedRef.current = true;
      const attribution = createLeadAttribution({
        formType: tallyForm.formType,
        sourcePage: window.location.pathname,
        ctaLocation,
        language: document.documentElement.lang || "en",
        search: window.location.search,
        reportId,
        productCategory,
        productId,
        inquiryType,
        inquiryIntent
      });
      trackLeadEvent("cta_view", { ...attribution, ...eventContext });
    };

    if (!("IntersectionObserver" in window)) {
      sendView();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        sendView();
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [
    ctaLocation,
    eventContext,
    inquiryIntent,
    inquiryType,
    productCategory,
    productId,
    reportId,
    tallyForm.formType
  ]);

  function completeSubmission(payload: TallySubmitPayload, attribution: LeadAttribution) {
    const responseId = payload.id || payload.responseId;
    if (submittedRef.current || (responseId && submissionIdsRef.current.has(responseId))) return;
    submittedRef.current = true;
    if (responseId) submissionIdsRef.current.add(responseId);
    const parameters = { ...attribution, ...eventContext, response_id: responseId };
    trackLeadEvent("form_submit", parameters);
    trackLeadEvent("form_success", { ...parameters, conversion_value: 1 });
    setStatus("success");
    setFallbackAttribution(null);
  }

  async function openTallyForm() {
    if (openingRef.current || fallbackAttribution) return;
    openingRef.current = true;
    submittedRef.current = false;
    setStatus("idle");
    const attribution = createLeadAttribution({
      formType: tallyForm.formType,
      sourcePage: window.location.pathname,
      ctaLocation,
      language: document.documentElement.lang || "en",
      search: window.location.search,
      reportId,
      productCategory,
      productId,
      inquiryType,
      inquiryIntent
    });

    trackLeadEvent("cta_click", {
      ...attribution,
      ...eventContext
    });

    onOpen?.();

    if (!tallyForm.id || !tallyForm.url) {
      openingRef.current = false;
      setStatus("unavailable");
      trackLeadEvent("form_error", {
        ...attribution,
        ...eventContext,
        error_reason: "missing_form_configuration"
      });
      return;
    }

    try {
      await loadTallyWidget();
      if (window.Tally?.openPopup) {
        window.Tally.openPopup(tallyForm.id, {
          layout: "modal",
          width: popupWidth,
          hiddenFields: attribution,
          onOpen: () => trackLeadEvent("form_open", {
            ...attribution, ...eventContext, open_method: "popup"
          }),
          onSubmit: (payload) => completeSubmission(payload, attribution)
        });
        return;
      }
    } catch {
      // Keep the form in this page so its confirmed submission can be tracked.
    } finally {
      openingRef.current = false;
    }
    setFallbackAttribution(attribution);
    setStatus("fallback");
  }

  return (
    <span className="lead-form-trigger" ref={triggerRef}>
      <button className={className} onClick={openTallyForm} type="button">
        {children}
      </button>
      <span aria-live="polite" className="lead-form-status" role="status">
        {status === "unavailable" && (
          <>
            The form is temporarily unavailable.{" "}
            <Link href={fallbackUrl}>Use the Contact page instead</Link>.
          </>
        )}
        {status === "success" &&
          "Thank you. Your information was received successfully."}
      </span>
      {fallbackAttribution && (
        <TallyFallbackDialog
          formId={tallyForm.id}
          attribution={fallbackAttribution}
          contactUrl={fallbackUrl}
          onOpen={() => trackLeadEvent("form_open", {
            ...fallbackAttribution, ...eventContext, open_method: "fallback"
          })}
          onSubmit={(payload) => completeSubmission(payload, fallbackAttribution)}
          onClose={() => { setFallbackAttribution(null); setStatus("idle"); }}
        />
      )}
    </span>
  );
}

export function TallyInlineEmbed({
  className = "",
  ctaLocation,
  form,
  inquiryIntent,
  productCategory,
  title
}: {
  className?: string;
  ctaLocation: string;
  form: TallyFormKey;
  inquiryIntent?: string;
  productCategory?: string;
  title: string;
}) {
  const tallyForm = getTallyForm(form);
  const [embedUrl, setEmbedUrl] = useState(() => {
    if (!tallyForm.id || !tallyForm.url) return "";
    return buildTallyUrl(
      `${tallyForm.url}?transparentBackground=1`,
      createLeadAttribution({
        formType: tallyForm.formType,
        sourcePage: "/sourcing",
        ctaLocation,
        inquiryIntent,
        productCategory
      })
    );
  });
  const attributionRef = useRef<LeadAttribution | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!tallyForm.id || !tallyForm.url) return;

    const attribution = createLeadAttribution({
      formType: tallyForm.formType,
      sourcePage: window.location.pathname,
      ctaLocation,
      language: document.documentElement.lang || "en",
      search: window.location.search,
      inquiryIntent,
      productCategory
    });

    attributionRef.current = attribution;
    setEmbedUrl(
      buildTallyUrl(`${tallyForm.url}?transparentBackground=1`, attribution)
    );

    function handleTallyMessage(event: MessageEvent<TallyMessageData>) {
      if (event.origin !== "https://tally.so") return;
      if (event.data?.event !== "Tally.FormSubmitted") return;
      if (event.data.payload?.formId !== tallyForm.id) return;
      if (!attributionRef.current || submittedRef.current) return;

      submittedRef.current = true;
      const payload = {
        ...attributionRef.current,
        response_id: event.data.payload.responseId
      };
      trackLeadEvent("form_submit", payload);
      trackLeadEvent("form_success", { ...payload, conversion_value: 1 });
    }

    window.addEventListener("message", handleTallyMessage);
    return () => window.removeEventListener("message", handleTallyMessage);
  }, [ctaLocation, inquiryIntent, productCategory, tallyForm.formType, tallyForm.id, tallyForm.url]);

  if (!tallyForm.id || !tallyForm.url) {
    return <p>The form is temporarily unavailable. Please use the Contact page.</p>;
  }

  if (!embedUrl) {
    return <div aria-label="Loading inquiry form" className={className} />;
  }

  return (
    <iframe
      allow="clipboard-write"
      className={className}
      loading="lazy"
      onLoad={() => {
        if (!attributionRef.current) return;
        trackLeadEvent("form_open", {
          ...attributionRef.current,
          open_method: "inline"
        });
      }}
      src={embedUrl}
      title={title}
    />
  );
}

export function ReportsLeadForm({
  ctaLocation = "reports_footer",
  reportId
}: {
  ctaLocation?: string;
  reportId?: string;
} = {}) {
  return (
    <div className="reports-v1-hero-form" aria-label="Get free reports">
      <label>Select free World Clean Biz reports</label>
      <div>
        <TallyReportButton
          ctaLocation={ctaLocation}
          reportId={reportId}
        >
          Select Free Reports
        </TallyReportButton>
      </div>
      <p className="lead-form-expectation">
        For relevant business requests, share your company, market and business objective. Complete the form to choose the reports you want to receive.
      </p>
    </div>
  );
}

export function ExpoLeadForm({ roles: _roles }: { roles: string[] }) {
  return (
    <div className="tally-cta-panel expo-capture-form">
      <p className="tally-cta-eyebrow">WCB Expo</p>
      <h3>Receive Expo Updates</h3>
      <p>
        Get visitor registration timing, exhibitor news, forum agenda and
        business matching updates.
      </p>
      <TallyButton
        className="button tally-cta-button"
        ctaLocation="wce_footer_visitor"
        form="expo"
        inquiryIntent="visitor_interest"
      >
        Get Expo Updates
      </TallyButton>
      <p className="lead-form-expectation">
        Tell us whether you plan to visit, exhibit or connect. World Clean Biz reviews the request and routes it to the relevant team.
      </p>
    </div>
  );
}

export function NewsletterLeadForm() {
  return (
    <div className="insights-newsletter-cta">
      <div>
        <p className="eyebrow">Blog Updates</p>
        <h2>Get New Cleaning Industry Articles First</h2>
        <p>
          Subscribe to receive new World Clean Biz articles, market signals and
          cleaning industry notes when they are published.
        </p>
      </div>
      <div className="newsletter-form-row">
        <TallyButton ctaLocation="blog_newsletter" form="newsletter">
          Subscribe To Blog Updates
        </TallyButton>
      </div>
      <p className="lead-form-expectation">
        For readers who want selected cleaning industry articles and market signals. You can choose the updates relevant to your work.
      </p>
    </div>
  );
}
