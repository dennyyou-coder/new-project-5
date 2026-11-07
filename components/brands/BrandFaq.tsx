import { Icon } from "@/components/Icon";
import type { BrandProfile } from "@/lib/brands";

/** Plain answers to the questions people search for about the company. */
export function BrandFaq({ profile }: { profile: BrandProfile }) {
  if (!profile.faq?.length) return null;
  return (
    <section className="bp-card brand-faq" id="faq" aria-labelledby="faq-title">
      <div className="bp-card-head">
        <h2 id="faq-title"><span className="bp-card-icon"><Icon name="message" /></span>Common questions about {profile.name}</h2>
      </div>
      <dl className="bp-faq">
        {profile.faq.map((item) => (
          <div key={item.question}>
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
