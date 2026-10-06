import Link from "next/link";
import { CONTACT_INQUIRIES } from "@/lib/inquiryConversion";
export function BusinessServices() {
  return (
    <section
      className="refresh-section"
      id="business-cooperation"
      aria-labelledby="business-services-title"
    >
      <div className="container">
        <div className="refresh-section-head">
          <div>
            <p className="eyebrow">Work with WCB</p>
            <h2 id="business-services-title">Business Cooperation</h2>
          </div>
          <Link href="/contact">Discuss your project</Link>
        </div>
        <div className="refresh-business-grid">
          {CONTACT_INQUIRIES.map((item, index) => (
            <Link
              href={`/contact#${item.value}`}
              className="refresh-business-card"
              key={item.value}
            >
              <span className="eyebrow">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="refresh-card-link">{item.buttonLabel}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
