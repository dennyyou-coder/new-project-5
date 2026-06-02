import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "About World Clean Biz and Denny You, connecting global cleaning industry intelligence, sourcing, and business opportunities."
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1>About World Clean Biz and Denny You</h1>
          <p>
            World Clean Biz connects industry intelligence, China supply chain
            understanding, sourcing resources, and global cleaning business
            opportunities.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div className="card">
            <h3>About World Clean Biz</h3>
            <p>
              World Clean Biz is a global cleaning industry intelligence and
              sourcing platform. It publishes market insights, sourcing
              resources, product category analysis, and exhibition observations
              for B2B professionals.
            </p>
          </div>
          <div className="card">
            <h3>About Denny You</h3>
            <p>
              Denny You works with cleaning industry information, supplier
              resources, buyer demand, and market opportunities, helping
              overseas companies understand and connect with the cleaning
              industry.
            </p>
          </div>
          <div className="card">
            <h3>Who We Serve</h3>
            <p>
              Buyers, brands, distributors, suppliers, sourcing teams, market
              researchers, exhibition teams, and cleaning industry partners.
            </p>
          </div>
          <div className="card">
            <h3>Why Trust Us</h3>
            <p>
              The platform is built from long-term category tracking, trade
              show observation, supply chain knowledge, and practical B2B
              business experience.
            </p>
          </div>
        </div>
        <div className="container" style={{ marginTop: 24 }}>
          <Link className="button" href="/contact">
            Contact Denny You
          </Link>
        </div>
      </section>
    </>
  );
}
