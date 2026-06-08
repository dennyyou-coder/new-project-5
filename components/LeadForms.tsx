"use client";

import { ReactNode } from "react";
import { TALLY_FORMS, type TallyFormKey } from "@/lib/tallyForms";

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
  onOpen
}: {
  className?: string;
  children: ReactNode;
  form: TallyFormKey;
  onOpen?: () => void;
}) {
  function openTallyForm() {
    const tallyForm = TALLY_FORMS[form];

    onOpen?.();

    if (window.Tally?.openPopup) {
      window.Tally.openPopup(tallyForm.id, {
        layout: "modal",
        width: popupWidth
      });
      return;
    }

    window.open(tallyForm.url, "_blank", "noopener,noreferrer");
  }

  return (
    <button className={className} onClick={openTallyForm} type="button">
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
