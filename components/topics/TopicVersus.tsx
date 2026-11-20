import Link from "next/link";
import type { TopicVersus as TopicVersusData, TopicVersusSide } from "@/lib/topics";

function Side({ side, align }: { side: TopicVersusSide; align: "left" | "right" }) {
  return (
    <div className={`topic-vs-side is-${align}`}>
      <Link className="topic-vs-logo" href={`/brands/${side.slug}`}>
        <img src={`/images/brands/${side.slug}/logo.webp`} alt={side.name} />
      </Link>
      <p className="topic-vs-figure">
        <strong>{side.figure.value}</strong>
        <span>{side.figure.label}</span>
      </p>
      <ul className="topic-vs-facts">
        {side.facts.map((fact) => <li key={fact}>{fact}</li>)}
      </ul>
      {side.brands?.length ? (
        <ul className="topic-vs-brands" aria-label={`${side.name} brands`}>
          {side.brands.map((brand) => (
            <li key={brand.name}>
              {brand.slug ? <img src={`/images/brands/${brand.slug}/logo-tile.webp`} alt={brand.name} loading="lazy" decoding="async" /> : <span>{brand.name}</span>}
            </li>
          ))}
        </ul>
      ) : null}
      {side.person ? (
        <p className="topic-vs-person">
          <img src={side.person.image} alt={side.person.name} width={44} height={44} />
          <span><strong>{side.person.name}</strong><small>{side.person.role}</small></span>
        </p>
      ) : null}
    </div>
  );
}

/** The big picture at the top of a two-company topic. */
export function TopicVersus({ versus }: { versus: TopicVersusData }) {
  const [left, right] = versus.sides;
  return (
    <section className="topic-vs" aria-labelledby="topic-vs-title">
      <div className="topic-container">
        <h2 id="topic-vs-title" className="topic-vs-title">{versus.title}</h2>
        <div className="topic-vs-board">
          <Side side={left} align="left" />
          <ol className="topic-vs-flows">
            {versus.flows.map((flow) => (
              <li key={flow.label} className={flow.tone === "legal" ? "is-legal" : undefined}>
                {flow.image ? <img src={flow.image} alt="" width={40} height={40} /> : null}
                <span className="topic-vs-flow-copy">
                  <strong>{flow.label}</strong>
                  <small>{flow.detail}</small>
                </span>
                <span className="topic-vs-arrow" aria-hidden="true" />
              </li>
            ))}
          </ol>
          <Side side={right} align="right" />
        </div>
        {versus.footer ? <p className="topic-vs-footer">{versus.footer}</p> : null}
        {versus.credit ? <p className="topic-vs-credit">{versus.credit}</p> : null}
      </div>
    </section>
  );
}
