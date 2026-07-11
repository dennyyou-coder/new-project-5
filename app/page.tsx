import Link from "next/link";
import { HomeUpdatesForm } from "@/components/HomeUpdatesForm";
import { TallyButton } from "@/components/LeadForms";
import { getInsights, type Insight } from "@/lib/content";

const heroProducts = [
  { label: "Robot Vacuums", image: "/images/site-refresh/home/category-robot-vacuums.webp", alt: "Robot vacuum product category", text: "New functions, brands and channels continue to reshape floorcare." },
  { label: "Floor Washers", image: "/images/site-refresh/home/category-floor-washers.webp", alt: "Hard floor washer product category", text: "Fast product iteration is expanding the hard-floor cleaning market." },
  { label: "Pool Robots", image: "/images/site-refresh/home/category-pool-robots.webp", alt: "Robotic pool cleaner product category", text: "Automated pool maintenance is moving into broader retail channels." },
  { label: "Robotic Lawn Mowers", image: "/images/site-refresh/home/category-robotic-lawn-mowers.webp", alt: "Robotic lawn mower product category", text: "Outdoor robotics is entering a faster global adoption cycle." },
  { label: "Commercial Cleaning", image: "/images/site-refresh/home/category-commercial-cleaning.webp", alt: "Commercial cleaning robot product category", text: "Facilities and service operators are testing new automation models." },
  { label: "Emerging Categories", image: "/images/site-refresh/home/category-emerging-cleaning.webp", alt: "Emerging cleaning product categories", text: "New equipment, components and formats are still taking shape." }
];

const pathways = [
  {
    number: "01",
    eyebrow: "Market Intelligence",
    title: "See The Shift Before It Becomes Obvious",
    text: "Follow category movement, companies, channels and product signals across the global cleaning industry.",
    image: "/images/site-refresh/system/market-intelligence.webp",
    imageAlt: "Robotic vacuum representing cleaning appliance market intelligence",
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
    image: "/images/site-refresh/system/product-engineering.webp",
    imageAlt: "Cleaning industry supplier and sourcing meeting",
    links: [{ href: "/sourcing", label: "Start A Sourcing Inquiry" }]
  },
  {
    number: "03",
    eyebrow: "World Clean Expo",
    title: "Move From Online Signals To Real Connections",
    text: "Meet manufacturers, brands, suppliers and buyers through the next global cleaning industry platform.",
    image: "/images/site-refresh/system/expo-concept.webp",
    imageAlt: "Cleaning equipment exhibition and industry connections",
    links: [{ href: "/world-clean-expo", label: "Explore World Clean Expo" }]
  }
];

const fallbackInsightImages = [
  "/images/site-refresh/system/market-intelligence.webp",
  "/images/site-refresh/system/product-engineering.webp",
  "/images/site-refresh/system/expo-concept.webp"
];

const featuredInsightSlugs = [
  "anker-prospectus-trillion-yuan-cleaning-industry",
  "sharkninja-road-to-10-billion-dollars",
  "tti-cleaning-appliance-strategy"
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

function imageFor(article: Insight, index: number) {
  return article.coverImage || fallbackInsightImages[index % fallbackInsightImages.length];
}

function excerptFor(article: Insight) {
  if (article.excerpt.length <= 92) return article.excerpt;
  return `${article.excerpt.slice(0, 89).trim()}...`;
}

export default function HomePage() {
  const featuredInsights = getFeaturedInsights(getInsights());

  return (
    <main className="home-v9">
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

          <div className="home-v9-product-board" aria-label="Cleaning industry product categories">
            {heroProducts.map((product) => (
              <figure key={product.label}>
                <img src={product.image} alt={product.alt} />
                <figcaption>{product.label}</figcaption>
              </figure>
            ))}
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
                <img src={product.image} alt={product.alt} />
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
                  <img src={pathway.image} alt={pathway.imageAlt} />
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
              Denny You is the founder of World Clean Biz and Organizer, World Clean Expo.
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
              <img src="/images/site-refresh/home/trust-denny-industry.webp" alt="Denny speaking at an industry forum" />
              <figcaption>Denny You · Founder, World Clean Biz · Organizer, World Clean Expo</figcaption>
            </figure>
            <figure>
              <img src="/images/site-refresh/system/business-roundtable.webp" alt="Cleaning industry business leaders reviewing a product" />
              <figcaption>Supplier Network</figcaption>
            </figure>
            <figure>
              <img src="/images/site-refresh/system/expo-concept.webp" alt="Concept for a premium cleaning technology exhibition" />
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
              <div className="home-v9-testimonial-avatar home-v9-avatar-founder" role="img" aria-label="European floorcare brand founder" />
              <span aria-hidden="true">“</span>
              <blockquote>
                Denny sees both the product and business sides of cleaning. His
                perspective helped us clarify the category before making decisions.
              </blockquote>
              <p>Founder · European Floorcare Brand</p>
            </article>
            <article>
              <div className="home-v9-testimonial-avatar home-v9-avatar-sourcing" role="img" aria-label="North American distributor sourcing director" />
              <span aria-hidden="true">“</span>
              <blockquote>
                Denny combines long-term industry experience with practical
                supplier knowledge. Conversations are direct and commercially useful.
              </blockquote>
              <p>Sourcing Director · North American Distributor</p>
            </article>
            <article>
              <div className="home-v9-testimonial-avatar home-v9-avatar-product" role="img" aria-label="Asian cleaning appliance product director" />
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
              <p>World Clean Expo</p>
              <h2>Planning For World Clean Expo?</h2>
            </div>
            <div className="home-v9-conversion-actions">
              <TallyButton ctaLocation="home_wce_exhibitor" form="wceExhibitor">Exhibit / Partner</TallyButton>
              <TallyButton className="button-secondary" ctaLocation="home_wce_visitor" form="wceVisitor">Visit / Updates</TallyButton>
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
                  <img src={imageFor(article, index)} alt={`${article.title} cover image`} />
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
            <p>Receive selected market intelligence, sourcing opportunities and World Clean Expo updates.</p>
            <div className="home-v9-interest-list" aria-label="Update topics">
              <span>Market Intelligence</span>
              <span>Sourcing</span>
              <span>World Clean Expo</span>
            </div>
          </div>
          <HomeUpdatesForm />
        </div>
      </section>
    </main>
  );
}
