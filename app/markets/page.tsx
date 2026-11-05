import type { Metadata } from "next";
import Link from "next/link";
import "../styles/markets.css";
import { TallyButton } from "@/components/LeadForms";
import { getMarketsData } from "@/lib/markets";
import { newsDate } from "@/lib/news";
import { buildWebsiteMetadata } from "@/lib/seo";

const siteUrl = "https://worldcleanbiz.com";

export const metadata: Metadata = buildWebsiteMetadata({
  title: "Markets: Company Results in the Cleaning Industry | World Clean Biz",
  description:
    "Results from listed companies that make cleaning, pool, lawn and tool products, with the latest reported revenue, growth and what moved, linked to World Clean Biz news.",
  canonical: "/markets"
});

export default function MarketsPage() {
  const { results, deals, coverage } = getMarketsData();
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
          name: row.news.title,
          url: `${siteUrl}/news/${row.news.slug}`
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
              Figures in the reported currency, as reported by each company, with an approximate US dollar value at the Federal Reserve H.10 rate on the day the story was published. Growth is year on year unless the row says otherwise. Each row links to the news story with the source and rate.
            </p>
            <div className="markets-table-wrap" tabIndex={0} role="region" aria-labelledby="markets-results-title">
              <table className="markets-table">
                <thead>
                  <tr>
                    <th scope="col">Company</th>
                    <th scope="col">Category</th>
                    <th scope="col">Period</th>
                    <th scope="col">Revenue</th>
                    <th scope="col">≈ USD</th>
                    <th scope="col">Growth</th>
                    <th scope="col">Summary</th>
                    <th scope="col">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.news.slug}>
                      <th scope="row">
                        <Link href={`/news/${row.news.slug}`}>{row.companyName}</Link>
                      </th>
                      <td>{row.hub?.name ?? "—"}</td>
                      <td>{row.figure?.period ?? "—"}</td>
                      <td className="markets-num">{row.figure?.value ?? "—"}</td>
                      <td className="markets-num">{row.figure?.usd ?? "—"}</td>
                      <td className="markets-num">{row.figure?.change ?? "—"}</td>
                      <td className="markets-summary">{row.news.excerpt}</td>
                      <td>
                        <time dateTime={row.news.eventDate}>{newsDate(row.news.eventDate)}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {coverage.length > 0 ? (
          <section aria-labelledby="markets-coverage-title">
            <h2 id="markets-coverage-title">Earnings coverage</h2>
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
