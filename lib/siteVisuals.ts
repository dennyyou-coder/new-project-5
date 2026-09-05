const REFRESH_PREFIX = "/images/site-refresh/2026-09-commercial/";

export function siteVisualProps(src: string, sizes = "(max-width: 760px) 100vw, 50vw") {
  if (!src.startsWith(REFRESH_PREFIX) || !src.endsWith(".webp") || src.endsWith("-800.webp")) return { src };
  return {
    src,
    srcSet: `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} 1536w`,
    sizes,
    width: 1536,
    height: 1024,
    loading: "lazy" as const,
    decoding: "async" as const
  };
}
