import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL;

if (!baseUrl) {
  throw new Error("TEST_BASE_URL is required");
}

async function page(pathname) {
  const response = await fetch(new URL(pathname, baseUrl));
  assert.equal(response.status, 200, `${pathname} should return 200`);
  return response.text();
}

function occurrences(source, pattern) {
  return (source.match(pattern) || []).length;
}

function includesMatch(source, pattern, message) {
  assert.ok(pattern.test(source), message);
}

function excludesMatch(source, pattern, message) {
  assert.ok(!pattern.test(source), message);
}

test("Blog landing stays on the approved six-card layout", async () => {
  const html = await page("/blog");

  includesMatch(html, /class="blog-home-main"/, "Blog keeps its approved layout");
  includesMatch(html, />View all analysis</, "Blog keeps the analysis link");
  includesMatch(html, />Browse all guides</, "Blog keeps the guides link");
  excludesMatch(
    html,
    /class="[^"]*content-directory-layout[^"]*"/,
    "Blog does not inherit the directory layout"
  );
});

test("Analysis archive renders ten linked feed rows and a sidebar", async () => {
  const html = await page("/blog/archive");

  includesMatch(html, /id="analysis"/, "Archive preserves the analysis anchor");
  includesMatch(html, />Analysis &amp; Insights</, "Archive has the analysis title");
  includesMatch(
    html,
    /class="[^"]*content-directory-layout[^"]*"/,
    "Archive uses the directory layout"
  );
  includesMatch(html, /class="content-directory-sidebar"/, "Archive has the sidebar");
  assert.equal(
    occurrences(html, /class="content-directory-feed-item"/g),
    10
  );
  excludesMatch(
    html,
    />Guides &amp; Comparisons</,
    "Archive does not append guides below analysis"
  );
});

test("Analysis pagination and filters are server rendered", async () => {
  const html = await page(
    "/blog/archive?category=Robotic%20Mowers&page=2"
  );

  includesMatch(html, /aria-current="page"[^>]*>2</, "Page 2 is selected");
  includesMatch(html, /content="noindex, follow"/, "Filtered pages are noindex");
  includesMatch(html, /category=Robotic\+Mowers/, "Pagination preserves the category");
  assert.ok(
    occurrences(html, /class="content-directory-feed-item"/g) <= 10
  );
});

test("Analysis root shows the series, full company index and curated sidebar", async () => {
  const html = await page("/blog/archive");
  includesMatch(
    html,
    /class="[^"]*content-directory-series[^"]*"/,
    "Analysis shows the series"
  );
  includesMatch(html, />Denny You</, "Analysis shows the author profile");
  includesMatch(
    html,
    />Company &amp; Brand Index</,
    "Analysis shows the company index"
  );
  includesMatch(html, />Important Analysis</, "Analysis shows curated articles");
  excludesMatch(html, />View all company/i, "All company keywords are directly visible");
  includesMatch(html, /company=dji-romo/, "Company keywords are linked filters");
});

test("Analysis company filters replace category state and preserve pagination", async () => {
  const html = await page(
    "/blog/archive?company=dji-romo&category=Robotic%20Mowers"
  );
  excludesMatch(
    html,
    /class="[^"]*content-directory-series[^"]*"/,
    "Filtered Analysis omits the series"
  );
  includesMatch(
    html,
    /aria-current="page"[^>]*>DJI \/ ROMO</,
    "Company is active"
  );
  includesMatch(
    html,
    /company=dji-romo&amp;page=2/,
    "Company pagination is preserved"
  );
  excludesMatch(
    html,
    /href="\/blog\/archive\?company=[^"]*(?:&amp;|&)category=/,
    "Company links do not retain category"
  );
  excludesMatch(
    html,
    /href="\/blog\/archive\?category=[^"]*(?:&amp;|&)company=/,
    "Category links do not retain company"
  );
  includesMatch(html, /content="noindex, follow"/, "Company filters are noindex");
});

test("Guides directory renders ten guide rows and guide-type navigation", async () => {
  const html = await page("/guides");

  includesMatch(html, />Industry Guides</, "Guides has the directory title");
  includesMatch(
    html,
    /class="[^"]*content-directory-layout[^"]*"/,
    "Guides uses the directory layout"
  );
  includesMatch(html, /class="content-directory-sidebar"/, "Guides has the sidebar");
  includesMatch(html, /href="\/guides\/ownership"/, "Guides exposes type navigation");
  assert.equal(
    occurrences(html, /class="content-directory-feed-item"/g),
    10
  );
});

test("Guide category pages reuse the directory and preserve paginated canonicals", async () => {
  const html = await page("/guides/ownership?page=2");

  includesMatch(html, />Brand Ownership</, "Ownership page has its title");
  includesMatch(
    html,
    /class="[^"]*content-directory-layout[^"]*"/,
    "Ownership uses the directory"
  );
  includesMatch(html, /aria-current="page"[^>]*>2</, "Page 2 is selected");
  includesMatch(html, /content="noindex, follow"/, "Paginated guides are noindex");
  includesMatch(
    html,
    /rel="canonical" href="https:\/\/worldcleanbiz\.com\/guides\/ownership"/,
    "Ownership keeps the canonical URL"
  );
  assert.equal(
    occurrences(html, /class="content-directory-feed-item"/g),
    10
  );
});
