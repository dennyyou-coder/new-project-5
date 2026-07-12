"use client";

import { useState } from "react";
import { TallyButton } from "@/components/LeadForms";
import type { ProductDirection } from "@/lib/sourcingProducts";

export function LawnRobotProductSelector({ products }: { products: ProductDirection[] }) {
  const [selectedId, setSelectedId] = useState<ProductDirection["id"]>(products[0].id);
  const selected = products.find((product) => product.id === selectedId) || products[0];
  const selectedIndex = products.findIndex((product) => product.id === selected.id);

  return (
    <section className="section sourcing-selector-section" id="product-options">
      <div className="sourcing-v3-container">
        <p className="sourcing-v3-kicker">Compare the Opportunity</p>
        <h2>Six Product Platforms. Six Different Market Opportunities.</h2>
        <p className="sourcing-selector-disclaimer">Each direction targets a different customer, channel and reason to buy. The images are illustrative; final supplier models and claims require verification.</p>
        <div className="sourcing-selector">
          <div className="sourcing-selector-image"><img src={selected.image} alt={selected.imageAlt} /><span>{selected.id}</span></div>
          <div className="sourcing-selector-copy">
            <p className="sourcing-selector-count">Product {selectedIndex + 1} of {products.length}</p>
            <p className="sourcing-selector-id">{selected.id} · {selected.technologyDirection}</p>
            <h3>{selected.name}</h3>
            <p className="sourcing-selector-positioning"><strong>Market opportunity</strong><br />{selected.positioning}</p>
            <div className="sourcing-selector-tags"><span>{selected.lawnContext}</span>{selected.markets.map((item) => <span key={item}>{item}</span>)}{selected.channels.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="sourcing-selector-actions">
              <TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_product_selector" inquiryIntent="product_sourcing" productCategory="robotic_lawn_mower" productId={selected.id}>Request Suppliers for {selected.id}</TallyButton>
              <TallyButton className="sourcing-selector-secondary" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_selector_custom_brief" inquiryIntent="product_sourcing" productCategory="robotic_lawn_mower">Use My Own Product Brief</TallyButton>
            </div>
            <div className="sourcing-selector-facts"><div><strong>Why it can win</strong><p>{selected.opportunity}</p></div><div><strong>Critical proof points</strong><p>{selected.verificationRisk}</p></div></div>
          </div>
          <div className="sourcing-selector-thumbnails" aria-label="Choose a lawn robot product direction">
            {products.map((product) => <button key={product.id} type="button" aria-pressed={product.id === selected.id} onClick={() => setSelectedId(product.id)}><img src={product.image} alt="" /><strong>{product.id}</strong><span>{product.name}</span></button>)}
          </div>
          <p className="sourcing-selector-swipe-hint">Swipe to compare more product directions →</p>
        </div>
      </div>
    </section>
  );
}
