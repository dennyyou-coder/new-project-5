import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://worldcleanbiz.com"),
  title: {
    default: "World Clean Biz | Global Cleaning Industry Intelligence",
    template: "%s | World Clean Biz"
  },
  description:
    "A trusted information home for global cleaning industry professionals covering insights, market reports, sourcing intelligence, and World Clean Expo.",
  keywords: [
    "cleaning industry",
    "cleaning industry intelligence",
    "cleaning product sourcing",
    "World Clean Expo",
    "market reports",
    "floor care",
    "robot vacuum",
    "commercial cleaning"
  ],
  authors: [{ name: "Denny You" }],
  creator: "Denny You",
  publisher: "World Clean Biz",
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: "/brand/wcb-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/wcb-favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/brand/wcb-favicon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/brand/wcb-favicon-180.png"
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "World Clean Biz | Global Cleaning Industry Intelligence",
    description:
      "A trusted information home for global cleaning industry professionals.",
    url: "https://worldcleanbiz.com",
    siteName: "World Clean Biz",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "World Clean Biz",
    description:
      "Global cleaning industry insights, reports, sourcing intelligence, and expo information."
  }
};

export const viewport: Viewport = {
  themeColor: "#0F2747",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-shell">
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </div>
        <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
