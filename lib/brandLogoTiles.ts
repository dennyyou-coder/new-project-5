import type { CSSProperties } from "react";
import tiles from "./generated/brand-logo-tiles.json" with { type: "json" };

/**
 * Trimmed logo tiles for compact logo cards (built by
 * scripts/build-brand-logo-tiles.mjs). Official logo files keep their own
 * padding, so cards use these tiles and size them by area.
 */
/** `light`: a near-white logo that needs darkening on white cards. */
export type BrandLogoTile = { src: string; ratio: number; light?: boolean };

const TILES = tiles as Record<string, BrandLogoTile>;

export function brandLogoTile(slug: string | undefined): BrandLogoTile | undefined {
  return slug ? TILES[slug] : undefined;
}

/**
 * Width (as a share of its box) that gives every logo about the same visual
 * area: wide wordmarks get more width, square marks less, within limits.
 * `boxRatio` is the card's width / height; `fill` is the target area share.
 */
export function logoTileWidth(ratio: number, boxRatio = 1.8, fill = 0.36): number {
  const maxWidth = 0.9;
  const maxHeight = 0.74;
  let width = Math.sqrt((fill * ratio) / boxRatio);
  const height = (width * boxRatio) / ratio;
  if (height > maxHeight) width = (maxHeight * ratio) / boxRatio;
  return Math.min(width, maxWidth);
}

export function logoTileStyle(ratio: number | undefined, boxRatio?: number, light = false): CSSProperties | undefined {
  if (!ratio) return undefined;
  return {
    width: `${(logoTileWidth(ratio, boxRatio) * 100).toFixed(1)}%`,
    height: "auto",
    maxWidth: "none",
    maxHeight: "none",
    ...(light ? { filter: "brightness(0.28) contrast(1.15)" } : {})
  };
}
