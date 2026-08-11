import manifest from "./generated/article-image-runtime.json" with { type: "json" };
import {
  responsiveImageAttributesFor,
  responsiveImagePropsFor,
  type ArticleImageContext
} from "@/lib/articleImageProps";

export type { ArticleImageContext } from "@/lib/articleImageProps";

type MobileArticleImage = {
  src: string;
  width: number;
  height: number;
};

export type ArticleImage = {
  width: number;
  height: number;
  mobile?: MobileArticleImage;
};

type ArticleImageManifest = {
  assets: Record<string, ArticleImage>;
};

function localPublicUrl(url: string) {
  return url.startsWith("/") && !url.startsWith("//");
}

function manifestKey(url: string) {
  return url.split(/[?#]/, 1)[0];
}

export function createArticleImageHelpers(sourceManifest: ArticleImageManifest) {
  function getArticleImage(url: string) {
    const image = sourceManifest.assets[manifestKey(url)];
    if (image) return image;
    if (localPublicUrl(url)) {
      throw new Error(`Unknown local article image: ${url}`);
    }
    return undefined;
  }

  function responsiveImageProps(url: string, context: ArticleImageContext) {
    return responsiveImagePropsFor(url, context, getArticleImage(url));
  }

  function responsiveImageAttributes(url: string, context: ArticleImageContext) {
    return responsiveImageAttributesFor(url, context, getArticleImage(url));
  }

  return { getArticleImage, responsiveImageProps, responsiveImageAttributes };
}

const helpers = createArticleImageHelpers(manifest as ArticleImageManifest);

export const getArticleImage = helpers.getArticleImage;
export const responsiveImageProps = helpers.responsiveImageProps;
export const responsiveImageAttributes = helpers.responsiveImageAttributes;
