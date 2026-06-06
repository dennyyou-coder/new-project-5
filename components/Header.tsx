import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/insights", label: "Insights" },
  { href: "/sourcing", label: "Sourcing" },
  { href: "/reports", label: "Market Reports" },
  { href: "/world-clean-expo", label: "World Clean Expo" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-core">W</span>
          </span>
          <span className="brand-copy">
            <span className="brand-name">World Clean Biz</span>
            <span className="brand-tagline">
              Global Cleaning Industry Intelligence
            </span>
          </span>
        </Link>
        <div className="header-actions">
          <nav className="nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="header-cta" href="/reports">
            Get Free Reports
          </Link>
        </div>
      </div>
    </header>
  );
}
