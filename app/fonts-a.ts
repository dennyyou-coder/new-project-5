import { Archivo, IBM_Plex_Mono } from "next/font/google";

/* Site type (A design): Archivo for headings and figures, IBM Plex Mono for labels and dates.
   Body text stays in Manrope (app/layout.tsx). next/font serves both files from worldcleanbiz.com. */
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"]
});
