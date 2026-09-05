"use client";

import { TallyButton } from "@/components/LeadForms";
import { createBlogCtaContext, getBlogCta } from "@/lib/blogConversion";

export function BlogConversionCta({
  category,
  slug,
  guideType,
  location = "article_footer"
}: {
  category: string;
  slug: string;
  guideType?: string;
  location?: string;
}) {
  const cta = getBlogCta(category, guideType);
  const context = createBlogCtaContext({ category, slug, location, guideType });
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
        inquiryIntent={cta.inquiryIntent}
        reportId={cta.reportId}
      >
        {cta.buttonLabel}
      </TallyButton>
    </aside>
  );
}
