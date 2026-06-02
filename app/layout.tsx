import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://worldcleanbiz.com"),
  title: {
    default: "World Clean Biz",
    template: "%s | World Clean Biz"
  },
  description:
    "Global cleaning industry intelligence and sourcing platform for OEM, ODM, private label, market reports, and World Clean Expo.",
  openGraph: {
    title: "World Clean Biz",
    description:
      "Global Cleaning Industry Intelligence & Sourcing Platform.",
    url: "https://worldcleanbiz.com",
    siteName: "World Clean Biz",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
