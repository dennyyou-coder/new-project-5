import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
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
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg"
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
  themeColor: "#06162d",
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
      </body>
    </html>
  );
}
