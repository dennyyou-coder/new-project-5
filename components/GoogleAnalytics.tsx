import Script from "next/script";
import { LOCAL_ANALYTICS_DEBUG_HOSTS } from "@/lib/leadTracking";

const GA_MEASUREMENT_ID = "G-6RW65B9CD0";
const LOCAL_DEBUG_HOSTS = JSON.stringify(LOCAL_ANALYTICS_DEBUG_HOSTS);

// The typed window.gtag contract is declared in lib/leadTracking.ts.
export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            debug_mode: ${LOCAL_DEBUG_HOSTS}.includes(window.location.hostname)
          });
        `}
      </Script>
    </>
  );
}
