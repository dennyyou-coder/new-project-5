"use client";

import { useEffect, useRef, useState } from "react";
import {
  type ArticleShareAnnouncement,
  canUseNativeShare,
  copyArticleUrl,
  getArticleShareLinks,
  nextShareAnnouncement,
  shareArticle
} from "@/lib/articleSharing";
import {
  ARTICLE_COPY_ICON,
  ARTICLE_NATIVE_SHARE_ICON,
  ARTICLE_SHARE_ICONS
} from "@/lib/articleShareIcons";

export function ArticleShareActions({ title, url }: { title: string; url: string }) {
  const data = { title, url };
  const links = getArticleShareLinks(title, url);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [announcement, setAnnouncement] = useState<ArticleShareAnnouncement>({
    message: "",
    sequence: 0
  });
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCanNativeShare(canUseNativeShare(navigator, data));
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [title, url]);

  function announce(message: string) {
    setAnnouncement((current) => nextShareAnnouncement(current, message));
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(
      () => setAnnouncement((current) => ({ ...current, message: "" })),
      2400
    );
  }

  function legacyCopy(value: string) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }

  async function handleCopy() {
    const copied = await copyArticleUrl(url, {
      clipboard: navigator.clipboard,
      legacyCopy
    });
    announce(copied ? "Link copied" : "Copy failed");
  }

  async function handleNativeShare() {
    const result = await shareArticle(navigator, data);
    if (result === "failed") announce("Sharing unavailable");
  }

  return (
    <>
      <aside className="article-share-rail" aria-label="Share this article">
        <div className="article-share-rail-inner">
          <span className="article-share-kicker">Share</span>
          {links.map((link) => {
            const ShareIcon = ARTICLE_SHARE_ICONS[link.id];
            return (
              <a
                aria-label={link.label}
                className="article-share-action"
                href={link.href}
                key={link.id}
                rel="noopener noreferrer"
                target="_blank"
                title={link.label}
              >
                <ShareIcon aria-hidden="true" focusable="false" />
              </a>
            );
          })}
          <button
            aria-label="Copy article link"
            className="article-share-action"
            onClick={handleCopy}
            title="Copy article link"
            type="button"
          >
            <ARTICLE_COPY_ICON aria-hidden="true" focusable="false" />
          </button>
          <span className="article-share-status" role="status" aria-live="polite" aria-atomic="true">
            {announcement.message}
            {announcement.message ? (
              <span className="article-share-status-sequence">
                Notification {announcement.sequence}
              </span>
            ) : null}
          </span>
        </div>
      </aside>

      <section className="article-share-mobile" aria-labelledby="article-share-title">
        <div>
          <span className="article-share-kicker">Share</span>
          <h2 id="article-share-title">Share this analysis</h2>
        </div>
        <div className="article-share-mobile-actions">
          {canNativeShare ? (
            <button className="article-share-action" onClick={handleNativeShare} type="button">
              <ARTICLE_NATIVE_SHARE_ICON aria-hidden="true" focusable="false" />
              <span>Share</span>
            </button>
          ) : null}
          {links.map((link) => {
            const ShareIcon = ARTICLE_SHARE_ICONS[link.id];
            return (
              <a
                aria-label={link.label}
                className="article-share-action"
                href={link.href}
                key={link.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ShareIcon aria-hidden="true" focusable="false" />
                <span>{link.id === "x" ? "X" : link.id[0].toUpperCase() + link.id.slice(1)}</span>
              </a>
            );
          })}
          <button className="article-share-action" onClick={handleCopy} type="button">
            <ARTICLE_COPY_ICON aria-hidden="true" focusable="false" />
            <span>Copy link</span>
          </button>
        </div>
        <span className="article-share-status" role="status" aria-live="polite" aria-atomic="true">
          {announcement.message}
          {announcement.message ? (
            <span className="article-share-status-sequence">
              Notification {announcement.sequence}
            </span>
          ) : null}
        </span>
      </section>
    </>
  );
}
