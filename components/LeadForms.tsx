"use client";

import { ReactNode, useEffect, useRef } from "react";
import { TALLY_FORMS, type TallyFormKey } from "@/lib/tallyForms";
import {
  buildTrackedFormUrl,
  trackLeadEvent,
  type LeadEventPayload
} from "@/lib/leadTracking";

const popupWidth = 620;

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
          hiddenFields?: Record<string, string>;
          onOpen?: () => void;
          onSubmit?: () => void;
        }
      ) => void;
    };
  }
}

export function TallyReportButton({
  className = "button",
  children = "Get Free Reports",
  onOpen
}: {
  className?: string;
  children?: ReactNode;
  onOpen?: () => void;
}) {
  return (
    <TallyButton className={className} form="reports" onOpen={onOpen}>
      {children}
    </TallyButton>
  );
}

export function TallyButton({
  className = "button",
  children,
  form,
  onOpen,
  conversionGroup,
  ctaLocation = "legacy_unmapped",
  inquiryIntent,
  productCategory,
  productId
}: {
  className?: string;
  children: ReactNode;
  form: TallyFormKey;
  onOpen?: () => void;
  conversionGroup?: LeadEventPayload["conversion_group"];
  ctaLocation?: string;
  inquiryIntent?: string;
  productCategory?: string;
  productId?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const viewed = useRef(false);
  const group = conversionGroup || form;

  function eventPayload(): LeadEventPayload {
    return {
      conversion_group: group,
      form_type: form,
      source_page: window.location.pathname,
      cta_location: ctaLocation,
      inquiry_intent: inquiryIntent,
      product_category: productCategory,
      product_id: productId
    };
  }

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || viewed.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || viewed.current) return;
      viewed.current = true;
      trackLeadEvent("cta_view", eventPayload());
      observer.disconnect();
    });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  function openTallyForm() {
    const tallyForm = TALLY_FORMS[form];
    const payload = eventPayload();

    onOpen?.();
    trackLeadEvent("cta_click", payload);

    if (window.Tally?.openPopup) {
      window.Tally.openPopup(tallyForm.id, {
        layout: "modal",
        width: popupWidth,
        hiddenFields: Object.fromEntries(
          Object.entries(payload).filter((entry): entry is [string, string] => Boolean(entry[1]))
        ),
        onOpen: () => trackLeadEvent("form_open", payload),
        onSubmit: () => {
          trackLeadEvent("form_submit", payload);
          trackLeadEvent("form_success", payload);
        }
      });
      return;
    }

    trackLeadEvent("form_open", payload);
    window.open(buildTrackedFormUrl(tallyForm.url, payload), "_blank", "noopener,noreferrer");
  }

  return (
    <button ref={buttonRef} className={className} onClick={openTallyForm} type="button">
      {children}
    </button>
  );
}

export function ReportsLeadForm() {
  return (
    <div className="reports-v1-hero-form" aria-label="Get free reports">
      <label>Free report access</label>
      <div>
        <TallyReportButton />
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
      <TallyButton className="button tally-cta-button" form="expo">
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
        <TallyReportButton>Subscribe To Blog Updates</TallyReportButton>
      </div>
    </div>
  );
}
