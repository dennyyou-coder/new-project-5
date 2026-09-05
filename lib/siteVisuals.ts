const REFRESH_PREFIXES = ["/images/site-refresh/2026-09-commercial/", "/images/site-refresh/2026-09-products/"];
const dimensions: Record<string, [number, number]> = {
  "/images/site-refresh/2026-09-products/expo-home.webp": [1254, 1254],
  "/images/site-refresh/2026-09-products/pr-01.webp": [1440, 960],
  "/images/site-refresh/2026-09-products/pr-04.webp": [1440, 960],
  "/images/site-refresh/2026-09-products/lr-01.webp": [1440, 960],
  "/images/site-refresh/2026-09-products/lr-02.webp": [1280, 853],
  "/images/site-refresh/2026-09-products/lr-03.webp": [1280, 853],
  "/images/site-refresh/2026-09-products/lr-04.webp": [1280, 853],
  "/images/site-refresh/2026-09-products/lr-05.webp": [1440, 960],
  "/images/site-refresh/2026-09-products/cc-01.webp": [1440, 960],
  "/images/site-refresh/2026-09-products/vc-04.webp": [1440, 960]
};

export function siteVisualProps(src: string, sizes = "(max-width: 760px) 100vw, 50vw") {
  if (!REFRESH_PREFIXES.some((prefix) => src.startsWith(prefix)) || !src.endsWith(".webp") || src.endsWith("-800.webp")) return { src };
  const [width, height] = dimensions[src] ?? [1536, 1024];
  return {
    src,
    srcSet: `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} ${width}w`,
    sizes,
    width,
    height,
    loading: "lazy" as const,
    decoding: "async" as const
  };
}
