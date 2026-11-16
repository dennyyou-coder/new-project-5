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

      {section.table ? (
        <div className="topic-table-wrap">
          <table className={`topic-table${section.table.layout === "cards" ? " is-cards" : ""}`}>
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

      {section.charts?.length ? (
        <div className={`topic-section-charts${section.charts.length > 1 ? " is-pair" : ""}`}>
          {section.charts.map((chart) => <TopicChart key={chart.title} chart={chart} />)}
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
