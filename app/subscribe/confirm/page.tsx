import type { Metadata } from "next";
import Link from "next/link";
import "../../styles/trust.css";

export const metadata: Metadata = {
  title: "Confirm Your Subscription",
  description: "Confirm your World Clean Biz weekly brief subscription.",
  robots: { index: false, follow: false }
};

type Props = { searchParams: Promise<{ token?: string; status?: string }> };

const MESSAGES: Record<string, string> = {
  expired: "This confirmation link has expired. Please subscribe again and use the new link within 7 days.",
  invalid: "This confirmation link is not valid. Please subscribe again.",
  error: "Something went wrong on our side. Please try again in a few minutes, or email news@worldcleanbiz.com."
};

/** Landing page for the confirmation email: one button, so mail scanners that open links do not subscribe anyone. */
export default async function ConfirmSubscriptionPage({ searchParams }: Props) {
  const { token, status } = await searchParams;
  const message = status ? MESSAGES[status] ?? MESSAGES.error : null;
  return (
    <div className="trust-page trust-legal-page">
      <section className="trust-hero trust-legal-hero">
        <div className="container trust-hero-inner">
          <p className="eyebrow">WCB weekly brief</p>
          <h1>{message ? "We couldn't confirm that" : "Confirm your subscription"}</h1>
          {message ? (
            <p className="trust-hero-lead">{message} <Link href="/">Back to World Clean Biz</Link></p>
          ) : token ? (
            <>
              <p className="trust-hero-lead">One click and the brief arrives every Friday: five stories that matter in the cleaning industry and one WCB analysis.</p>
              <form method="post" action="/api/leads/confirm">
                <input type="hidden" name="token" value={token} />
                <button type="submit" className="button">Confirm subscription</button>
              </form>
            </>
          ) : (
            <p className="trust-hero-lead">Open the link in your confirmation email to finish subscribing. <Link href="/">Back to World Clean Biz</Link></p>
          )}
        </div>
      </section>
    </div>
  );
}
