import type { Metadata } from "next";
import Link from "next/link";
import "../styles/trust.css";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the World Clean Biz weekly brief.",
  robots: { index: false, follow: false }
};

type Props = { searchParams: Promise<{ token?: string; status?: string }> };

/** The email's unsubscribe link lands here; the button posts, so link scanners cannot unsubscribe anyone. */
export default async function UnsubscribePage({ searchParams }: Props) {
  const { token, status } = await searchParams;
  const heading = status === "ok" ? "You're unsubscribed" : status ? "We couldn't unsubscribe you" : "Unsubscribe from the WCB weekly brief";
  return (
    <div className="trust-page trust-legal-page">
      <section className="trust-hero trust-legal-hero">
        <div className="container trust-hero-inner">
          <p className="eyebrow">WCB weekly brief</p>
          <h1>{heading}</h1>
          {status === "ok" ? (
            <p className="trust-hero-lead">You won&apos;t receive the brief any more. Changed your mind? You can subscribe again from any page. <Link href="/">Back to World Clean Biz</Link></p>
          ) : status ? (
            <p className="trust-hero-lead">The link may be out of date. Email news@worldcleanbiz.com and we will remove you by hand. <Link href="/">Back to World Clean Biz</Link></p>
          ) : token ? (
            <form method="post" action="/api/leads/unsubscribe">
              <input type="hidden" name="token" value={token} />
              <button type="submit" className="button">Unsubscribe</button>
            </form>
          ) : (
            <p className="trust-hero-lead">Use the unsubscribe link at the bottom of any WCB email, or email news@worldcleanbiz.com.</p>
          )}
        </div>
      </section>
    </div>
  );
}
