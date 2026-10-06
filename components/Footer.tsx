import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";
export function Footer() {
  return (
    <footer className="footer refresh-footer">
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
            Independent industry perspectives, useful product information and
            business connections.
          </p>
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          <div>
            <strong>Explore</strong>
            <Link href="/news">News</Link>
            <Link href="/blog">Insights</Link>
            <Link href="/brands">Companies &amp; Brands</Link>
            <Link href="/products">Products</Link>
            <Link href="/videos">Videos</Link>
            <Link href="/guides">Practical Guides</Link>
            <Link href="/reports">Reports</Link>
            <Link href="/blog/archive">Article Archive</Link>
          </div>
          <div>
            <strong>Connect</strong>
            <Link href="/wcb-expo">WCB Expo</Link>
            <Link href="/sourcing">Sourcing Services</Link>
            <Link href="/contact">Business Cooperation</Link>
            <Link href="/about">About WCB</Link>
            <a
              href="https://www.youtube.com/@WCBdenny/videos"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube ↗
            </a>
            <TallyButton
              className="footer-link-button"
              ctaLocation="footer_updates"
              form="newsletter"
            >
              Industry Updates
            </TallyButton>
          </div>
          <div>
            <strong>Information</strong>
            <Link href="/quality-compliance">Quality &amp; Compliance</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} World Clean Biz.
      </div>
    </footer>
  );
}
