"use client";

import { useEffect, useRef, useState } from "react";
import { canUseNativeShare, copyArticleUrl, getArticleShareLinks, shareArticle } from "@/lib/articleSharing";
import { ARTICLE_COPY_ICON, ARTICLE_NATIVE_SHARE_ICON, ARTICLE_SHARE_ICONS } from "@/lib/articleShareIcons";
import { WeChatShare } from "@/components/share/WeChatShare";

/** A compact row of share buttons for pages that are not articles: topics, companies, products, rankings. */
export function ShareBar({ title, url, className = "" }: { title: string; url: string; className?: string }) {
  const links = getArticleShareLinks(title, url);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCanNativeShare(canUseNativeShare(navigator, { title, url }));
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [title, url]);

  function flash(text: string) {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2400);
  }

  async function copy() {
    const copied = await copyArticleUrl(url, {
      clipboard: navigator.clipboard,
      legacyCopy: (value) => {
        const area = document.createElement("textarea");
        area.value = value;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        return ok;
      }
    });
    flash(copied ? "Link copied" : "Copy failed");
  }

  return (
    <div className={`share-bar ${className}`.trim()}>
      <span className="share-bar-label">Share</span>
      {canNativeShare ? (
        <button aria-label="Share" title="Share" className="share-bar-button share-bar-native" onClick={() => shareArticle(navigator, { title, url })} type="button">
          <ARTICLE_NATIVE_SHARE_ICON aria-hidden="true" focusable="false" />
        </button>
      ) : null}
      {links.map((link) => {
        const Icon = ARTICLE_SHARE_ICONS[link.id];
        return (
          <a aria-label={link.label} title={link.label} className="share-bar-button" href={link.href} key={link.id} rel="noopener noreferrer" target={link.id === "email" ? undefined : "_blank"}>
            <Icon aria-hidden="true" focusable="false" />
          </a>
        );
      })}
      <WeChatShare url={url} className="share-bar-button" />
      <button aria-label="Copy link" title="Copy link" className="share-bar-button" onClick={copy} type="button">
        <ARTICLE_COPY_ICON aria-hidden="true" focusable="false" />
      </button>
      <span className="share-bar-status" role="status" aria-live="polite">{message}</span>
    </div>
  );
}
