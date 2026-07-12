"use client";

import { useState } from "react";
import { TallyButton } from "@/components/LeadForms";
import type { ProductDirection } from "@/lib/sourcingProducts";

export function LawnRobotProductSelector({ products }: { products: ProductDirection[] }) {
  const [selectedId, setSelectedId] = useState<ProductDirection["id"]>(products[0].id);
  const selected = products.find((product) => product.id === selectedId) || products[0];

  return (
    <section className="section sourcing-selector-section">
      <div className="sourcing-v3-container">
        <p className="sourcing-v3-kicker">Selected Product Directions</p>
        <h2>Explore product platforms worth sourcing.</h2>
        <p className="sourcing-selector-disclaimer">Concept product directions — final models depend on supplier verification.</p>
        <div className="sourcing-selector">
          <div className="sourcing-selector-image"><img src={selected.image} alt={selected.imageAlt} /><span>{selected.id}</span></div>
          <div className="sourcing-selector-copy">
            <p className="sourcing-selector-id">{selected.id} · {selected.technologyDirection}</p>
            <h3>{selected.name}</h3>
            <p className="sourcing-selector-positioning">{selected.positioning}</p>
            <div className="sourcing-selector-tags"><span>{selected.lawnContext}</span>{selected.markets.map((item) => <span key={item}>{item}</span>)}{selected.channels.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="sourcing-selector-facts"><div><strong>Why it is interesting</strong><p>{selected.opportunity}</p></div><div><strong>What buyers must verify</strong><p>{selected.verificationRisk}</p></div></div>
            <TallyButton className="sourcing-v3-button" form="sourcing" conversionGroup="sourcing" ctaLocation="lawn_robot_product_selector" inquiryIntent="product_sourcing" productCategory="robotic_lawn_mower" productId={selected.id}>Source This Product · {selected.id}</TallyButton>
          </div>
          <div className="sourcing-selector-thumbnails" aria-label="Choose a lawn robot product direction">
            {products.map((product) => <button key={product.id} type="button" aria-pressed={product.id === selected.id} onClick={() => setSelectedId(product.id)}><img src={product.image} alt="" /><strong>{product.id}</strong><span>{product.name}</span></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}
