"use client";

import { useEffect, useRef, useState } from "react";
import {
  canUseNativeShare,
  copyArticleUrl,
  getArticleShareLinks,
  shareArticle
} from "@/lib/articleSharing";

const SHARE_MARKS = {
  linkedin: "in",
  x: "X",
  facebook: "f",
  whatsapp: "WA"
} as const;

export function ArticleShareActions({ title, url }: { title: string; url: string }) {
  const data = { title, url };
  const links = getArticleShareLinks(title, url);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [status, setStatus] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCanNativeShare(canUseNativeShare(navigator, data));
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [title, url]);

  function announce(message: string) {
    setStatus(message);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setStatus(""), 2400);
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
          {links.map((link) => (
            <a
              aria-label={link.label}
              className="article-share-action"
              href={link.href}
              key={link.id}
              rel="noopener noreferrer"
              target="_blank"
              title={link.label}
            >
              <span aria-hidden="true">{SHARE_MARKS[link.id]}</span>
            </a>
          ))}
          <button
            aria-label="Copy article link"
            className="article-share-action"
            onClick={handleCopy}
            title="Copy article link"
            type="button"
          >
            <span aria-hidden="true">⧉</span>
          </button>
          <span className="article-share-status" role="status" aria-live="polite">
            {status}
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
              <span aria-hidden="true">↗</span>
              <span>Share</span>
            </button>
          ) : null}
          {links.map((link) => (
            <a
              aria-label={link.label}
              className="article-share-action"
              href={link.href}
              key={link.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span aria-hidden="true">{SHARE_MARKS[link.id]}</span>
              <span>{link.id === "x" ? "X" : link.id[0].toUpperCase() + link.id.slice(1)}</span>
            </a>
          ))}
          <button className="article-share-action" onClick={handleCopy} type="button">
            <span aria-hidden="true">⧉</span>
            <span>Copy link</span>
          </button>
        </div>
        <span className="article-share-status" role="status" aria-live="polite">
          {status}
        </span>
      </section>
    </>
  );
}
