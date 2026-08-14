export type ShareData = { title: string; url: string };

export type ArticleShareLink = {
  id: "linkedin" | "x" | "facebook" | "whatsapp";
  label: string;
  href: string;
};

export type ShareNavigator = {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
};

export type CopyEnvironment = {
  clipboard?: { writeText(value: string): Promise<void> };
  legacyCopy(value: string): boolean;
};

export type ArticleShareAnnouncement = {
  message: string;
  sequence: number;
};

export function nextShareAnnouncement(
  current: ArticleShareAnnouncement,
  message: string
): ArticleShareAnnouncement {
  return { message, sequence: current.sequence + 1 };
}

export function getArticleShareLinks(title: string, url: string): ArticleShareLink[] {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return [
    { id: "linkedin", label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { id: "x", label: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { id: "facebook", label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { id: "whatsapp", label: "Share on WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` }
  ];
}

export function canUseNativeShare(navigatorLike: ShareNavigator, data: ShareData): boolean {
  if (typeof navigatorLike.share !== "function") return false;
  return typeof navigatorLike.canShare !== "function" || navigatorLike.canShare(data);
}

export async function shareArticle(
  navigatorLike: ShareNavigator,
  data: ShareData
): Promise<"shared" | "cancelled" | "failed" | "unsupported"> {
  if (!canUseNativeShare(navigatorLike, data) || !navigatorLike.share) return "unsupported";

  try {
    await navigatorLike.share(data);
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    return "failed";
  }
}

export async function copyArticleUrl(url: string, environment: CopyEnvironment): Promise<boolean> {
  if (environment.clipboard) {
    try {
      await environment.clipboard.writeText(url);
      return true;
    } catch {
      // Continue to the explicit legacy fallback.
    }
  }

  try {
    return environment.legacyCopy(url);
  } catch {
    return false;
  }
}
