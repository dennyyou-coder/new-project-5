export type ArticleImageContext = "cover" | "body" | "card";

export type ResponsiveArticleImage = {
  width?: number;
  height?: number;
  mobile?: {
    src: string;
    width: number;
    height?: number;
  };
};

const contextSettings = {
  cover: {
    sizes: "(max-width: 800px) 100vw, 1200px",
    loading: "eager",
    fetchPriority: "high"
  },
  body: {
    sizes: "(max-width: 800px) calc(100vw - 32px), 900px",
    loading: "lazy",
    fetchPriority: "auto"
  },
  card: {
    sizes: "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px",
    loading: "lazy",
    fetchPriority: "auto"
  }
} as const;

export function responsiveImagePropsFor(
  url: string,
  context: ArticleImageContext,
  image?: ResponsiveArticleImage
) {
  const settings = contextSettings[context];
  if (!settings) throw new Error(`Unknown article image context: ${context}`);
  const props: {
    src: string;
    srcSet?: string;
    sizes: string;
    width?: number;
    height?: number;
    loading: "eager" | "lazy";
    decoding: "async";
    fetchPriority: "high" | "auto";
  } = {
    src: url,
    sizes: settings.sizes,
    loading: settings.loading,
    decoding: "async",
    fetchPriority: settings.fetchPriority
  };

  if (image?.width !== undefined && image.height !== undefined) {
    props.width = image.width;
    props.height = image.height;
    if (image.mobile) {
      props.srcSet = `${image.mobile.src} ${image.mobile.width}w, ${url} ${image.width}w`;
    }
  }

  return props;
}

export function responsiveImageAttributesFor(
  url: string,
  context: ArticleImageContext,
  image?: ResponsiveArticleImage
) {
  const { srcSet, fetchPriority, ...props } = responsiveImagePropsFor(url, context, image);
  return {
    ...props,
    ...(srcSet ? { srcset: srcSet } : {}),
    fetchpriority: fetchPriority
  };
}
