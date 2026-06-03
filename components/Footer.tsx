import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>World Clean Biz</strong>
          <p>
            A trusted home for global cleaning industry professionals to find
            market signals, sourcing context, trade show intelligence and
            business opportunities.
          </p>
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          <div>
            <strong>Platform</strong>
            <Link href="/insights">Signals</Link>
            <Link href="/market-reports">Market Reports</Link>
            <Link href="/about">About</Link>
          </div>
          <div>
            <strong>Business</strong>
            <Link href="/sourcing">Sourcing</Link>
            <Link href="/world-clean-expo">World Clean Expo</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} World Clean Biz. All rights reserved.</span>
        <span>Built for global cleaning industry professionals.</span>
      </div>
    </footer>
  );
}
