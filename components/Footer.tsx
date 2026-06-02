import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>World Clean Biz</strong>
          <p>
            Global Cleaning Industry Intelligence & Sourcing Platform, led by
            Denny You.
          </p>
        </div>
        <div className="nav" aria-label="Footer navigation">
          <Link href="/insights">Insights</Link>
          <Link href="/sourcing">Sourcing</Link>
          <Link href="/world-clean-expo">Expo</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
