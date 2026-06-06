"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/" onClick={closeMenu}>
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
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label="Toggle main navigation"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div className={`header-actions${isMenuOpen ? " is-menu-open" : ""}`}>
          <nav
            className={`nav${isMenuOpen ? " is-open" : ""}`}
            id="main-navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link href={item.href} key={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="header-cta" href="/reports" onClick={closeMenu}>
            Get Free Reports
          </Link>
        </div>
      </div>
    </header>
  );
}
