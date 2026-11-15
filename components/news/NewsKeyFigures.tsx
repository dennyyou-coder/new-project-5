import { LogoTileImage } from "@/components/ui/LogoTileImage";
import type { NewsKeyFigure } from "@/lib/news";

/** Key figures card on a news article. Values come from the article body. */
export function NewsKeyFigures({ figures, usdRate }: { figures: NewsKeyFigure[]; usdRate?: string }) {
  if (!figures.length) return null;
  const hasUsd = figures.some((figure) => figure.usd);
  return (
    <section className="news-key-figures" aria-labelledby="news-key-figures-title">
      <div className="news-key-figures-head">
        <h2 id="news-key-figures-title">Key figures</h2>
        <span>{hasUsd && usdRate ? `As reported · USD at ${usdRate}` : "As reported in the source"}</span>
      </div>
      <dl>
        {figures.map((figure) => (
          <div key={`${figure.label}-${figure.period ?? ""}`}>
            <dt>
              {figure.label}
              {figure.period ? <span>{figure.period}</span> : null}
            </dt>
            <dd>
              <strong>{figure.value}</strong>
              {figure.usd || figure.change ? (
                <span>
                  {figure.usd ? `≈ ${figure.usd}` : null}
                  {figure.usd && figure.change ? " · " : null}
                  {figure.change ?? null}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The number to lead with: a short change such as "+21.2% YoY" when there is one, otherwise the value. */
export function keyFigureHeadline(figure: NewsKeyFigure) {
  const change = figure.change?.trim();
  return change && change.length <= 12 && /^[+\-−–]?\d/.test(change) ? change : figure.value;
}

/** Key-figure picture used in place of a borrowed thumbnail in lists. The lead row shows up to two figures. */
export function NewsKeyFigureThumb({ company, logo, logoSlug, figures, lead = false }: { company?: string; logo?: string; logoSlug?: string; figures: NewsKeyFigure[]; lead?: boolean }) {
  const shown = figures.slice(0, lead ? 2 : 1);
  const period = shown[0]?.period;
  return (
    <span className={`news-key-thumb${shown.length > 1 ? " news-key-thumb--pair" : ""}`} aria-hidden="true">
      {logo && logoSlug ? (
        <span className="news-key-thumb-logo"><LogoTileImage slug={logoSlug} fallbackSrc={logo} boxRatio={2.13} /></span>
      ) : company ? <span className="news-key-thumb-company">{company}</span> : null}
      <span className="news-key-thumb-figures">
        {shown.map((figure) => {
          const headline = keyFigureHeadline(figure);
          return (
            <span className="news-key-thumb-figure" key={figure.label}>
              <span className={`news-key-thumb-value${headline.length > 10 ? " is-long" : ""}`}>{headline}</span>
              <span className="news-key-thumb-label">{figure.label}</span>
            </span>
          );
        })}
      </span>
      {period ? <span className="news-key-thumb-period">{period}</span> : null}
    </span>
  );
}
