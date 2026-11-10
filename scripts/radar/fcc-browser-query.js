/**
 * FCC filings for /launch-radar. The FCC search only answers a normal browser, so this runs in the
 * browser console (or Claude's browser pane) on https://apps.fcc.gov/oetcf/eas/reports/GenericSearch.cfm.
 *
 *   1. Paste this file into the console, then run:
 *        await wcbFccQuery(["Roborock", "Ecovacs", ...], "11/01/2026", "11/14/2026")
 *      (the search terms are the `search` lists in content/radar/fcc-filings.json).
 *   2. Save the printed JSON as scratch/fcc-rows.json and run
 *        node --experimental-strip-types scripts/radar/merge-fcc.mjs scratch/fcc-rows.json
 */
async function wcbFccQuery(terms, from, to) {
  const form = document.querySelector("form");
  const rows = [];
  for (const term of terms) {
    const data = new FormData(form);
    data.set("applicant_name", term);
    data.set("grant_date_from", from);
    data.set("grant_date_to", to);
    data.set("outputformat", "XML");
    data.set("show_records", "2000");
    const xml = await fetch(form.action, { method: "POST", body: new URLSearchParams(data) }).then((response) => response.text());
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const value = (row, tag) => (row.querySelector(tag)?.textContent ?? "").trim();
    for (const row of doc.querySelectorAll("Row")) {
      rows.push({
        t: term,
        a: value(row, "applicant_name"),
        id: value(row, "fcc_id"),
        d: value(row, "grant_date"),
        p: value(row, "application_purpose"),
        f: [`${value(row, "lower_freq_mhz").split(".")[0]}-${value(row, "upper_freq_mhz").split(".")[0]}`]
      });
    }
  }
  return JSON.stringify(rows);
}
