# Homepage Expo Color Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's dark-on-dark Expo strip with a clearly separated pale-blue, two-column invitation card while leaving `/wcb-expo` unchanged.

**Architecture:** The existing homepage Expo section remains in `app/page.tsx`, but gains explicit content and media wrappers so the Expo visual becomes a semantic `<img>` instead of a section background. Focused structure tests lock the new wrappers, image path, alt text, and CTA; responsive CSS supplies the desktop two-column and mobile stacked layouts.

**Tech Stack:** Next.js App Router, React/TSX, plain CSS, Node test runner, existing static image assets.

## Global Constraints

- Update only the homepage Expo invitation section and its related styles.
- Preserve the approved event name, date, venue, invitation message, destination link, and `/images/expo/wcb-expo-2026-hero.png` asset.
- Do not change the `/wcb-expo` page, global navigation, or other homepage sections.
- Use `#eef5ff` for the section background, `#ffffff` for the card, `#082a52` for headings, `#2f6bff` for accents, `#52677d` for supporting copy, and `#d6e3f3` for the border.
- Stack content above the image on mobile, keep event facts visible, make the CTA full width, and prevent horizontal overflow at 390px.

---

### Task 1: Lock and implement the new homepage Expo card

**Files:**
- Modify: `tests/homepageStructure.test.mjs`
- Modify: `app/page.tsx:164-190`
- Modify: `app/globals.css:563-651,684-692,819-849,25456-25468`

**Interfaces:**
- Consumes: existing `/images/expo/wcb-expo-2026-hero.png` static asset and `/wcb-expo#visitor-interest` route.
- Produces: `.home-v9-expo-campaign-content` and `.home-v9-expo-campaign-media` wrappers used by responsive CSS and source-level tests.

- [ ] **Step 1: Extend the focused structure test so it fails against the dark strip**

Add these assertions to `homepage gives the confirmed 2026 WCB Expo an immediate visitor entry`:

```js
assert.match(homeSource, /className="home-v9-expo-campaign-content"/);
assert.match(homeSource, /className="home-v9-expo-campaign-media"/);
assert.match(homeSource, /src="\/images\/expo\/wcb-expo-2026-hero\.png"/);
assert.match(
  homeSource,
  /alt="WCB Expo visual showing cleaning appliances and an industry exhibition setting"/
);
assert.match(cssSource, /\.home-v9-expo-campaign\s*\{[^}]*background:\s*#eef5ff/s);
assert.doesNotMatch(
  cssSource,
  /\.home-v9-expo-campaign\s*\{[^}]*background-image:/s
);
```

- [ ] **Step 2: Run the focused test and confirm the new contract fails**

Run: `node --test tests/homepageStructure.test.mjs`

Expected: FAIL because the content/media wrappers and light section background do not exist yet.

- [ ] **Step 3: Restructure the Expo section into content and media columns**

Replace the current contents of `.home-v9-expo-campaign-grid` with:

```tsx
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
  <img
    src="/images/expo/wcb-expo-2026-hero.png"
    alt="WCB Expo visual showing cleaning appliances and an industry exhibition setting"
  />
</div>
```

- [ ] **Step 4: Replace the dark strip styles with the approved light card system**

Implement these exact layout rules in the existing campaign CSS block:

```css
.home-v9-expo-campaign {
  padding: 64px 0;
  background: #eef5ff;
}

.home-v9-expo-campaign-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.16fr) minmax(360px, 0.84fr);
  overflow: hidden;
  border: 1px solid #d6e3f3;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 22px 54px rgba(8, 42, 82, 0.1);
}

.home-v9-expo-campaign-content {
  display: grid;
  align-content: center;
  justify-items: start;
  padding: 48px;
}

.home-v9-expo-campaign-media img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 430px;
  object-fit: cover;
}
```

Update the existing mark, copy, facts, and override selectors so headings use `#082a52`, accents use `#2f6bff`, supporting text uses `#52677d`, and the CTA sits below the facts with `margin-top: 24px`. Remove the obsolete 1020px dark-strip grid override.

At `max-width: 720px`, apply:

```css
.home-v9-expo-campaign {
  padding: 40px 0;
}

.home-v9-expo-campaign-grid {
  grid-template-columns: 1fr;
  border-radius: 16px;
}

.home-v9-expo-campaign-content {
  padding: 30px 24px;
}

.home-v9-expo-campaign-copy h2 {
  font-size: clamp(2rem, 9vw, 2.25rem);
}

.home-v9-expo-campaign-content > .button {
  width: 100%;
}

.home-v9-expo-campaign-media img {
  min-height: 230px;
  aspect-ratio: 1.45;
}
```

- [ ] **Step 5: Run focused tests and confirm the contract passes**

Run: `node --test tests/homepageStructure.test.mjs`

Expected: all homepage structure tests PASS.

- [ ] **Step 6: Commit the tested homepage implementation**

```bash
git add app/page.tsx app/globals.css tests/homepageStructure.test.mjs
git commit -m "style: separate homepage Expo campaign"
```

### Task 2: Build and visually verify desktop and mobile

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/globals.css`
- Create: `.superpowers/verification/home-expo-light-desktop.png`
- Create: `.superpowers/verification/home-expo-light-mobile.png`

**Interfaces:**
- Consumes: Task 1's `.home-v9-expo-campaign-content` and `.home-v9-expo-campaign-media` layout.
- Produces: build evidence and viewport screenshots demonstrating the approved visual separation.

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: exit code 0, with `/` and `/wcb-expo` generated successfully.

- [ ] **Step 2: Start the local preview and inspect desktop**

Run the project's existing local preview workflow, open `/` at 1440×1000, and save `.superpowers/verification/home-expo-light-desktop.png`.

Verify:

- the dark hero ends before the pale-blue Expo zone;
- the invitation card is white and two-column;
- the image is on the right without distortion;
- the title, facts, and CTA are fully visible;
- the following category section returns to white.

- [ ] **Step 3: Inspect the 390px mobile layout**

Open `/` at 390×844 and save `.superpowers/verification/home-expo-light-mobile.png`.

Verify:

- content appears above the image;
- the headline has no awkward one-word overflow;
- the CTA spans the content width;
- date and venue remain visible;
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

- [ ] **Step 4: Check runtime quality and the internal Expo page boundary**

Verify the browser console has no errors on `/`. Open `/wcb-expo` and confirm its existing hero, sections, and layout are unchanged.

- [ ] **Step 5: Record verification without modifying unrelated files**

Run: `git status --short`

Expected: only the new verification screenshots remain unstaged; pre-existing `.superpowers/brainstorm/` and verification artifacts remain untouched.
