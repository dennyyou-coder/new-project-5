const REFRESH_PREFIXES = ["/images/site-refresh/2026-09-commercial/", "/images/site-refresh/2026-09-products/"];
/** Our own exhibition photography (prepared article images with -800 variants). */
const EVENT_PHOTOS: Record<string, [number, number]> = {
  "/images/articles/about-denny-expo-2026/11-photo-97.webp": [1120, 841],
  "/images/articles/about-denny-expo-2026/12-photo-98.webp": [1120, 841],
  "/images/articles/about-denny-expo-2026/13-photo-90.webp": [1120, 841],
  "/images/articles/about-denny-expo-2026/14-photo-86.webp": [1120, 841],
  "/images/articles/about-denny-expo-2026/16-photo-92.webp": [1120, 841],
  "/images/articles/about-denny-expo-2026/17-photo-95.webp": [1120, 841],
  "/images/articles/about-denny-expo-2026/20-photo-105.webp": [1120, 841],
  "/images/articles/about-denny-expo-2025/12-photo-81.webp": [1120, 747],
  "/images/articles/about-denny-forum-2025/11-photo-20.webp": [1600, 1067],
  "/images/articles/about-denny-forum-2025/13-photo-18.webp": [1600, 1067],
  "/images/articles/about-denny-forum-2025/14-photo-19.webp": [1600, 1067],
  "/images/articles/about-denny-expo-2025/15-photo-49.webp": [1120, 747],
  "/images/articles/about-denny-expo-2025/17-photo-74.webp": [1120, 747],
  "/images/articles/about-denny-expo-2025/18-photo-78.webp": [1120, 747]
};
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
  const event = EVENT_PHOTOS[src];
  if (!event && (!REFRESH_PREFIXES.some((prefix) => src.startsWith(prefix)) || !src.endsWith(".webp") || src.endsWith("-800.webp"))) return { src };
  const [width, height] = event ?? dimensions[src] ?? [1536, 1024];
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
