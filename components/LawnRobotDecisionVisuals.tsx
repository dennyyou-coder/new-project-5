import Image from "next/image";

const opportunityPlatforms = [
  { id: "RM-01", name: "Mass-Market Vision", className: "is-rm01" },
  { id: "RM-02", name: "RTK Step-Up", className: "is-rm02" },
  { id: "RM-03", name: "AWD Terrain", className: "is-rm03" },
  { id: "RM-04", name: "Proven Value", className: "is-rm04" },
  { id: "RM-05", name: "Large-Area Service", className: "is-rm05" },
  { id: "RM-06", name: "Retail Starter", className: "is-rm06" }
] as const;

const channelRows = [
  { id: "RM-01", name: "Mass-Market Vision", fits: ["Strong fit", "Strong fit", "Conditional fit", "Conditional fit", "—"] },
  { id: "RM-02", name: "RTK Step-Up", fits: ["Conditional fit", "Conditional fit", "Strong fit", "Conditional fit", "Conditional fit"] },
  { id: "RM-03", name: "AWD Terrain", fits: ["Conditional fit", "Conditional fit", "Strong fit", "—", "Conditional fit"] },
  { id: "RM-04", name: "Proven Value", fits: ["Strong fit", "Conditional fit", "Conditional fit", "Strong fit", "—"] },
  { id: "RM-05", name: "Large-Area Service", fits: ["—", "—", "Strong fit", "—", "Strong fit"] },
  { id: "RM-06", name: "Retail Starter", fits: ["Strong fit", "Strong fit", "—", "Strong fit", "—"] }
] as const;

const channels = ["Retail", "Ecommerce", "Specialist dealer", "Private label", "Professional / project sales"] as const;

export function LawnRobotOpportunityLandscape() {
  return (
    <section className="section sourcing-lawn-landscape-section">
      <div className="sourcing-v3-container">
        <p className="sourcing-v3-kicker">Six-Platform Opportunity Landscape</p>
        <div className="sourcing-lawn-visual-heading">
          <h2>Where the Six Product Platforms Compete</h2>
          <p>Different robotic mower platforms create value through different customers, channels and ownership models.</p>
        </div>
        <figure className="sourcing-lawn-landscape">
          <figcaption>
            <span>World Clean Biz editorial assessment</span>
            <small>Directional positioning, not measured market data. Final decisions require target-market and supplier evidence.</small>
          </figcaption>
          <div className="sourcing-lawn-landscape-y"><span>Specialist and professional use</span><span>Broad residential adoption</span></div>
          <div className="sourcing-lawn-landscape-plot" aria-label="Qualitative map of six robotic mower product platforms from accessible entry to premium product and service value, and from broad residential adoption to specialist and professional use">
            {opportunityPlatforms.map((platform) => (
              <div className={`sourcing-lawn-landscape-marker ${platform.className}`} key={platform.id}>
                <strong>{platform.id}</strong><span>{platform.name}</span>
              </div>
            ))}
          </div>
          <div className="sourcing-lawn-landscape-x"><span>Accessible entry</span><span>Premium product and service value</span></div>
          <p className="sr-only">RM-01 and RM-06 focus on broad residential adoption and accessible entry. RM-02 moves toward premium residential value. RM-03 focuses on specialist terrain. RM-04 offers an accessible proven platform. RM-05 focuses on professional large-area use.</p>
        </figure>
      </div>
    </section>
  );
}

export function LawnRobotChannelMatrix() {
  return (
    <section className="section section-muted sourcing-lawn-channel-section">
      <div className="sourcing-v3-container">
        <p className="sourcing-v3-kicker">Platform × Channel Fit</p>
        <div className="sourcing-lawn-visual-heading">
          <h2>Which Channels Fit Each Product Platform?</h2>
          <p>Channel fit depends on setup burden, customer education, service capability and the clarity of the product's reason to buy.</p>
        </div>
        <div className="sourcing-lawn-assessment-legend"><strong>World Clean Biz editorial assessment</strong><span><i className="is-strong" />Strong fit</span><span><i className="is-conditional" />Conditional fit</span><span>— Not a natural primary route</span></div>
        <p className="sourcing-lawn-table-hint">Swipe to compare channels →</p>
        <div className="sourcing-lawn-table-wrap" tabIndex={0} aria-label="Scrollable platform and channel fit comparison">
          <table className="sourcing-lawn-channel-matrix">
            <thead><tr><th scope="col">Product platform</th>{channels.map((channel) => <th scope="col" key={channel}>{channel}</th>)}</tr></thead>
            <tbody>{channelRows.map((row) => <tr key={row.id}><th scope="row"><strong>{row.id}</strong><span>{row.name}</span></th>{row.fits.map((fit, index) => <td className={fit === "Strong fit" ? "is-strong" : fit === "Conditional fit" ? "is-conditional" : ""} key={`${row.id}-${channels[index]}`}><span>{fit}</span></td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function LawnRobotSuccessConditions() {
  const conditions = [
    { number: "01", image: "/images/sourcing/lawn-robots/rm-01-compact-vision.png", alt: "Vision robotic mower representing a clear residential customer use case", title: "A clear customer problem", text: "Installation friction, difficult terrain or large-area labor must give the buyer an obvious reason to switch." },
    { number: "02", image: "/images/sourcing/lawn-robots/rm-03-awd-slope.png", alt: "All-wheel-drive robotic mower representing repeatable difficult-terrain performance", title: "Repeatable field performance", text: "The platform has to work across the edges, slopes, signals and recovery conditions buyers actually face." },
    { number: "03", image: "/images/sourcing/lawn-robots/rm-05-large-area-professional.png", alt: "Professional robotic mower representing serviceable channel economics", title: "Channel economics after the sale", text: "Setup, software, returns, parts and service cannot consume the margin that made the quotation attractive." }
  ];
  return (
    <section className="section sourcing-lawn-success-section">
      <div className="sourcing-v3-container">
        <p className="sourcing-v3-kicker">Opportunity Conditions</p>
        <h2>Three Conditions That Decide Whether the Opportunity Can Scale</h2>
        <div className="sourcing-lawn-success-grid">{conditions.map((condition) => <article key={condition.number}><div className="sourcing-lawn-success-image"><Image src={condition.image} alt={condition.alt} fill sizes="(max-width: 760px) 118px, (max-width: 1200px) 31vw, 360px" /><span>{condition.number}</span></div><h3>{condition.title}</h3><p>{condition.text}</p></article>)}</div>
      </div>
    </section>
  );
}

export function LawnRobotEvidenceFlow() {
  const stages = [
    { number: "01", label: "Opportunity", question: "Is the customer problem valuable?", evidence: ["Reason to switch", "Addressable use case", "Channel relevance"] },
    { number: "02", label: "Platform", question: "Does field performance prove it?", evidence: ["Navigation recovery", "Terrain behavior", "Ownership experience"] },
    { number: "03", label: "Supplier", question: "Can capability survive scale?", evidence: ["Technology ownership", "Test depth", "Software and parts"] },
    { number: "04", label: "Economics", question: "Does margin survive after the sale?", evidence: ["Price and margin", "Returns and service", "Quality and compliance"] }
  ];
  return (
    <section className="section section-muted sourcing-lawn-evidence-section">
      <div className="sourcing-v3-container">
        <p className="sourcing-v3-kicker">Commercial Go / No-Go</p>
        <div className="sourcing-lawn-visual-heading"><h2>Four Decisions Before You Back a Platform</h2><p>Move forward only when the opportunity, product evidence, supplier capability and after-sale economics reinforce one another.</p></div>
        <ol className="sourcing-lawn-evidence-flow">{stages.map((stage) => <li key={stage.number}><span>{stage.number}</span><strong>{stage.label}</strong><h3>{stage.question}</h3><ul>{stage.evidence.map((item) => <li key={item}>{item}</li>)}</ul></li>)}</ol>
      </div>
    </section>
  );
}
