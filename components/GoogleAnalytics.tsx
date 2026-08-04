import Script from "next/script";
import {
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_SCRIPT_ID,
  getGoogleAnalyticsBootstrapScript
} from "@/lib/googleAnalytics";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        id={`${GOOGLE_ANALYTICS_SCRIPT_ID}-library`}
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id={GOOGLE_ANALYTICS_SCRIPT_ID} strategy="afterInteractive">
        {getGoogleAnalyticsBootstrapScript()}
      </Script>
    </>
  );
}
