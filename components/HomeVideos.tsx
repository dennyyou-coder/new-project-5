"use client";

import { useState } from "react";
import Link from "next/link";
import { homeVideos as videos, videoLibrary, type WcbVideo } from "@/lib/wcbVideos";



export function HomeVideos({ library = false }: { library?: boolean }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (library) {
    const featured = videoLibrary.find((video) => video.key === "bissell")!;
    const remaining = videoLibrary.filter((video) => video.key !== featured.key);
    const youtubeMark = <svg viewBox="0 0 28 20" width="28" height="20" aria-hidden="true"><rect width="28" height="20" rx="5" fill="currentColor" /><path d="m11 5 8 5-8 5z" fill="#fff" /></svg>;
    const player = (video: WcbVideo, eager = false) => activeVideo === video.key ? (
      <iframe className="video-frame" src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&playsinline=1&rel=0`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    ) : (
      <button className="video-poster" type="button" onClick={() => setActiveVideo(video.key)} aria-label={`Play ${video.title}`}>
        <img src={video.poster} alt={`${video.title} — original video cover`} width={1280} height={720} loading={eager ? "eager" : "lazy"} decoding="async" />
        <span className="video-play" aria-hidden="true">{youtubeMark}</span><span className="video-duration">{video.duration}</span>
      </button>
    );
    return <>
      <section className="video-intro mist">
        <div className="container video-intro-row">
          <div><p className="eyebrow">Watch with Denny</p><h1>Video Insights</h1><p className="intro-line">Company stories, product strategy and the business of cleaning.</p><p className="video-language">Mandarin audio · English &amp; Chinese subtitles</p></div>
          <div className="video-channel"><a className="youtube-button" href="https://www.youtube.com/@WCBdenny/videos" target="_blank" rel="noopener noreferrer">{youtubeMark} More on YouTube</a><Link className="text-link" href="/about">About Denny You</Link></div>
        </div>
      </section>
      <section className="section video-library" aria-label="Industry video library">
        <div className="container">
          <article className="video-feature">
            {player(featured, true)}
            <div className="video-feature-copy"><p className="eyebrow">Company Analysis</p><h2>{featured.title}</h2><p>{featured.description}</p><span className="video-meta">Denny You · {featured.duration}</span><a className="youtube-button" href={`https://www.youtube.com/watch?v=${featured.videoId}`} target="_blank" rel="noopener noreferrer">{youtubeMark} Watch on YouTube</a></div>
          </article>
          <div className="section-head"><h2>More industry videos</h2></div>
          <div className="video-library-grid">{remaining.map((video) => <article className="video-card" key={video.key}>
            {player(video)}<div className="video-copy"><p className="video-meta">{video.category} · {video.duration}</p><h3>{video.title}</h3><p>{video.description}</p></div>
          </article>)}</div>
        </div>
      </section>
    </>;
  }

  return (
    <section
      className="home-videos home-v9-container"
      aria-labelledby="home-videos-title"
    >
      <div className="home-videos-header">
        <div>
          <p className="home-v9-eyebrow">Watch with Denny</p>
          <h2 id="home-videos-title">
            {library ? "Company Analysis" : "Selected Videos"}
          </h2>
          <p className="home-videos-intro">
            Company stories, product strategy and the business of cleaning.
          </p>
        </div>
        {library ? (
          <a
            className="home-v9-inline-link"
            href="https://www.youtube.com/@WCBdenny/videos"
            target="_blank"
            rel="noopener noreferrer"
          >
            More on YouTube
          </a>
        ) : (
          <Link className="home-v9-inline-link home-quiet-link" href="/videos">
            All videos
          </Link>
        )}
      </div>
      <div className="home-videos-grid">
        {videos.map((video) => (
          <article className="home-video-card" key={video.key}>
            <div className="home-video-media">
              {activeVideo === video.key ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&playsinline=1&rel=0`}
                  title={video.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="home-video-poster"
                  onClick={() => setActiveVideo(video.key)}
                  aria-label={`Play ${video.title}`}
                >
                  <img
                    src={video.poster}
                    alt=""
                    width={720}
                    height={405}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home-video-play" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="home-video-duration">{video.duration}</span>
                </button>
              )}
            </div>
            <div className="home-video-copy">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <a
                className="youtube-action"
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 28 20" width="28" height="20" aria-hidden="true"><rect width="28" height="20" rx="5" fill="currentColor" /><path d="m11 5 8 5-8 5z" fill="#fff" /></svg>
                Watch on YouTube
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="home-videos-language">
        Mandarin audio · English &amp; Chinese subtitles
      </p>
    </section>
  );
}
