"use client";

import { ReactNode, useState } from "react";
import { getTallyForm, type TallyFormKey } from "@/lib/tallyForms";
import {
  buildTallyUrl,
  createLeadAttribution,
  trackLeadEvent,
  type LeadAttribution
} from "@/lib/leadTracking";

const popupWidth = 620;

type TallySubmitPayload = {
  responseId?: string;
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
  onOpen
}: {
  className?: string;
  children: ReactNode;
  form: TallyFormKey;
  ctaLocation: string;
  reportId?: string;
  onOpen?: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "unavailable" | "fallback" | "success"
  >("idle");

  function openTallyForm() {
    const tallyForm = getTallyForm(form);
    const attribution = createLeadAttribution({
      formType: tallyForm.formType,
      sourcePage: window.location.pathname,
      ctaLocation,
      language: document.documentElement.lang || "en",
      search: window.location.search,
      reportId
    });

    onOpen?.();

    if (!tallyForm.id || !tallyForm.url) {
      setStatus("unavailable");
      trackLeadEvent("form_error", {
        ...attribution,
        error_reason: "missing_form_configuration"
      });
      return;
    }

    if (window.Tally?.openPopup) {
      window.Tally.openPopup(tallyForm.id, {
        layout: "modal",
        width: popupWidth,
        hiddenFields: attribution,
        onOpen: () => {
          trackLeadEvent("form_open", {
            ...attribution,
            open_method: "popup"
          });
        },
        onSubmit: (payload) => {
          trackLeadEvent("form_submit", {
            ...attribution,
            response_id: payload.responseId
          });
          setStatus("success");
          trackLeadEvent("form_success", {
            ...attribution,
            response_id: payload.responseId
          });
        }
      });
      return;
    }

    const fallback = window.open(
      buildTallyUrl(tallyForm.url, attribution),
      "_blank",
      "noopener,noreferrer"
    );

    if (!fallback) {
      setStatus("unavailable");
      trackLeadEvent("form_error", {
        ...attribution,
        error_reason: "popup_blocked"
      });
      return;
    }

    setStatus("fallback");
    trackLeadEvent("form_open", {
      ...attribution,
      open_method: "fallback"
    });
  }

  return (
    <span className="lead-form-trigger">
      <button className={className} onClick={openTallyForm} type="button">
        {children}
      </button>
      <span aria-live="polite" className="lead-form-status" role="status">
        {status === "unavailable" &&
          "The form is temporarily unavailable. Please use the Contact page."}
        {status === "fallback" && "The form opened in a new tab."}
        {status === "success" &&
          "Thank you. Your information was received successfully."}
      </span>
    </span>
  );
}

export function ReportsLeadForm() {
  return (
    <div className="reports-v1-hero-form" aria-label="Get free reports">
      <label>Free report access</label>
      <div>
        <TallyReportButton
          ctaLocation="reports_hero"
          reportId="next-decade-cleaning-growth"
        />
      </div>
      <p>Complete a short form to receive the report link.</p>
    </div>
  );
}

export function ExpoLeadForm({ roles: _roles }: { roles: string[] }) {
  return (
    <div className="tally-cta-panel expo-capture-form">
      <p className="tally-cta-eyebrow">World Clean Expo</p>
      <h3>Receive Expo Updates</h3>
      <p>
        Get visitor registration timing, exhibitor news, forum agenda and
        business matching updates.
      </p>
      <TallyButton
        className="button tally-cta-button"
        ctaLocation="wce_footer_visitor"
        form="expo"
      >
        Get Expo Updates
      </TallyButton>
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
    </div>
  );
}
