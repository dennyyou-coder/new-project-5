import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../styles/trust.css";
import "../../styles/authors.css";
import { AUTHORS, authorFor, getAuthor } from "@/lib/authors";
import { getInsights } from "@/lib/content";
import { getNews, newsDate } from "@/lib/news";

const siteUrl = "https://worldcleanbiz.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AUTHORS.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = getAuthor((await params).slug);
  if (!author) return {};
  return {
    title: author.type === "Person" ? `${author.name}, Founder of WCB Expo` : author.name,
    description: author.bio[0],
    alternates: { canonical: `/authors/${author.slug}` }
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = getAuthor((await params).slug);
  if (!author) notFound();
  const mine = (name: string) => authorFor(name).slug === author.slug;
  const pieces = [
    ...getInsights().filter((article) => mine(article.author)).map((article) => ({ title: article.title, href: `/blog/${article.slug}`, date: article.sortDate || article.date, kind: "Analysis" })),
    ...getNews().filter((item) => mine(item.author)).map((item) => ({ title: item.title, href: `/news/${item.slug}`, date: item.publishedAt, kind: "News" }))
  ].sort((a, b) => b.date.localeCompare(a.date));
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteUrl}/authors/${author.slug}`,
    mainEntity: {
      "@type": author.type,
      name: author.name,
      ...(author.type === "Person" ? { jobTitle: "Founder, WCB Expo and World Clean Biz", worksFor: { "@type": "Organization", name: "World Clean Biz", url: siteUrl } } : { parentOrganization: { "@type": "Organization", name: "World Clean Biz", url: siteUrl } }),
      description: author.bio[0],
      url: `${siteUrl}/authors/${author.slug}`,
      ...(author.image ? { image: `${siteUrl}${author.image}` } : {}),
      ...(author.sameAs.length ? { sameAs: author.sameAs } : {})
    }
  };

  return (
    <div className="trust-page trust-legal-page author-page">
      <section className="trust-hero trust-legal-hero">
        <div className="container trust-hero-inner author-hero">
          {author.image ? <img className="author-photo" src={author.image} alt={author.name} width={160} height={160} /> : <span className="author-mark" aria-hidden="true">WCB</span>}
          <div>
            <p className="eyebrow">Author</p>
            <h1>{author.name}</h1>
            <p className="trust-hero-lead">{author.role}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container author-body">
          <div className="author-about">
            {author.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <h2>Covers</h2>
            <ul className="author-covers">{author.covers.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="author-links">
              <Link href="/editorial-policy">Editorial standards</Link>
              {author.type === "Person" ? <Link href="/about">About Denny</Link> : null}
              {author.sameAs.map((url) => <a key={url} href={url} target="_blank" rel="noopener noreferrer">YouTube</a>)}
            </p>
          </div>
          <div className="author-pieces">
            <h2>Latest from {author.name} <span>{pieces.length}</span></h2>
            <ul>
              {pieces.slice(0, 30).map((piece) => (
                <li key={piece.href}>
                  <Link href={piece.href}>{piece.title}</Link>
                  <span>{piece.kind} · {newsDate(piece.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
