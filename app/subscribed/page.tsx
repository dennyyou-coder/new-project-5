import type { Metadata } from "next";
import Link from "next/link";
import "../styles/trust.css";

export const metadata: Metadata = {
  title: "Subscription Confirmed",
  description: "Your World Clean Biz weekly brief subscription is confirmed.",
  alternates: { canonical: "/subscribed" },
  robots: { index: false, follow: true }
};

/** Where the double opt-in confirmation link lands. */
export default function SubscribedPage() {
  return (
    <div className="trust-page trust-legal-page">
      <section className="trust-hero trust-legal-hero">
        <div className="container trust-hero-inner">
          <p className="eyebrow">WCB weekly brief</p>
          <h1>You&apos;re subscribed</h1>
          <p className="trust-hero-lead">Thanks for confirming. The brief arrives every Friday: five stories that matter in the cleaning industry and one WCB analysis.</p>
          <p className="trust-hero-lead">While you wait, see what WCB is following now: <Link href="/topics">WCB topics</Link>, <Link href="/news">latest news</Link> and the <Link href="/rankings">quarterly results ranking</Link>.</p>
        </div>
      </section>
    </div>
  );
}
