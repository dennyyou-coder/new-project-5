import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <div className="grid-2">
            <div>
              <p className="eyebrow">404</p>
              <h1>Page Not Found</h1>
              <p>
                The signal you are looking for may have moved, expired or never
                existed.
              </p>
              <p>
                Read the latest cleaning industry articles or share your
                question with World Clean Biz.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/blog">
                Blog
              </Link>
              <Link className="button-secondary" href="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
