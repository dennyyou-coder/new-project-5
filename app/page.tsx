import Link from "next/link";
import { HomeUpdatesForm } from "@/components/HomeUpdatesForm";
import { TallyReportButton } from "@/components/LeadForms";
import { getInsights, type Insight } from "@/lib/content";
import { TALLY_FORMS } from "@/lib/tallyForms";

const heroProducts = [
  {
    label: "Robot Vacuums",
    image: "/images/sourcing/robotic-vacuums.png",
    alt: "Robot vacuum product category"
  },
  {
    label: "Floor Washers",
    image: "/images/sourcing/floor-washers.png",
    alt: "Hard floor washer product category"
  },
  {
    label: "Pool Robots",
    image: "/images/sourcing/pool-robots.png",
    alt: "Robotic pool cleaner product category"
  },
  {
    label: "Robotic Lawn Mowers",
    image: "/images/sourcing/lawn-robots.png",
    alt: "Robotic lawn mower product category"
  },
  {
    label: "Commercial Cleaning",
    image: "/images/sourcing/commercial-cleaning.png",
    alt: "Commercial cleaning robot product category"
  },
  {
    label: "Emerging Categories",
    image: "/images/industry/home-industry-products-2025.jpg",
    alt: "Emerging cleaning product categories"
  }
];

const patternCards = [
  {
    step: "01",
    title: "Technology Breakthrough",
    text: "Automation becomes reliable enough for daily use."
  },
  {
    step: "02",
    title: "Early Adoption",
    text: "Early users prove the product solves a real problem."
  },
  {
    step: "03",
    title: "Brand And Supplier Expansion",
    text: "New factories, brands and channels enter quickly."
  },
  {
    step: "04",
    title: "Mainstream Category",
    text: "The product becomes a standard appliance or business tool."
  }
];

const categoryCards = [
  {
    title: "Robotic Vacuums",
    image: "/images/sourcing/robotic-vacuums.png",
    text: "The all-in-one robot vacuum is becoming a mainstream household appliance."
  },
  {
    title: "Hard Floor Washers",
    image: "/images/sourcing/floor-washers.png",
    text: "A fast-growing floorcare category changing how homes are cleaned."
  },
  {
    title: "Robotic Lawn Mowers",
    image: "/images/sourcing/lawn-robots.png",
    text: "Outdoor robots are following the path once taken by robot vacuums."
  },
  {
    title: "Pool Robots",
    image: "/images/sourcing/pool-robots.png",
    text: "Automated pool maintenance is moving into consumer channels."
  },
  {
    title: "Commercial Cleaning Robots",
    image: "/images/sourcing/commercial-cleaning.png",
    text: "Commercial robots are entering buildings, facilities and service operations."
  },
  {
    title: "Emerging Categories",
    image: "/images/industry/home-industry-products-2025.jpg",
    text: "The next major cleaning category may still be early, fragmented or overlooked."
  }
];

const dennyPhotos = [
  {
    label: "Public Speaking",
    image: "/images/industry/about-denny-speaking-forum-2025.jpg",
    alt: "Denny speaking at a cleaning industry forum"
  },
  {
    label: "2025 Cleaning Forum",
    image: "/images/industry/about-forum-audience-2025.jpg",
    alt: "Cleaning industry forum audience"
  },
  {
    label: "World Clean Expo",
    image: "/images/industry/expo-hall-shenzhen-2026.jpg",
    alt: "World Clean Expo exhibition floor"
  },
  {
    label: "Supplier Meeting",
    image: "/images/industry/sourcing-supplier-meeting-2026.jpg",
    alt: "Supplier meeting at a cleaning industry exhibition"
  },
  {
    label: "Factory Visit",
    image: "/images/industry/sourcing-product-components-2025.jpg",
    alt: "Cleaning product components during a factory visit"
  },
  {
    label: "Industry Meetup",
    image: "/images/industry/about-forum-stage-2025.jpg",
    alt: "Cleaning industry meetup stage"
  }
];

const dennyFocus = [
  {
    title: "Market Intelligence",
    text: "Spot early category signals."
  },
  {
    title: "Industry Connections",
    text: "Connect brands and suppliers."
  },
  {
    title: "Actionable Insights",
    text: "Turn signals into decisions."
  },
  {
    title: "Global Perspective",
    text: "Read changes across markets."
  }
];

const dennyJourney = [
  {
    year: "2006",
    title: "Industry Operator",
    text: "Worked across products, brands and supply chains."
  },
  {
    year: "2009",
    title: "Product Builder",
    text: "Built and supported cleaning product businesses."
  },
  {
    year: "2017",
    title: "Industry Author & Influencer",
    text: "Started publishing industry articles and videos."
  },
  {
    year: "2019",
    title: "Industry Forum Organizer",
    text: "Hosted forums connecting brands and suppliers."
  },
  {
    year: "2020",
    title: "Investor & Analyst Speaker",
    text: "Shared insights with investors and financial firms."
  },
  {
    year: "2025+",
    title: "World Clean Expo & Global Network",
    text: "Building a global cleaning industry network."
  }
];

const sourcingItems = [
  {
    step: "01",
    title: "Find Hot-Selling Products Faster",
    text: "Identify proven product opportunities earlier."
  },
  {
    step: "02",
    title: "Build Exclusive Products",
    text: "Develop differentiated products with stronger margins."
  },
  {
    step: "03",
    title: "Turn Market Signals Into Product Ideas",
    text: "Transform industry intelligence into product direction."
  },
  {
    step: "04",
    title: "One-Stop Support From Idea To Production",
    text: "Move from concept to manufacturing faster."
  },
  {
    step: "05",
    title: "Improve Quality And Reduce After-Sales Risk",
    text: "Strengthen supplier selection and quality control."
  },
  {
    step: "06",
    title: "Get Continuous New Product Updates",
    text: "Stay close to category shifts and supplier movement."
  },
  {
    step: "07",
    title: "Build Flexible Global Production Options",
    text: "Support production across multiple regions."
  },
  {
    step: "08",
    title: "Control Competitiveness From The Component Supply Chain",
    text: "Create advantage from key components upward."
  }
];

const reportCovers = [
  {
    title: "Robotic Mower Market Report",
    category: "Outdoor Robotics",
    meta: "June 2025 · 28 pages"
  },
  {
    title: "Pool Robot Market Report",
    category: "Pool Cleaning",
    meta: "May 2025 · 24 pages"
  },
  {
    title: "Vacuum Cleaner Industry Report",
    category: "Floorcare",
    meta: "April 2025 · 32 pages"
  },
  {
    title: "Cleaning Industry Outlook",
    category: "Market Trends",
    meta: "2025 Edition · 36 pages"
  }
];

const fallbackInsightImages = [
  "/images/industry/expo-booth-cleaning-suppliers-2026.jpg",
  "/images/industry/sourcing-hero-expo-products-2026.jpg",
  "/images/industry/home-industry-products-2025.jpg",
  "/images/industry/reports-market-preview-products-2025.jpg"
];

function getFeaturedInsights(articles: Insight[]) {
  const selected = articles.filter((article) => article.featured);
  const candidates = selected.length >= 4 ? selected : [...selected, ...articles];
  const unique = new Map<string, Insight>();

  for (const article of candidates) {
    unique.set(article.slug, article);
    if (unique.size === 4) break;
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
    <main className="home-v8">
      <section className="home-v8-hero">
        <div className="home-v8-container home-v8-hero-grid">
          <div className="home-v8-hero-copy">
            <p className="home-v8-eyebrow">Global Cleaning Industry Opportunities</p>
            <h1>
              <span className="home-v8-hero-category-line">
                Robot Vacuums. Floor Washers. Pool Robots. Robotic Lawn Mowers.
              </span>
              <strong>
                Together They Are Creating
                <br />
                An Entirely New Cleaning Industry.
              </strong>
            </h1>
            <div className="home-v8-hero-text">
              <p>
                What happened to robot vacuums over the last decade is beginning
                to happen across multiple cleaning categories.
              </p>
              <p>
                The cleaning industry could grow from a $40B business into a
                $100B market over the next decade.
              </p>
            </div>
            <div className="home-v8-actions">
              <Link className="button" href="/insights">
                Explore Growth Signals
              </Link>
              <TallyReportButton className="button-secondary" />
            </div>
          </div>

          <div className="home-v8-product-stage" aria-label="Cleaning automation product categories">
            <div className="home-v8-product-orbit" />
            {heroProducts.map((product, index) => (
              <figure className={`home-v8-product-card home-v8-product-card-${index + 1}`} key={product.label}>
                <img src={product.image} alt={product.alt} />
                <figcaption>{product.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v8-section home-v8-pattern-section">
        <div className="home-v8-container">
          <div className="home-v8-pattern-head">
            <div>
              <p className="home-v8-eyebrow">The Pattern</p>
              <h2>We&apos;ve Seen This Story Before.</h2>
            </div>
            <div className="home-v8-pattern-copy">
              <p>Fifteen years ago, robot vacuums were a niche product.</p>
              <p>Today they are a mainstream household appliance.</p>
              <p>
                Now the same pattern is beginning to appear in robotic lawn
                mowers, pool robots, commercial cleaning and other emerging
                categories.
              </p>
              <p>
                The companies that recognize the pattern early usually capture
                the biggest opportunities.
              </p>
            </div>
          </div>
          <div className="home-v8-timeline">
            {patternCards.map((card) => (
              <article className="home-v8-card home-v8-timeline-card" key={card.step}>
                <span>{card.step}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v8-section home-v8-soft home-v8-categories-section">
        <div className="home-v8-container">
          <div className="home-v8-centered-head">
            <p className="home-v8-eyebrow">Where The Growth Is Happening</p>
            <h2>Six Categories Shaping The Next Decade Of Cleaning</h2>
            <p>The same adoption cycle is now happening across multiple categories.</p>
          </div>
          <div className="home-v8-category-grid">
            {categoryCards.map((category, index) => (
              <article className="home-v8-card home-v8-category-card" key={category.title}>
                <img src={category.image} alt={`${category.title} category`} />
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{category.title}</h3>
                  <p>{category.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v8-section home-v8-denny-section">
        <div className="home-v8-container home-v8-denny-grid">
          <div className="home-v8-section-copy">
            <p className="home-v8-eyebrow">Inside The Industry Since 2006</p>
            <div className="home-v8-denny-id">
              <img src="/images/industry/about-denny-speaking-forum-2025.jpg" alt="Denny speaking at an industry forum" />
              <div>
                <strong>Denny You</strong>
                <span>Founder, World Clean Biz</span>
              </div>
            </div>
            <h2>Why Thousands Of Industry Professionals Follow Denny</h2>
            <div className="home-v8-denny-copy">
              <p>
                Since 2006, Denny has worked across products, brands, and
                supply chains in the global cleaning industry.
              </p>
              <p>
                Over the past 20 years, he has held multiple roles—as
                practitioner, industry influencer, and forum/expo organizer—
                witnessing the rise of new players and the fall of established
                giants.
              </p>
            </div>
            <div className="home-v8-focus-block">
              <h3>Core Focus</h3>
              <div className="home-v8-focus-grid">
                {dennyFocus.map((item) => (
                  <article key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <Link className="button-secondary" href="/about">
              About Denny
            </Link>
          </div>
          <div className="home-v8-denny-gallery">
            {dennyPhotos.map((photo) => (
              <figure className="home-v8-denny-photo" key={photo.label}>
                <img src={photo.image} alt={photo.alt} />
                <figcaption>{photo.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="home-v8-container home-v8-journey-band">
          <div className="home-v8-journey-head">
            <h3>Denny&apos;s Industry Journey</h3>
          </div>
          <div className="home-v8-journey-line" aria-hidden="true" />
          <div className="home-v8-journey-grid">
            {dennyJourney.map((item) => (
              <article className="home-v8-card home-v8-journey-card" key={item.year}>
                <span>{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v8-section home-v8-soft home-v8-expo-section">
        <div className="home-v8-container home-v8-expo-grid">
          <div className="home-v8-section-copy">
            <p className="home-v8-eyebrow">World Clean Expo</p>
            <h2>
              From Online Signals
              <span>To Real Industry Connections</span>
            </h2>
            <p>Meet manufacturers, brands, suppliers and buyers face-to-face.</p>
            <p>
              World Clean Expo brings together brands, OEM manufacturers,
              upstream and downstream suppliers, and service providers in one
              place.
            </p>
            <div className="home-v8-actions">
              <Link className="button" href="/world-clean-expo">
                Explore World Clean Expo
              </Link>
              <Link
                className="button-secondary"
                href={TALLY_FORMS.expo.url}
                target="_blank"
              >
                Get Expo Updates
              </Link>
            </div>
          </div>
          <div className="home-v8-expo-image">
            <img src="/images/industry/world-clean-expo-global-tech-2026.png" alt="Large international cleaning technology exhibition floor" />
          </div>
        </div>
      </section>

      <section className="home-v8-section home-v8-sourcing-section">
        <div className="home-v8-container home-v8-sourcing-grid">
          <div className="home-v8-section-copy">
            <p className="home-v8-eyebrow">Sourcing Service</p>
            <h2>Supplier Discovery For Cleaning Products</h2>
            <p>
              Find reliable manufacturers, compare products and connect with
              factories across the global cleaning supply chain.
            </p>
            <Link
              className="button"
              href={TALLY_FORMS.sourcing.url}
              target="_blank"
            >
              Start Sourcing
            </Link>
          </div>
          <div className="home-v8-sourcing-items">
            {sourcingItems.map((item) => (
              <article className="home-v8-card home-v8-sourcing-card" key={item.title}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v8-section home-v8-soft home-v8-insights-section">
        <div className="home-v8-container">
          <div className="home-v8-resource-head">
            <p className="home-v8-eyebrow">What We&apos;re Seeing Right Now</p>
            <h2>Industry Signals Worth Watching</h2>
            <p>
              Read signals and follow category changes before they become
              obvious.
            </p>
          </div>
          <div className="home-v8-insight-list">
            {featuredInsights.map((article, index) => (
              <Link className="home-v8-card home-v8-mini-article" href={`/insights/${article.slug}`} key={article.slug}>
                <img src={imageFor(article, index)} alt={`${article.title} cover image`} />
                <div>
                  <span>{article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{excerptFor(article)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v8-section home-v8-reports-section">
        <div className="home-v8-container home-v8-reports-grid">
          <div className="home-v8-section-copy">
            <p className="home-v8-eyebrow">Free Industry Reports</p>
            <h2>Research You Can Actually Use</h2>
            <p>
              Download category reports built from market signals, supplier
              observations and front-line industry research.
            </p>
            <Link className="button" href="/reports">
              Browse Reports
            </Link>
          </div>
          <div className="home-v8-report-covers">
            {reportCovers.map((report) => (
              <Link className="home-v8-report-cover" href="/reports" key={report.title}>
                <small>World Clean Biz</small>
                <strong>
                  <span>2025</span>
                  {report.title}
                </strong>
                <i>{report.category}</i>
                <b>{report.meta}</b>
                <em>FREE</em>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-v8-final">
        <div className="home-v8-container home-v8-final-grid">
          <div className="home-v8-final-copy">
            <p className="home-v8-eyebrow">Don&apos;t Hear About It A Year Later</p>
            <h2>
              The Next Opportunity
              <span>May Already Be Happening.</span>
            </h2>
            <p>Get industry signals, market reports and expo updates.</p>
          </div>
          <HomeUpdatesForm />
        </div>
      </section>
    </main>
  );
}
