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

/** Compact first figure, used in place of a borrowed thumbnail in lists. */
export function NewsKeyFigureThumb({ company, figure }: { company?: string; figure: NewsKeyFigure }) {
  return (
    <span className="news-key-thumb" aria-hidden="true">
      <span className="news-key-thumb-label">{[company, figure.period].filter(Boolean).join(" · ") || figure.label}</span>
      <span className="news-key-thumb-value">{figure.change ?? figure.value}</span>
      <span className="news-key-thumb-label">{figure.change ? figure.label : ""}</span>
    </span>
  );
}
