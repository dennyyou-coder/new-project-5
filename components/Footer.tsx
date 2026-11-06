import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";

export function Footer() {
  return (
    <footer className="wcb-footer">
      <div className="wcb-footer-inner">
        <div className="wcb-footer-brand">
          <p className="wcb-footer-name">
            <span className="wcb-header-logo" aria-hidden="true">WCB</span>
            World Clean Biz
          </p>
          <p>The platform for global cleaning industry professionals: news, companies, products and supply chains.</p>
        </div>
        <nav className="wcb-footer-links" aria-label="Footer">
          <div>
            <h2>Explore</h2>
            <ul>
              <li><Link href="/news">News</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/blog">Insights</Link></li>
              <li><Link href="/blog/archive">Deep Analysis</Link></li>
              <li><Link href="/brands">Companies &amp; Brands</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="/reports">Reports</Link></li>
              <li><Link href="/videos">Videos</Link></li>
              <li><Link href="/blog/series/building-worlds-no-1-cleaning-show-from-scratch">Founder Series</Link></li>
            </ul>
          </div>
          <div>
            <h2>Connect</h2>
            <ul>
              <li><Link href="/wcb-expo">WCB Expo</Link></li>
              <li><Link href="/contact">Contact &amp; partnerships</Link></li>
              <li><Link href="/sourcing">Sourcing Services</Link></li>
              <li>
                <TallyButton className="wcb-footer-button" ctaLocation="footer_updates" form="newsletter">
                  Newsletter
                </TallyButton>
              </li>
              <li>
                <a href="https://www.youtube.com/@WCBdenny/videos" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Information</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/quality-compliance">Quality &amp; Compliance</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Use</Link></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="wcb-footer-bottom">© {new Date().getFullYear()} World Clean Biz.</div>
    </footer>
  );
}
