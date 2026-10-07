import Link from "next/link";
import { CONTACT_INQUIRIES } from "@/lib/inquiryConversion";

export function BusinessServiceIcon({ value }: { value: string }) {
  return (
    <span className="business-service-icon" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        {value === "sourcing" ? <>
          <path className="wash" d="M12 22 32 11l20 11v23L32 56 12 45z" />
          <path d="m12 22 20 11 20-11M32 33v23M12 22 32 11l20 11v23L32 56 12 45V22Z" />
          <path d="m22 16 20 11v10" />
        </> : value === "general" ? <>
          <path className="wash" d="M25 24h14v16H25z" />
          <path d="M32 23V13M24 37l-9 7m25-7 9 7" />
          <circle cx="32" cy="9" r="6" /><circle cx="10" cy="48" r="6" /><circle cx="54" cy="48" r="6" />
          <rect x="23" y="23" width="18" height="18" rx="5" />
        </> : value === "expo" ? <>
          <path className="wash" d="M12 12h40v12H12zM17 36h15v18H17z" />
          <path d="M8 55h48M12 24v31m40-31v31M12 12h40v12H12zM20 12V7m24 5V7M18 36h14v19m7-19h7m-7 8h7" />
        </> : <>
          <rect className="wash" x="9" y="14" width="38" height="36" rx="7" />
          <rect x="9" y="14" width="38" height="36" rx="7" />
          <path d="m47 27 9-7v24l-9-7" />
          <path className="play" d="m24 24 12 8-12 8z" />
        </>}
      </svg>
    </span>
  );
}

const servicePhotos: Record<string, { src: string; alt: string }> = {
  sourcing: { src: "/images/site-refresh/about/about-product-supplier-work.webp", alt: "Cleaning industry component samples" },
  general: { src: "/images/site-refresh/about/about-expo-connections.webp", alt: "Industry professionals exchanging contacts" },
  expo: { src: "/images/industry/expo-hall-shenzhen-2026.jpg", alt: "Visitors at a previous cleaning industry exhibition" },
  media: { src: "/images/site-refresh/about/about-industry-analysis.webp", alt: "A cleaning industry presentation" },
};

export function BusinessServices() {
  return (
    <section className="glacier-business" id="business-cooperation" aria-labelledby="business-services-title">
      <div className="container glacier-business-inner">
        <div className="glacier-business-intro">
          <p className="eyebrow">Work with WCB</p>
          <h2 id="business-services-title">Business Cooperation</h2>
          <Link className="button" href="/contact">Discuss your project</Link>
        </div>
        <div className="glacier-services-grid">
          {CONTACT_INQUIRIES.map((item) => (
            <article className="glacier-service" key={item.value}>
              <img src={servicePhotos[item.value].src} alt={servicePhotos[item.value].alt} width={208} height={152} loading="lazy" decoding="async" />
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
