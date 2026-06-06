import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-heading">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-core">W</span>
            </span>
            <div>
              <strong>World Clean Biz</strong>
              <span>Global Cleaning Industry Intelligence</span>
            </div>
          </div>
          <p>
            Industry signals, market intelligence, sourcing opportunities and
            business connections for the global cleaning industry.
          </p>
          <div className="footer-slogan">
            <strong>
              Signals Before Decisions. Better information helps companies make
              better business decisions.
            </strong>
          </div>
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          <div>
            <strong>Platform</strong>
            <Link href="/insights">Insights</Link>
            <Link href="/reports">Market Reports</Link>
            <Link href="/sourcing">Sourcing</Link>
            <Link href="/world-clean-expo">World Clean Expo</Link>
          </div>
          <div>
            <strong>Connect</strong>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact">Submit Inquiry</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} World Clean Biz. Built by Denny You.</span>
      </div>
    </footer>
  );
}
