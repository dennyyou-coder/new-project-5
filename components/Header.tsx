"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TallyButton } from "@/components/LeadForms";
import { LISTED_HUB_CATEGORIES, HUB_CATEGORY_GROUPS } from "@/lib/hubCategories";
// Same dates as EXPO_2026 in lib/hubPresentation.ts, which is server-only and cannot load in this client component.
const EXPO_2026 = { name: "WCB Expo 2026", closesAt: Date.parse("2026-11-21T00:00:00+08:00") };
const EXPO_OPENS = Date.parse("2026-11-18T00:00:00+08:00");

/** The top bar's right-hand link: the expo countdown until it closes, then the events calendar. Worked out in the browser so cached pages stay current. */
function useExpoNote() {
  const [note, setNote] = useState<{ href: string; label: string }>({ href: "/wcb-expo", label: `${EXPO_2026.name} · 18–20 Nov · Suzhou` });
  useEffect(() => {
    const now = Date.now();
    if (now >= EXPO_2026.closesAt) {
      setNote({ href: "/events", label: "Industry events calendar" });
      return;
    }
    const days = Math.ceil((EXPO_OPENS - now) / 86400000);
    const when = days > 1 ? `opens in ${days} days` : days === 1 ? "opens tomorrow" : "on now";
    setNote({ href: "/wcb-expo", label: `${EXPO_2026.name} · 18–20 Nov · Suzhou · ${when}` });
  }, []);
  return note;
}

type NavLink = { href: string; label: string };
type NavMenu = { id: string; label: string; current: string[]; columns: { heading?: string; links: NavLink[] }[] };
type NavItem = ({ kind: "link" } & NavLink & { current?: string[] }) | ({ kind: "menu" } & NavMenu);

const NAV: NavItem[] = [
  { kind: "link", href: "/news", label: "News" },
  {
    kind: "menu",
    id: "categories",
    label: "Categories",
    current: ["/categories"],
    columns: HUB_CATEGORY_GROUPS.map((group) => ({
      heading: group.label,
      links: LISTED_HUB_CATEGORIES.filter((hub) => hub.group === group.slug).map((hub) => ({
        href: `/categories/${hub.slug}`,
        label: hub.name
      }))
    }))
  },
  { kind: "link", href: "/brands", label: "Companies" },
  {
    kind: "menu",
    id: "products",
    label: "Products",
    current: ["/products", "/equipment", "/components"],
    columns: [
      {
        links: [
          { href: "/products", label: "2026 models" },
          { href: "/equipment", label: "Equipment types" },
          { href: "/components", label: "Parts & components" }
        ]
      }
    ]
  },
  {
    kind: "menu",
    id: "insights",
    label: "Insights",
    current: ["/blog", "/guides", "/videos", "/reports", "/tools", "/recalls", "/launch-radar", "/rules-calendar"],
    columns: [
      {
        links: [
          { href: "/blog/archive", label: "Deep analysis" },
          { href: "/guides", label: "Guides" },
          { href: "/blog/series/building-worlds-no-1-cleaning-show-from-scratch", label: "Founder’s Journal" },
          { href: "/videos", label: "Videos" },
          { href: "/reports", label: "Reports" },
          { href: "/tools", label: "Tools & trackers" },
          { href: "/recalls", label: "Recall tracker" },
          { href: "/launch-radar", label: "Launch radar" }
        ]
      }
    ]
  },
  { kind: "link", href: "/markets", label: "Markets" },
  {
    kind: "menu",
    id: "about",
    label: "About",
    current: ["/about", "/contact", "/quality-compliance", "/sourcing"],
    columns: [
      {
        links: [
          { href: "/about", label: "About WCB" },
          { href: "/sourcing", label: "Sourcing services" },
          { href: "/contact", label: "Contact & partnerships" },
          { href: "/quality-compliance", label: "Quality & compliance" }
        ]
      }
    ]
  }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const expoNote = useExpoNote();
  const matches = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isCurrent = (item: NavItem) =>
    item.kind === "menu" ? item.current.some(matches) : (item.current ?? [item.href]).some(matches);

  function closeAll() {
    setIsMenuOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    closeAll();
  }, [pathname]);

  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);

  return (
    <header
      className="wcb-header"
      ref={root}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (openMenu) {
          root.current?.querySelector<HTMLButtonElement>(`[data-menu="${openMenu}"]`)?.focus();
          setOpenMenu(null);
        } else if (isMenuOpen) {
          setIsMenuOpen(false);
          root.current?.querySelector<HTMLButtonElement>(".wcb-header-toggle")?.focus();
        }
      }}
    >
      <div className="wcb-topbar">
        <div className="wcb-topbar-inner">
          <span>Global cleaning industry news and intelligence · Updated daily</span>
          <Link href={expoNote.href} onClick={closeAll}>{expoNote.label} →</Link>
        </div>
      </div>
      <div className="wcb-header-inner">
        <Link className="wcb-header-brand" href="/" onClick={closeAll} aria-label="World Clean Biz home">
          <span className="wcb-header-logo" aria-hidden="true">WCB</span>
          <span className="wcb-header-name">World Clean Biz</span>
        </Link>

        <Link className="wcb-header-search wcb-header-search--compact" href="/search" onClick={closeAll} aria-label="Search">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </Link>

        <button
          className="wcb-header-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setOpenMenu(null);
          }}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className={`wcb-header-panel${isMenuOpen ? " is-open" : ""}`}>
          <div className="wcb-header-actions">
            <Link className="wcb-header-search wcb-header-search--wide" href="/search" onClick={closeAll} aria-label="Search">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </Link>
            <Link className="wcb-header-expo" href="/wcb-expo" onClick={closeAll}>
              WCB Expo
            </Link>
            <TallyButton className="wcb-header-subscribe" ctaLocation="header_subscribe" form="newsletter">
              Subscribe
            </TallyButton>
          </div>

          <nav className="wcb-nav" id="main-navigation" aria-label="Main navigation">
            <ul className="wcb-nav-list">
              {NAV.map((item) =>
                item.kind === "link" ? (
                  <li key={item.href}>
                    <Link
                      className="wcb-nav-link"
                      href={item.href}
                      aria-current={isCurrent(item) ? "page" : undefined}
                      onClick={closeAll}
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li
                    key={item.id}
                    className="wcb-nav-group"
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                        setOpenMenu((current) => (current === item.id ? null : current));
                      }
                    }}
                  >
                    <button
                      className="wcb-nav-link wcb-nav-button"
                      type="button"
                      data-menu={item.id}
                      data-current={isCurrent(item) || undefined}
                      aria-expanded={openMenu === item.id}
                      aria-controls={`nav-menu-${item.id}`}
                      onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                    >
                      {item.label}
                      <span className="wcb-nav-caret" aria-hidden="true" />
                    </button>
                    <div
                      className={`wcb-nav-menu wcb-nav-menu-${item.columns.length}`}
                      id={`nav-menu-${item.id}`}
                      hidden={openMenu !== item.id}
                    >
                      {item.columns.map((column, index) => (
                        <div className="wcb-nav-column" key={column.heading ?? index}>
                          {column.heading ? <p className="wcb-nav-heading">{column.heading}</p> : null}
                          <ul>
                            {column.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  aria-current={pathname === link.href ? "page" : undefined}
                                  onClick={closeAll}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {item.id === "categories" ? (
                        <Link className="wcb-nav-all wcb-more" href="/categories" onClick={closeAll}>
                          All categories
                        </Link>
                      ) : null}
                    </div>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
