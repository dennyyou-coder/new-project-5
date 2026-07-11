import Link from "next/link";
import { HomeUpdatesForm } from "@/components/HomeUpdatesForm";
import { TallyButton } from "@/components/LeadForms";
import { getInsights, type Insight } from "@/lib/content";

const heroProducts = [
  { label: "Robot Vacuums", image: "/images/sourcing/robotic-vacuums.png", alt: "Robot vacuum product category", text: "New functions, brands and channels continue to reshape floorcare." },
  { label: "Floor Washers", image: "/images/sourcing/floor-washers.png", alt: "Hard floor washer product category", text: "Fast product iteration is expanding the hard-floor cleaning market." },
  { label: "Pool Robots", image: "/images/sourcing/pool-robots.png", alt: "Robotic pool cleaner product category", text: "Automated pool maintenance is moving into broader retail channels." },
  { label: "Robotic Lawn Mowers", image: "/images/sourcing/lawn-robots.png", alt: "Robotic lawn mower product category", text: "Outdoor robotics is entering a faster global adoption cycle." },
  { label: "Commercial Cleaning", image: "/images/sourcing/commercial-cleaning.png", alt: "Commercial cleaning robot product category", text: "Facilities and service operators are testing new automation models." },
  { label: "Emerging Categories", image: "/images/industry/home-industry-products-2025.jpg", alt: "Emerging cleaning product categories", text: "New equipment, components and formats are still taking shape." }
];

const pathways = [
  {
    number: "01",
    eyebrow: "Market Intelligence",
    title: "See The Shift Before It Becomes Obvious",
    text: "Follow category movement, companies, channels and product signals across the global cleaning industry.",
    image: "/images/sourcing/robotic-vacuums.png",
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
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    imageAlt: "Cleaning industry supplier and sourcing meeting",
    links: [{ href: "/sourcing", label: "Start A Sourcing Inquiry" }]
  },
  {
    number: "03",
    eyebrow: "World Clean Expo",
    title: "Move From Online Signals To Real Connections",
    text: "Meet manufacturers, brands, suppliers and buyers through the next global cleaning industry platform.",
    image: "/images/industry/expo-hall-shenzhen-2026.jpg",
    imageAlt: "Cleaning equipment exhibition and industry connections",
    links: [{ href: "/world-clean-expo", label: "Explore World Clean Expo" }]
  }
];

const fallbackInsightImages = [
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/sourcing-hero-expo-products-2026.jpg",
  "/images/industry/home-industry-products-2025.jpg"
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
              Denny You has spent 20 years working across products, brands,
              suppliers, forums and exhibitions in the global cleaning industry.
              World Clean Biz turns that first-hand network into clearer market
              judgement and more useful business connections.
            </p>
            <ul>
              <li><strong>20 years</strong><span>Across products and supply chains</span></li>
              <li><strong>Industry network</strong><span>Brands, suppliers, buyers and experts</span></li>
              <li><strong>Real access</strong><span>Forums, exhibitions and factory conversations</span></li>
            </ul>
            <Link className="home-v9-inline-link" href="/about">About Denny & World Clean Biz →</Link>
          </div>
          <div className="home-v9-trust-gallery">
            <figure className="home-v9-trust-main">
              <img src="/images/industry/about-denny-speaking-forum-2025.jpg" alt="Denny speaking at an industry forum" />
              <figcaption>Denny You · Founder, World Clean Biz</figcaption>
            </figure>
            <figure>
              <img src="/images/industry/sourcing-supplier-meeting-2026.jpg" alt="Supplier meeting at a cleaning industry exhibition" />
              <figcaption>Supplier Network</figcaption>
            </figure>
            <figure>
              <img src="/images/industry/expo-hall-shenzhen-2026.jpg" alt="World Clean Expo exhibition floor" />
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
            <small>Draft layout copy — replace with approved client feedback before production.</small>
          </div>
          <div className="home-v9-testimonial-grid">
            <article>
              <div className="home-v9-testimonial-avatar home-v9-avatar-founder" role="img" aria-label="Fictional placeholder portrait for European floorcare brand founder" />
              <span aria-hidden="true">“</span>
              <blockquote>
                Denny understands the cleaning industry from both the product
                and business sides. His perspective helped us see the category
                more clearly and ask better questions before making decisions.
              </blockquote>
              <p>Founder · European Floorcare Brand</p>
            </article>
            <article>
              <div className="home-v9-testimonial-avatar home-v9-avatar-sourcing" role="img" aria-label="Fictional placeholder portrait for North American distributor sourcing director" />
              <span aria-hidden="true">“</span>
              <blockquote>
                Denny combines long-term industry experience with practical
                knowledge of suppliers and product development. Conversations
                with him are focused, direct and commercially useful.
              </blockquote>
              <p>Sourcing Director · North American Distributor</p>
            </article>
            <article>
              <div className="home-v9-testimonial-avatar home-v9-avatar-founder" role="img" aria-label="Fictional placeholder portrait for European floorcare brand founder" />
              <span aria-hidden="true">“</span>
              <blockquote>
                WCB brought useful context to the sourcing process—from product
                trends and supplier capabilities to the practical questions we
                needed to ask before making a decision.
              </blockquote>
              <p>Founder · European Floorcare Brand</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-v9-section home-v9-commercial">
        <div className="home-v9-container">
          <div className="home-v9-heading home-v9-heading-light">
            <p className="home-v9-eyebrow">From Insight To Opportunity</p>
            <h2>Two Direct Business Paths</h2>
          </div>
          <div className="home-v9-commercial-grid">
            <article>
              <p>Product & Supply Chain</p>
              <h3>Sourcing & Product Support</h3>
              <div>For buyers, brands and product teams looking for suppliers, OEM/ODM partners, product direction or execution support.</div>
              <Link className="button" href="/sourcing">Start A Sourcing Inquiry</Link>
            </article>
            <article>
              <p>World Clean Expo</p>
              <h3>Exhibit, Partner Or Follow The Show</h3>
              <div>Connect with the platform as an exhibitor or partner, or receive visitor registration and event updates.</div>
              <div className="home-v9-wce-actions">
                <TallyButton ctaLocation="home_wce_exhibitor" form="wceExhibitor">Exhibit / Partner</TallyButton>
                <TallyButton className="button-secondary" ctaLocation="home_wce_visitor" form="wceVisitor">Visit / Get Updates</TallyButton>
              </div>
            </article>
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
