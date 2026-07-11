"use client";

import { useEffect } from "react";
import { TallyButton } from "@/components/LeadForms";
import { createBlogCtaContext, getBlogCta } from "@/lib/blogConversion";
import { trackLeadEvent, type LeadFormType } from "@/lib/leadTracking";

export function BlogConversionCta({
  category,
  slug,
  location = "article_footer"
}: {
  category: string;
  slug: string;
  location?: string;
}) {
  const cta = getBlogCta(category);
  const context = createBlogCtaContext({ category, slug, location });
  const formType: LeadFormType =
    cta.form === "expo" ? "wce_visitor" : cta.form;
  const baseEvent = {
    form_type: formType,
    source_page: `/blog/${slug}`,
    language: "en",
    ...context
  };

  useEffect(() => {
    trackLeadEvent("cta_view", baseEvent);
  }, [category, location, slug]);

  return (
    <aside
      aria-labelledby="blog-conversion-title"
      className={`blog-conversion-cta blog-conversion-cta-${cta.type}`}
    >
      <div>
        <p className="eyebrow">{cta.eyebrow}</p>
        <h2 id="blog-conversion-title">{cta.title}</h2>
        <p>{cta.description}</p>
      </div>
      <TallyButton
        className="button"
        ctaLocation={location}
        eventContext={context}
        form={cta.form}
        onClickTrack={() => trackLeadEvent("cta_click", baseEvent)}
        reportId={cta.reportId}
      >
        {cta.buttonLabel}
      </TallyButton>
    </aside>
  );
}
