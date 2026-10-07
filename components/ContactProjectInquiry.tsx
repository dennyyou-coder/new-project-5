"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TallyInlineEmbed } from "@/components/LeadForms";
import { CONTACT_INQUIRIES } from "@/lib/inquiryConversion";
import type { TallyFormKey } from "@/lib/tallyForms";

const photos: Record<string, { src: string; alt: string }> = {
  sourcing: { src: "/images/site-refresh/about/about-product-supplier-work.webp", alt: "Cleaning-industry cable and component samples on display" },
  general: { src: "/images/site-refresh/about/about-expo-connections.webp", alt: "Industry participants meeting at a cleaning event" },
  expo: { src: "/images/industry/expo-hall-shenzhen-2026.jpg", alt: "Cleaning industry exhibition booths and visitor discussions" },
  media: { src: "/images/site-refresh/about/about-industry-analysis.webp", alt: "Cleaning-industry presentation on stage" },
};

const inquiryOptions = [
  { value: "sourcing", label: "Sourcing & Supply Chain", form: "sourcing", ctaLocation: "contact_sourcing", intent: "" },
  { value: "general", label: "Channel Partnerships", form: "contact", ctaLocation: "contact_general", intent: "" },
  { value: "expo", label: "Exhibition Partnerships", form: "expo", ctaLocation: "contact_expo", intent: "" },
  { value: "expo_visitor", label: "WCB Expo · Visitor enquiry", form: "wceVisitor", ctaLocation: "contact_expo_visitor", intent: "visitor_interest" },
  { value: "expo_exhibitor", label: "WCB Expo · Exhibitor enquiry", form: "wceExhibitor", ctaLocation: "contact_expo_exhibitor", intent: "exhibitor_interest" },
  { value: "media", label: "Content & Brand Communication", form: "contact", ctaLocation: "contact_media", intent: "" },
] satisfies { value: string; label: string; form: TallyFormKey; ctaLocation: string; intent: string }[];

export function ContactProjectInquiry({ initialInquiry = "" }: { initialInquiry?: string }) {
  const validInitial = inquiryOptions.some((item) => item.value === initialInquiry) ? initialInquiry : "";
  const [inquiry, setInquiry] = useState(validInitial);
  useEffect(() => { setInquiry(validInitial); }, [validInitial]);
  const selected = inquiryOptions.find((item) => item.value === inquiry);
  const area = inquiry.startsWith("expo") ? "expo" : inquiry;

  return <>
    <section className="contact-choices" id="inquiry-form" aria-labelledby="contact-cooperation-title">
      <div className="container">
        <div className="section-head"><div><p className="eyebrow">Inquiry Types</p><h2 id="contact-cooperation-title">Business Cooperation</h2><p>Four ways to work with WCB.</p></div></div>
        <div className="cooperation-grid" role="radiogroup" aria-label="Choose a cooperation area">
          {CONTACT_INQUIRIES.map((item, index) => <label className="cooperation-card" id={item.value} key={item.value}>
            <input type="radio" name="business-area" value={item.value} checked={area === item.value} onChange={() => setInquiry(area === item.value ? inquiry : item.value)} />
            <span className="cooperation-image"><img src={photos[item.value].src} alt={photos[item.value].alt} loading="lazy" width={1400} height={1050} /></span>
            <span className="cooperation-copy"><span className="cooperation-number">0{index + 1}</span><strong>{item.title}</strong><span className="cooperation-description">{item.description}</span><span className="cooperation-action">{item.buttonLabel}</span></span>
          </label>)}
        </div>
        <div className="contact-resource-links"><Link className="text-link" href="/sourcing">Explore sourcing services</Link><Link className="text-link" href="/wcb-expo">View WCB Expo information</Link></div>
      </div>
    </section>
    <section className="project-section" id="project-form" aria-labelledby="project-title">
      <div className="container project-layout">
        <div className="project-intro"><p className="eyebrow">Your project</p><h2 id="project-title">Discuss your project</h2><p>Choose a cooperation area and tell us about your company, market and project.</p><p className="project-choice-note">Choose your business type before completing the form. Changing it opens the corresponding form and clears any unfinished answers.</p></div>
        <div className="project-form-panel">
          <label className="project-type-select" htmlFor="project-business-type">Business type
            <select id="project-business-type" value={inquiry} onChange={(event) => setInquiry(event.target.value)}>
              <option value="">Choose a business type</option>
              {inquiryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          {selected && <p className="inquiry-context" role="status">{selected.label}</p>}
          <TallyInlineEmbed key={inquiry || "contact"} className="project-tally-frame" ctaLocation={selected?.ctaLocation || "contact_general"} form={selected?.form || "contact"} sourcePage="/contact" inquiryType={selected?.value || "general"} inquiryIntent={selected?.intent} title={selected ? `${selected.label} — World Clean Biz inquiry form` : "World Clean Biz business inquiry form"} />
        </div>
      </div>
    </section>
  </>;
}
