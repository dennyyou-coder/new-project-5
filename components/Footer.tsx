import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-heading">
            <span className="footer-brand-logo" aria-hidden="true">
              WCB
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
            <Link href="/blog">Blog</Link>
            <Link href="/blog/archive">Article Archive</Link>
            <Link href="/reports">Market Reports</Link>
            <Link href="/sourcing">Sourcing</Link>
            <Link href="/world-clean-expo">World Clean Expo</Link>
          </div>
          <div>
            <strong>Connect</strong>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <TallyButton className="footer-link-button" form="contact">
              Talk With Denny
            </TallyButton>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} World Clean Biz. Global Cleaning Industry Intelligence.</span>
      </div>
    </footer>
  );
}
