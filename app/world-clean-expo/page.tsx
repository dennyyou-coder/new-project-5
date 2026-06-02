import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "World Clean Expo",
  description:
    "World Clean Expo interest page for exhibitors, buyers, sponsors, and partners in the global cleaning industry."
};

const expoItems = [
  "About World Clean Expo",
  "Why Exhibit",
  "Buyer & Visitor Profile",
  "Product Categories",
  "Sponsorship Opportunities",
  "Exhibitor Interest",
  "Visitor / Buyer Interest"
];

const audiences = [
  "Cleaning equipment brands and manufacturers",
  "Distributors, importers, and professional buyers",
  "Technology and component suppliers",
  "Media, associations, and industry partners"
];

export default function WorldCleanExpoPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">World Clean Expo</p>
          <h1>A future exhibition entry for the global cleaning industry</h1>
          <p>
            Early-stage interest page for brands, suppliers, buyers,
            distributors, sponsors, and industry partners.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Expo focus</h2>
            <p>
              World Clean Expo starts as a focused business and content entry
              inside World Clean Biz. It can become an independent exhibition
              website when the event plan is ready.
            </p>
            <div className="tag-list">
              {expoItems.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="highlight-panel">
            <div className="module-kicker">Early interest</div>
            <h3>Register early interest</h3>
            <p>
              Use the contact form for exhibitor interest, visitor and buyer
              interest, sponsorship, media, or cooperation.
            </p>
            <p>
              <Link className="button" href="/contact">
                Contact World Clean Expo
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Audience</p>
              <h2>Who World Clean Expo is designed to connect</h2>
            </div>
          </div>
          <div className="grid-2">
            {audiences.map((item) => (
              <div className="card" key={item}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
