"use client";

import { TallyButton } from "@/components/LeadForms";
import { createBlogCtaContext, getBlogCta } from "@/lib/blogConversion";

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
        reportId={cta.reportId}
      >
        {cta.buttonLabel}
      </TallyButton>
    </aside>
  );
}
