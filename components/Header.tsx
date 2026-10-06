"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const groups = [
  {
    label: "Insights",
    links: [
      { href: "/blog", label: "Analysis & Insights" },
      {
        href: "/blog/series/building-worlds-no-1-cleaning-show-from-scratch",
        label: "Founder Series",
      },
      { href: "/guides", label: "Practical Guides" },
      { href: "/reports", label: "Industry Reports" },
    ],
  },
  {
    label: "Companies & Products",
    links: [
      { href: "/brands", label: "Companies & Brands" },
      { href: "/products", label: "Product Library" },
    ],
  },
];
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  function closeMenu() {
    setIsMenuOpen(false);
    setOpenGroup(null);
  }
  useEffect(() => {
    closeMenu();
  }, [pathname]);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) closeMenu();
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return (
    <header
      className="header refresh-header"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (openGroup) {
            root.current
              ?.querySelector<HTMLButtonElement>(`[data-group="${openGroup}"]`)
              ?.focus();
            setOpenGroup(null);
          } else {
            setIsMenuOpen(false);
            root.current
              ?.querySelector<HTMLButtonElement>(".mobile-menu-toggle")
              ?.focus();
          }
        }
      }}
    >
      <div className="container header-inner">
        <Link
          className="brand"
          href="/"
          onClick={closeMenu}
          aria-label="World Clean Biz home"
        >
          <span className="brand-wcb-block" aria-hidden="true">
            WCB
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
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setOpenGroup(null);
          }}
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
            <Link href="/news" aria-current={isCurrent("/news") ? "page" : undefined} onClick={closeMenu}>
              News
            </Link>
            {groups.map((group, index) => (
              <div
                className="nav-group"
                key={group.label}
                onBlur={(event) => {
                  if (
                    !event.currentTarget.contains(event.relatedTarget as Node)
                  )
                    setOpenGroup(null);
                }}
              >
                <button
                  type="button"
                  data-group={group.label}
                  data-current={group.links.some((link) => isCurrent(link.href)) || undefined}
                  aria-expanded={openGroup === group.label}
                  aria-controls={`nav-group-${index}`}
                  onClick={() =>
                    setOpenGroup(openGroup === group.label ? null : group.label)
                  }
                >
                  {group.label}
                  <span className="nav-expand-indicator" aria-hidden="true">{openGroup === group.label ? "−" : "+"}</span>
                </button>
                <div
                  className="nav-submenu"
                  id={`nav-group-${index}`}
                  hidden={openGroup !== group.label}
                >
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={closeMenu}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/videos" aria-current={isCurrent("/videos") ? "page" : undefined} onClick={closeMenu}>
              Videos
            </Link>
            <Link href="/wcb-expo" aria-current={isCurrent("/wcb-expo") ? "page" : undefined} onClick={closeMenu}>
              WCB Expo
            </Link>
            <Link href="/about" aria-current={isCurrent("/about") ? "page" : undefined} onClick={closeMenu}>
              About
            </Link>
            <Link className="nav-business" href="/contact" aria-current={isCurrent("/contact") ? "page" : undefined} onClick={closeMenu}>
              Work With WCB
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
