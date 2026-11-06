import type { Metadata } from "next";
import Link from "next/link";
import "../styles/markets.css";
import { TallyButton } from "@/components/LeadForms";
import { getMarketsData, hubForCompany } from "@/lib/markets";
import { formatAmount, latestResults, profitChange, revenueChange } from "@/lib/financials";
import { getHubCategory } from "@/lib/hubCategories";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { getInsights } from "@/lib/content";
import { figureDirection } from "@/lib/brandMarks";
import { newsDate } from "@/lib/news";
import { buildWebsiteMetadata } from "@/lib/seo";
import { LogoTileImage } from "@/components/ui/LogoTileImage";

const siteUrl = "https://worldcleanbiz.com";

export const metadata: Metadata = buildWebsiteMetadata({
  title: "Markets: Company Results in the Cleaning Industry | World Clean Biz",
  description:
    "Results from listed companies that make cleaning, pool, lawn and tool products, with the latest reported revenue, growth and what moved, linked to World Clean Biz news.",
  canonical: "/markets"
});

export default function MarketsPage() {
  const { deals, coverage } = getMarketsData();
  // The results table reads the financials tracker: one row per company, its latest reported period.
  const brands = new Map(getPublishedBrandProfiles(getInsights()).map((brand) => [brand.slug, brand]));
  const results = latestResults().map((result) => {
    const hubSlug = result.hub ?? hubForCompany(result.brand);
    return { result, company: brands.get(result.brand), hub: hubSlug ? getHubCategory(hubSlug) : undefined };
  });
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteUrl}/markets`,
      name: "Markets",
      url: `${siteUrl}/markets`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: results.map((row, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${row.result.name} ${row.result.period} results`,
          url: row.result.news ? `${siteUrl}/news/${row.result.news}` : row.result.source.url
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Markets", item: `${siteUrl}/markets` }
      ]
    }
  ];

  return (
    <div className="markets-page">
      <section className="markets-hero">
        <div className="markets-container">
          <nav className="markets-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span aria-current="page">Markets</span>
          </nav>
          <h1>Markets</h1>
          <p>Results from the listed companies that make cleaning, pool, lawn and tool products, and what each report says.</p>
        </div>
      </section>

      <div className="markets-container markets-body">
        {results.length > 0 ? (
          <section aria-labelledby="markets-results-title">
            <h2 id="markets-results-title">Latest results</h2>
            <p className="markets-note">
              The latest reported period for each company, in the currency it reports in. Growth is year on year: worked out from the two amounts in the release, or as the company states it (for example organic or at constant exchange rates). Each row links to the company&apos;s own release.
            </p>
            <div className="markets-table-wrap" tabIndex={0} role="region" aria-labelledby="markets-results-title">
              <table className="markets-table">
                <thead>
                  <tr>
                    <th scope="col">Company</th>
                    <th scope="col">Category</th>
                    <th scope="col">Period</th>
                    <th scope="col">Revenue</th>
                    <th scope="col">Growth</th>
                    <th scope="col">Profit</th>
                    <th scope="col">Change</th>
                    <th scope="col">Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(({ result, company, hub }) => {
                    const growth = revenueChange(result);
                    const profitMove = profitChange(result);
                    return (
                      <tr key={result.company}>
                        <th scope="row">
                          <Link className="markets-company" href={company ? `/brands/${company.slug}` : result.source.url}>
                            {company?.logoImage ? (
                              <span className="markets-company-logo" aria-hidden="true">
                                <LogoTileImage slug={company.slug} fallbackSrc={company.logoImage} boxRatio={1.73} />
                              </span>
                            ) : null}
                            <span>{result.name}</span>
                          </Link>
                        </th>
                        <td>{hub?.name ?? "—"}</td>
                        <td>{result.period}</td>
                        <td className="markets-num"><small>{result.revenueLabel}</small>{formatAmount(result.revenue, result.currency)}</td>
                        <td className="markets-num">
                          {growth ? <span className={`figure-chip figure-chip--${figureDirection(growth)}`}>{growth}</span> : "—"}
                        </td>
                        <td className="markets-num">
                          {result.profit !== undefined && result.profitLabel ? (<><small>{result.profitLabel}</small>{formatAmount(result.profit, result.currency, result.approximate)}</>) : "—"}
                        </td>
                        <td className="markets-num">
                          {profitMove ? <span className={`figure-chip figure-chip--${figureDirection(profitMove)}`}>{profitMove}</span> : "—"}
                        </td>
                        <td className="markets-report">
                          {result.reported ? <time dateTime={result.reported}>{newsDate(result.reported)}</time> : null}
                          <a href={result.source.url} target="_blank" rel="noopener noreferrer">Company release</a>
                          {result.news ? <Link href={`/news/${result.news}`}>Our story</Link> : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {coverage.length > 0 ? (
          <section aria-labelledby="markets-coverage-title">
            <h2 id="markets-coverage-title">Results stories</h2>
            <ul className="markets-list">
              {coverage.map((article) => (
                <li key={article.slug}>
                  <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  <span>{newsDate(article.eventDate)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {deals.length > 0 ? (
          <section aria-labelledby="markets-deals-title">
            <h2 id="markets-deals-title">Deals and ownership changes</h2>
            <ul className="markets-list">
              {deals.map((article) => (
                <li key={article.slug}>
                  <Link href={`/news/${article.slug}`}>{article.title}</Link>
                  <span>{article.category} · {newsDate(article.eventDate)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="markets-subscribe" aria-labelledby="markets-subscribe-title">
          <div>
            <h2 id="markets-subscribe-title">Company results by email</h2>
            <p>Industry updates from World Clean Biz.</p>
          </div>
          <TallyButton className="markets-subscribe-button" ctaLocation="markets_subscribe" form="newsletter">
            Subscribe
          </TallyButton>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
    </div>
  );
}
