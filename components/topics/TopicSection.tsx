import Link from "next/link";
import type { TopicSection as TopicSectionData } from "@/lib/topics";
import { TopicChart } from "@/components/topics/TopicChart";

function SmartLink({ href, children }: { href: string; children: React.ReactNode }) {
  return href.startsWith("/") ? (
    <Link href={href}>{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  );
}

/** An extra topic section: case box, table, charts side by side, links. */
export function TopicSection({ section }: { section: TopicSectionData }) {
  const headingId = `topic-${section.id}`;
  return (
    <section className={`topic-section${section.highlight ? " is-highlight" : ""}`} aria-labelledby={headingId} id={section.id}>
      <h2 id={headingId}>{section.title}</h2>
      {section.intro ? <p>{section.intro}</p> : null}

      {section.stats?.length ? (
        <dl className="topic-stats">
          {section.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {section.people?.length ? (
        <figure className="topic-people">
          <ul>
            {section.people.map((person) => (
              <li key={person.name}>
                <img src={person.image} alt={person.name} width={72} height={72} loading="lazy" decoding="async" />
                <span>
                  {person.side ? <em>{person.side}</em> : null}
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                </span>
              </li>
            ))}
          </ul>
          <figcaption>Photos: {[...new Set(section.people.map((person) => person.credit))].join("; ")}.</figcaption>
        </figure>
      ) : null}

      {section.progress?.length ? (
        <div className="topic-progress">
          {section.progress.map((track) => (
            <div key={track.label} className="topic-progress-track">
              <p className="topic-progress-label">{track.label}{track.note ? <small>{track.note}</small> : null}</p>
              <ol>
                {track.steps.map((step) => (
                  <li key={`${step.date}-${step.label}`} className={`is-${step.state}`} aria-current={step.state === "now" ? "step" : undefined}>
                    <span className="topic-progress-dot" aria-hidden="true" />
                    <time>{step.date}</time>
                    <strong>{step.label}</strong>
                    {step.state === "now" ? <em>Now</em> : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ) : null}

      {section.facts?.length ? (
        <dl className="topic-section-facts">
          {section.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {section.charts?.length ? (
        <div className={`topic-section-charts${section.charts.length > 1 ? " is-pair" : ""}`}>
          {section.charts.map((chart) => <TopicChart key={chart.title} chart={chart} />)}
        </div>
      ) : null}

      {section.camps?.length ? (
        <div className="topic-camps">
          {section.camps.map((camp) => (
            <div key={camp.label} className={`topic-camp${camp.tone ? ` is-${camp.tone}` : ""}`}>
              <p className="topic-camp-label">{camp.label}{camp.note ? <small>{camp.note}</small> : null}</p>
              <ul>
                {camp.brands.map((brand) => {
                  const inner = (
                    <>
                      <span className="topic-camp-logo">
                        {brand.slug ? <img src={`/images/brands/${brand.slug}/logo-tile.webp`} alt="" loading="lazy" decoding="async" /> : null}
                      </span>
                      <span className="topic-camp-text">
                        <strong>{brand.name}</strong>
                        {brand.tag ? <em>{brand.tag}</em> : null}
                        <small><b>Made in</b> {brand.made}</small>
                      </span>
                    </>
                  );
                  return (
                    <li key={brand.name}>
                      {brand.slug ? <Link href={`/brands/${brand.slug}`}>{inner}</Link> : <div>{inner}</div>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {section.lineup?.length ? (
        <div className="topic-lineup">
          {section.lineup.map((side) => (
            <div key={side.slug} className="topic-lineup-side">
              <Link className="topic-lineup-parent" href={`/brands/${side.slug}`}>
                <img src={`/images/brands/${side.slug}/logo.webp`} alt={side.name} loading="lazy" decoding="async" />
              </Link>
              <ul>
                {side.brands.map((brand) => (
                  <li key={brand.name}>
                    {brand.slug ? (
                      <Link href={`/brands/${brand.slug}`} title={brand.name}>
                        <img src={`/images/brands/${brand.slug}/logo-tile.webp`} alt={brand.name} loading="lazy" decoding="async" />
                      </Link>
                    ) : (
                      <span>{brand.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {section.table ? (
        <div className="topic-table-wrap">
          <table className={`topic-table${section.table.layout === "cards" ? " is-cards" : ""}${section.table.numbered ? " is-numbered" : ""}`}>
            <thead>
              <tr>
                {section.table.columns.map((column) => <th key={column} scope="col">{column}</th>)}
                {section.table.rows.some((row) => row.href) ? <th scope="col"><span className="sr-only">Source</span></th> : null}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.cells.join("|")}>
                  {row.cells.map((cell, index) => (
                    <td key={index} data-label={section.table!.columns[index]}>{cell}</td>
                  ))}
                  {section.table!.rows.some((item) => item.href) ? (
                    <td className="topic-table-link">{row.href ? <SmartLink href={row.href}>{row.href.startsWith("/") ? "Read" : "Source"}</SmartLink> : null}</td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          {section.table.note ? <p className="topic-chart-note">{section.table.note}</p> : null}
        </div>
      ) : null}


      {section.links?.length ? (
        <ul className="topic-section-links">
          {section.links.map((link) => (
            <li key={link.href}><SmartLink href={link.href}>{link.title}</SmartLink></li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
