import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "World Clean Biz",
    short_name: "World Clean Biz",
    description:
      "Global cleaning industry intelligence, market reports, sourcing context, and World Clean Expo information.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#06162d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "64x64",
        type: "image/svg+xml"
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml"
      }
    ]
  };
}
