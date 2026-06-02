import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/insights", label: "Insights" },
  { href: "/sourcing", label: "Sourcing" },
  { href: "/market-reports", label: "Market Reports" },
  { href: "/world-clean-expo", label: "World Clean Expo" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-name">World Clean Biz</span>
          <span className="brand-tagline">Industry Intelligence & Sourcing</span>
        </Link>
        <nav className="nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
