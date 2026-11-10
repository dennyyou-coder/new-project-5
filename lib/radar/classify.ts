/**
 * Sorts official recall notices into the three sectors WCB covers. Used by the weekly fetch script
 * (scripts/radar/fetch-recalls.mjs) and the tests; the site itself reads the curated JSON.
 */

export type Sector = "cleaning" | "appliances" | "tools";

export const SECTORS: { value: Sector; label: string }[] = [
  { value: "cleaning", label: "Cleaning appliances" },
  { value: "appliances", label: "Home appliances" },
  { value: "tools", label: "Power tools and outdoor" }
];

// Order matters: the first sector whose words match wins, so "pressure washer" is cleaning, not tools.
const RULES: [Sector, RegExp][] = [
  // Words that would otherwise land in the wrong sector.
  ["appliances", /\b(hair ?(dryer|straightener|curler|clipper|trimmer|styler)|dryer brush|curling (iron|wand)|meat grinder|coffee grinder|spice grinder)\b/],
  ["tools", /\b(leaf vacuums?|blower vacs?|soldering irons?|garden vacuums?)\b/],
  ["cleaning", /\b(vacuum|robot(ic)? (cleaner|mop)|steam (mop|cleaner)|carpet (cleaner|washer)|floor (cleaner|scrubber|washer)|wet[- ]dry|pressure washer|power washer|window cleaning robot|pool (cleaner|robot)|cleaning equipment|mop\b)/],
  ["tools", /\b(drill|saw|chainsaw|chain saw|grinder|sander|nailer|nail gun|impact (driver|wrench)|power tool|multi-?tool|rotary tool|heat gun|lawn ?mower|mower|string trimmer|grass trimmer|hedge trimmer|trimmer|edger|leaf blower|blower|tiller|cultivator|snow ?blower|snow thrower|log splitter|generator|welder|air compressor|tool battery|battery pack for tools|jump starter|chipper|pruner|weed eater)\b/],
  ["appliances", /\b(refrigerator|fridge|freezer|dishwasher|washing machine|washer|clothes dryer|dryer|tumble dryer|oven|range|cooktop|hob|stove|microwave|toaster|air fryer|fryer|kettle|coffee (maker|machine)|espresso|blender|food processor|mixer|slow cooker|pressure cooker|multicooker|multi-cooker|rice cooker|electric grill|griddle|waffle|sandwich maker|juicer|ice maker|wine cooler|heater|space heater|radiator|fan heater|fan|air conditioner|dehumidifier|humidifier|air purifier|water heater|boiler|hair ?dryer|hair straightener|curling|hair styler|electric blanket|heating pad|iron\b|steam iron|garment steamer|induction|hot plate|dispenser|water cooler|sous vide|food warmer|soup maker|yogurt maker|bread maker|grill)\b/]
];

/** Products that share appliance words but are out of scope. */
const EXCLUDE = /\b(toy|toys|child(ren)?'?s?|baby|infant|doll|costume|e-?bike|bicycle|scooter|motorcycle|atv|vehicle|car seat|phone charger|usb charger|power bank|cable|lamp|light(ing)?|led strip|christmas|candle|sauna|cosmetic|toothbrush|massager|vape|e-cigarette|helmet|clothing|jacket|fan(s)? club|hand fan|neck fan|ceiling fan light|grill brush(es)?|bristle|fuel containers?)\b/;

export function classifyRecall(text: string): Sector | null {
  const value = text.toLowerCase();
  if (EXCLUDE.test(value)) return null;
  for (const [sector, rule] of RULES) if (rule.test(value)) return sector;
  return null;
}

export type Recall = {
  id: string;
  source: "CPSC" | "EU Safety Gate";
  /** ISO date the notice was published. */
  date: string;
  sector: Sector;
  product: string;
  brand?: string;
  /** One-sentence hazard. */
  hazard: string;
  /** EU risk type, e.g. "Electric shock". */
  risk?: string;
  /** Units affected, as the notice states it. */
  units?: string;
  /** Where it was made. */
  madeIn?: string;
  /** US: where it was sold; EU: the country that notified it. */
  market: string;
  url: string;
};

/** First sentence, trimmed to a readable length. Abbreviations such as "e.g." do not end a sentence. */
export function firstSentence(text: string, max = 220) {
  const clean = text.replace(/\s+/g, " ").trim();
  const match = clean.match(/^.+?(?<!\b(?:e\.g|i\.e|approx|incl|no|vs|etc))[.!?](?=\s+[A-Z(]|$)/);
  const sentence = (match ? match[0] : clean).trim();
  return sentence.length > max ? `${sentence.slice(0, max - 1).trimEnd()}…` : sentence;
}

/** "5 Nov 2026" */
export function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`;
}

/** "Gourmia · 9 Slice Air Fryer Ovens": the brand once, then the product. */
export function recallName(recall: Pick<Recall, "brand" | "product">) {
  if (!recall.brand) return recall.product;
  const product = recall.product.toLowerCase().startsWith(recall.brand.toLowerCase()) ? recall.product.slice(recall.brand.length).trim() : recall.product;
  return `${recall.brand} · ${product}`;
}
