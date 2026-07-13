"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { InlineIcon } from "@/components/Icon";
import type { SourcingCategory } from "@/lib/inquiryConversion";
import { createLeadAttribution, trackLeadEvent } from "@/lib/leadTracking";

function getAttribution(item: SourcingCategory) {
  return createLeadAttribution({
    formType: "sourcing",
    sourcePage: window.location.pathname,
    ctaLocation: item.ctaLocation,
    language: document.documentElement.lang || "en",
    search: window.location.search,
    productCategory: item.value,
    inquiryIntent: "category_exploration"
  });
}

export function SourcingOpportunityCard({
  item
}: {
  item: SourcingCategory;
}) {
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const viewedRef = useRef(false);

  useEffect(() => {
    const element = triggerRef.current;
    if (!element || viewedRef.current) return;

    const sendView = () => {
      if (viewedRef.current) return;
      viewedRef.current = true;
      trackLeadEvent("cta_view", getAttribution(item));
    };

    if (!("IntersectionObserver" in window)) {
      sendView();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          sendView();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [item]);

  return (
    <Link
      ref={triggerRef}
      className="sourcing-opportunity-category-card"
      href={item.href}
      onClick={() => trackLeadEvent("cta_click", getAttribution(item))}
    >
      <span className="sourcing-opportunity-category-image">
        <img src={item.image} alt={`${item.title} opportunity area`} />
      </span>
      <span className="sourcing-opportunity-category-copy">
        <span>
          <InlineIcon name={item.icon} />
          <strong>{item.title}</strong>
        </span>
        <em>{item.description}</em>
        <span className="sourcing-opportunity-category-cta">
          Explore This Opportunity
        </span>
      </span>
    </Link>
  );
}
