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
    theme_color: "#0F2747",
    icons: [
      {
        src: "/brand/wcb-favicon-64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "/brand/wcb-favicon-180.png",
        sizes: "180x180",
        type: "image/png"
      },
      {
        src: "/brand/wcb-favicon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
