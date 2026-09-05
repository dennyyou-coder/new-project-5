import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./styles/home.css";
import { HomeSeriesFeature } from "@/components/HomeSeriesFeature";
import { HomeUpdatesForm } from "@/components/HomeUpdatesForm";
import { TallyButton } from "@/components/LeadForms";
import { getSeriesArticles } from "@/lib/blogSeries";
import { getPublishedBrandProfiles } from "@/lib/brands";
import { responsiveImageProps } from "@/lib/articleImages";
import { getInsights, type Insight } from "@/lib/content";
import { getEditorialInsights } from "@/lib/insightCollections";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

const founderSeries = "building-worlds-no-1-cleaning-show-from-scratch";

const heroProducts = [
  { label: "Robot Vacuums", image: "/images/site-refresh/2026-09-commercial/01-robot-vacuum.webp", alt: "Robot vacuum product category", text: "New functions, brands and channels continue to reshape floorcare." },
  { label: "Floor Washers", image: "/images/site-refresh/2026-09-commercial/02-floor-washer.webp", alt: "Hard floor washer product category", text: "Fast product iteration is expanding the hard-floor cleaning market." },
  { label: "Pool Robots", image: "/images/site-refresh/2026-09-commercial/03-pool-robot.webp", alt: "Robotic pool cleaner product category", text: "Automated pool maintenance is moving into broader retail channels." },
  { label: "Robotic Lawn Mowers", image: "/images/site-refresh/2026-09-commercial/04-lawn-robot.webp", alt: "Robotic lawn mower product category", text: "Outdoor robotics is entering a faster global adoption cycle." },
  { label: "Commercial Cleaning", image: "/images/site-refresh/2026-09-commercial/05-commercial-cleaning.webp", alt: "Commercial cleaning robot product category", text: "Facilities and service operators are testing new automation models." },
  { label: "Emerging Categories", image: "/images/site-refresh/2026-09-commercial/14-emerging-products.webp", alt: "Emerging cleaning product categories", text: "New equipment, components and formats are still taking shape." }
];

const pathways = [
  {
    number: "01",
    eyebrow: "Market Intelligence",
    title: "See The Shift Before It Becomes Obvious",
    text: "Follow category movement, companies, channels and product signals across the global cleaning industry.",
    image: "/images/site-refresh/2026-09-commercial/08-market-research.webp",
    imageAlt: "Cleaning product samples and research materials on a workbench",
    links: [
      { href: "/blog", label: "Read Industry Insights" },
      { href: "/reports", label: "Explore Market Reports" }
    ]
  },
  {
    number: "02",
    eyebrow: "Product & Sourcing",
    title: "Turn Market Signals Into Product Decisions",
    text: "Connect category judgement with suppliers, OEM/ODM options, product direction and execution support.",
    image: "/images/site-refresh/2026-09-commercial/07-product-testing.webp",
    imageAlt: "Technician observing a robot vacuum floor test",
    links: [{ href: "/sourcing", label: "Start A Sourcing Inquiry" }]
  },
  {
    number: "03",
    eyebrow: "WCB Expo",
    title: "Move From Online Signals To Real Connections",
    text: "Meet manufacturers, brands, suppliers and buyers through the next global cleaning industry platform.",
    image: "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
    imageAlt: "Cleaning equipment exhibition and industry connections",
    links: [{ href: "/wcb-expo", label: "Explore WCB Expo" }]
  }
];

const fallbackInsightImages = [
  "/images/site-refresh/real/city-architecture.webp",
  "/images/site-refresh/real/product-detail.webp",
  "/images/site-refresh/real/exhibition-hall.webp"
];

const featuredInsightSlugs = [
  "anker-prospectus-trillion-yuan-cleaning-industry",
  "sharkninja-road-to-10-billion-dollars",
  "tti-cleaning-appliance-strategy"
];

const featuredBrandSelections = [
  { slug: "milwaukee", categoryLabel: "Power Tools" },
  { slug: "husqvarna", categoryLabel: "Lawn & Garden" },
  { slug: "maytronics", categoryLabel: "Pool Equipment" },
  { slug: "roborock", categoryLabel: "Floorcare" },
  { slug: "tineco", categoryLabel: "Floorcare" },
  { slug: "karcher", categoryLabel: "Commercial Cleaning" }
];

function isGenericBuyerGuide(article: Insight) {
  const haystack = `${article.slug} ${article.title} ${article.category}`.toLowerCase();
  return (
    article.category === "Buyer Guide" ||
    article.category === "Sourcing Guide" ||
    /\bbuyer('|’)?s? guide\b/.test(haystack) ||
    /\bsourcing guide\b/.test(haystack)
  );
}

function getFeaturedInsights(articles: Insight[]) {
  const priorityArticles = featuredInsightSlugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is Insight => Boolean(article));
  const fallbackArticles = articles.filter(
    (article) => !featuredInsightSlugs.includes(article.slug) && !isGenericBuyerGuide(article)
  );
  const unique = new Map<string, Insight>();

  for (const article of [...priorityArticles, ...fallbackArticles]) {
    unique.set(article.slug, article);
    if (unique.size === 3) break;
  }

  return Array.from(unique.values());
}

function articleImageProps(article: Insight, index: number) {
  return article.coverImage
    ? responsiveImageProps(article.coverImage, "card")
    : {
        src: fallbackInsightImages[index % fallbackInsightImages.length],
        loading: "lazy" as const,
        decoding: "async" as const
      };
}

function excerptFor(article: Insight) {
  if (article.excerpt.length <= 92) return article.excerpt;
  return `${article.excerpt.slice(0, 89).trim()}...`;
}

export default function HomePage() {
  const allInsights = getInsights();
  const brandProfiles = getPublishedBrandProfiles(allInsights);
  const featuredBrands = featuredBrandSelections
    .map((selection) => {
      const profile = brandProfiles.find(({ slug }) => slug === selection.slug);
      return profile ? { ...selection, profile } : null;
    })
    .filter((selection): selection is NonNullable<typeof selection> => Boolean(selection));
  const latestFounderSeries = getSeriesArticles(allInsights, founderSeries).at(-1);
  const featuredInsights = getFeaturedInsights(
    getEditorialInsights(allInsights)
      .filter((article) => article.slug !== latestFounderSeries?.slug)
  );
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://worldcleanbiz.com/#organization",
    name: "World Clean Biz",
    url: "https://worldcleanbiz.com",
    logo: "https://worldcleanbiz.com/brand/wcb-favicon-512.png",
    founder: {
      "@type": "Person",
      name: "Denny You",
      url: "https://worldcleanbiz.com/about"
    }
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://worldcleanbiz.com/#website",
    name: "World Clean Biz",
    url: "https://worldcleanbiz.com",
    publisher: { "@id": "https://worldcleanbiz.com/#organization" }
  };

  return (
    <div className="home-v9">
      <section className="home-v9-hero">
        <div className="home-v9-container home-v9-hero-grid">
          <div className="home-v9-hero-copy">
            <p className="home-v9-eyebrow">Global Cleaning Appliances, Robotics & Smart Equipment</p>
            <h1>See What&apos;s Changing Across The Products Reshaping Cleaning.</h1>
            <p className="home-v9-hero-intro">
              Market intelligence, sourcing connections and industry access across
              robot vacuums, floor washers, pool robots, robotic lawn mowers,
              commercial cleaning robots and emerging categories.
            </p>
            <div className="home-v9-actions">
              <Link className="button" href="/sourcing">Start A Sourcing Inquiry</Link>
              <HomeUpdatesForm />
            </div>
          </div>

          {latestFounderSeries ? (
            <HomeSeriesFeature article={latestFounderSeries} />
          ) : (
            <div className="home-v9-product-board" aria-label="Cleaning industry product categories">
              {heroProducts.map((product) => (
                <figure key={product.label}>
                  <Image
                    src={product.image}
                    alt={product.alt}
                    width={1200}
                    height={900}
                    sizes="(max-width: 720px) 42vw, (max-width: 1050px) 21vw, 165px"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>{product.label}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-v9-expo-campaign" aria-labelledby="home-wcb-expo-title">
        <div className="home-v9-container home-v9-expo-campaign-grid">
          <div className="home-v9-expo-campaign-content">
            <div className="home-v9-expo-campaign-mark" aria-hidden="true">
              <strong>WCB</strong>
              <span>2026</span>
            </div>
            <div className="home-v9-expo-campaign-copy">
              <p>2026 WCB Expo Is Now In Preparation</p>
              <h2 id="home-wcb-expo-title">
                2026 WCB Expo Is Coming To Suzhou. We Invite You To Join Us.
              </h2>
              <p className="home-v9-expo-campaign-intro">
                The 2026 WCB International Cleaning Appliance Expo is taking shape.
                Buyers, distributors, brands and industry professionals are invited
                to meet the people and products moving cleaning forward.
              </p>
              <div>
                <strong>18–20 November 2026</strong>
                <span>Suzhou Shishan Convention Center · Suzhou, China</span>
              </div>
            </div>
            <Link className="button" href="/wcb-expo#visitor-interest">
              Plan Your Visit
            </Link>
          </div>
          <div className="home-v9-expo-campaign-media">
            <Image
              src="/images/site-refresh/2026-09-products/expo-home.webp"
              alt="Cleaning appliances presented on display plinths in a modern exhibition booth"
              width={1254}
              height={1254}
              sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1180px) 40vw, 480px"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="home-v9-section home-v9-categories">
        <div className="home-v9-container">
          <div className="home-v9-category-head">
            <div>
              <p className="home-v9-eyebrow">Core Product Categories</p>
              <h2>Categories Where The Next Opportunities Are Forming</h2>
            </div>
            <p>
              WCB follows the products where technology, suppliers, brands and
              channel demand are changing fastest.
            </p>
          </div>
          <div className="home-v9-category-grid">
            {heroProducts.map((product, index) => (
              <article key={product.label}>
                <Image
                  src={product.image}
                  alt={product.alt}
                  width={1536}
                  height={1024}
                  sizes="(max-width: 720px) 42vw, (max-width: 1050px) 21vw, 165px"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{product.label}</h3>
                  <p>{product.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v9-section home-v9-brands">
        <div className="home-v9-container home-v9-brand-showcase">
          <div className="home-v9-brand-copy">
            <p className="home-v9-eyebrow">Independent Brand Intelligence</p>
            <h2>Know Who Is Behind The Product</h2>
            <p>
              Verify ownership, product scope, manufacturing evidence and channel
              responsibility before you choose a brand, supplier or route to market.
            </p>
            <Link className="home-v9-inline-link" href="/brands">
              Explore all {brandProfiles.length} brand profiles →
            </Link>
          </div>
          <div className="home-v9-brand-logos" aria-label="Featured brand profiles">
            {featuredBrands.map(({ profile, categoryLabel }) => (
              <Link href={`/brands/${profile.slug}`} key={profile.slug}>
                <img
                  src={profile.logoImage}
                  alt={profile.logoImageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <div className="home-v9-brand-meta">
                  <span>{categoryLabel}</span>
                  <strong>{profile.name}</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v9-section home-v9-pathways">
        <div className="home-v9-container">
          <div className="home-v9-heading">
            <p className="home-v9-eyebrow">Choose Your Next Step</p>
            <h2>Three Ways World Clean Biz Helps You Move Forward</h2>
          </div>
          <div className="home-v9-pathway-grid">
            {pathways.map((pathway) => (
              <article key={pathway.number}>
                <div className="home-v9-pathway-media">
                  <Image
                    src={pathway.image}
                    alt={pathway.imageAlt}
                    width={1440}
                    height={960}
                    sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1180px) 31vw, 370px"
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{pathway.number}</span>
                  <strong>{pathway.eyebrow}</strong>
                </div>
                <div className="home-v9-pathway-body">
                  <h3>{pathway.title}</h3>
                  <div className="home-v9-pathway-copy">{pathway.text}</div>
                  <div className="home-v9-text-links">
                    {pathway.links.map((link) => (
                      <Link href={link.href} key={link.href}>{link.label} <b aria-hidden="true">→</b></Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v9-section home-v9-trust">
        <div className="home-v9-container home-v9-trust-grid">
          <div className="home-v9-trust-copy">
            <p className="home-v9-eyebrow">Inside The Industry Since 2006</p>
            <h2>Front-Line Experience Behind Every Industry Signal</h2>
            <p>
              Denny You is the founder of World Clean Biz and Organizer, WCB Expo.
              For a decade, he has shared cleaning industry analysis while
              building products, companies and one of the industry&apos;s broadest
              professional networks. World Clean Biz turns that experience into
              clearer market judgement and more useful business connections.
            </p>
            <ul>
              <li><strong>Since 2006</strong><span>Across products and supply chains</span></li>
              <li><strong>For a decade</strong><span>Sharing industry articles and analysis</span></li>
              <li><strong>Hardware entrepreneur</strong><span>Products, teams, capital and execution</span></li>
            </ul>
            <Link className="home-v9-inline-link" href="/about">About Denny & World Clean Biz →</Link>
          </div>
          <div className="home-v9-trust-gallery">
            <figure className="home-v9-trust-main">
              <Image
                src="/images/site-refresh/home/trust-denny-industry.webp"
                alt="Denny speaking at an industry forum"
                width={1400}
                height={1050}
                sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1050px) 55vw, 330px"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Denny You · Founder, World Clean Biz · Organizer, WCB Expo</figcaption>
            </figure>
            <figure>
              <Image
                src="/images/site-refresh/2026-09-commercial/10-quality-inspection.webp"
                alt="Cleaning appliance components at an inspection station"
                width={1440}
                height={960}
                sizes="(max-width: 720px) 50vw, (max-width: 1050px) 40vw, 245px"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Supplier Network</figcaption>
            </figure>
            <figure>
              <Image
                src="/images/industry/home-expo-networking-2025.jpg"
                alt="Visitors discussing products at an industry exhibition"
                width={1440}
                height={960}
                sizes="(max-width: 720px) 50vw, (max-width: 1050px) 40vw, 245px"
                loading="lazy"
                decoding="async"
              />
              <figcaption>Industry Access</figcaption>
            </figure>
          </div>
        </div>
        <div className="home-v9-container home-v9-testimonials">
          <div className="home-v9-testimonial-head">
            <div>
              <p className="home-v9-eyebrow">Client Perspective</p>
              <h3>What Industry Professionals Value</h3>
            </div>
          </div>
          <div className="home-v9-testimonial-grid">
            <article>
              <Image
                className="home-v9-testimonial-avatar"
                src="/images/testimonials/testimonial-avatar-founder.jpg"
                alt="European floorcare brand founder"
                width={68}
                height={68}
                sizes="(max-width: 720px) 54px, 68px"
                loading="lazy"
                decoding="async"
              />
              <span aria-hidden="true">“</span>
              <blockquote>
                Denny sees both the product and business sides of cleaning. His
                perspective helped us clarify the category before making decisions.
              </blockquote>
              <p>Founder · European Floorcare Brand</p>
            </article>
            <article>
              <Image
                className="home-v9-testimonial-avatar"
                src="/images/testimonials/testimonial-avatar-sourcing-director.jpg"
                alt="North American distributor sourcing director"
                width={68}
                height={68}
                sizes="(max-width: 720px) 54px, 68px"
                loading="lazy"
                decoding="async"
              />
              <span aria-hidden="true">“</span>
              <blockquote>
                Denny combines long-term industry experience with practical
                supplier knowledge. Conversations are direct and commercially useful.
              </blockquote>
              <p>Sourcing Director · North American Distributor</p>
            </article>
            <article>
              <Image
                className="home-v9-testimonial-avatar"
                src="/images/testimonials/testimonial-avatar-product-director.webp"
                alt="Asian cleaning appliance product director"
                width={68}
                height={68}
                sizes="(max-width: 720px) 54px, 68px"
                loading="lazy"
                decoding="async"
              />
              <span aria-hidden="true">“</span>
              <blockquote>
                WCB added useful market context to our product discussions and
                helped us focus on the questions that mattered before moving forward.
              </blockquote>
              <p>Product Director · Asian Cleaning Appliance Manufacturer</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-v9-conversion">
        <div className="home-v9-container home-v9-conversion-bar">
          <div className="home-v9-conversion-item">
            <div>
              <p>Product & Supply Chain</p>
              <h2>Have A Product Or Sourcing Project?</h2>
            </div>
            <div className="home-v9-conversion-actions">
              <Link className="button" href="/sourcing">Start A Sourcing Inquiry</Link>
            </div>
          </div>
          <div className="home-v9-conversion-item">
            <div>
              <p>WCB Expo</p>
              <h2>Planning For WCB Expo?</h2>
            </div>
            <div className="home-v9-conversion-actions">
              <TallyButton ctaLocation="home_wce_exhibitor" form="wceExhibitor" inquiryIntent="exhibitor_interest">Exhibit / Partner</TallyButton>
              <TallyButton className="button-secondary" ctaLocation="home_wce_visitor" form="wceVisitor" inquiryIntent="visitor_interest">Visit / Updates</TallyButton>
            </div>
          </div>
        </div>
      </section>

      <section className="home-v9-section home-v9-proof">
        <div className="home-v9-container">
          <div className="home-v9-proof-head">
            <div className="home-v9-heading">
              <p className="home-v9-eyebrow">Industry Intelligence</p>
              <h2>Signals And Research You Can Use</h2>
            </div>
            <Link className="home-v9-inline-link" href="/blog">View All Insights →</Link>
          </div>
          <div className="home-v9-proof-grid">
            <div className="home-v9-article-grid">
              {featuredInsights.map((article, index) => (
                <Link className="home-v9-article" href={`/blog/${article.slug}`} key={article.slug}>
                  <img {...articleImageProps(article, index)} alt={`${article.title} cover image`} />
                  <div>
                    <span>{article.category}</span>
                    <h3>{article.title}</h3>
                    <p>{excerptFor(article)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <aside className="home-v9-report">
              <p>Featured Report</p>
              <span>2026</span>
              <h3>Global Cleaning Industry Report</h3>
              <div>Market direction, category movement and the business signals shaping the next cleaning industry cycle.</div>
              <Link className="button" href="/reports">Explore The Report</Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-v9-updates">
        <div className="home-v9-container home-v9-updates-grid">
          <div>
            <p className="home-v9-eyebrow">Stay Ahead Of The Market</p>
            <h2>Get The Signals That Match Your Business</h2>
            <p>Receive selected market intelligence, sourcing opportunities and WCB Expo updates.</p>
            <div className="home-v9-interest-list" aria-label="Update topics">
              <span>Market Intelligence</span>
              <span>Sourcing</span>
              <span>WCB Expo</span>
            </div>
          </div>
          <HomeUpdatesForm />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, websiteSchema])
        }}
      />
    </div>
  );
}
