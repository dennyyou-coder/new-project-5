"use client";

import qrcode from "qrcode-generator";
import { useEffect, useMemo, useRef, useState } from "react";
import { ARTICLE_WECHAT_ICON } from "@/lib/articleShareIcons";

/** WeChat has no share link: show a QR code of the page to scan with WeChat, then share from there. */
export function WeChatShare({ url, className = "article-share-action", showLabel = false }: { url: string; className?: string; showLabel?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const svg = useMemo(() => {
    if (!open) return "";
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [open, url]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const Icon = ARTICLE_WECHAT_ICON;
  return (
    <span className="wechat-share" ref={ref}>
      <button aria-label="Share on WeChat" title="Share on WeChat" aria-expanded={open} className={className} onClick={() => setOpen(!open)} type="button">
        <Icon aria-hidden="true" focusable="false" />
        {showLabel ? <span>WeChat</span> : null}
      </button>
      {open ? (
        <span className="wechat-share-pop" role="dialog" aria-label="WeChat QR code">
          <span className="wechat-share-qr" dangerouslySetInnerHTML={{ __html: svg }} />
          <span className="wechat-share-text">Scan with WeChat, then share from WeChat</span>
          <span className="wechat-share-text">微信扫一扫，打开后分享</span>
        </span>
      ) : null}
    </span>
  );
}
