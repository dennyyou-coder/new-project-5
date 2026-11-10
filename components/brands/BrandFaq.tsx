import { Icon } from "@/components/Icon";
import type { BrandProfile } from "@/lib/brands";

/** Plain answers to the questions people search for about the company. The first is open; the rest fold. */
export function BrandFaq({ profile }: { profile: BrandProfile }) {
  if (!profile.faq?.length) return null;
  return (
    <section className="bp-card brand-faq" id="faq" aria-labelledby="faq-title">
      <div className="bp-card-head">
        <h2 id="faq-title"><span className="bp-card-icon"><Icon name="message" /></span>Common questions about {profile.name}</h2>
      </div>
      <div className="bp-faq">
        {profile.faq.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
