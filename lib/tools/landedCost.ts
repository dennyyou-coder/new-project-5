/**
 * Landed cost of a shipment of cleaning appliances into the US, the EU or the UK: duties, customs fees and
 * import VAT on top of the factory price and freight. Rates are as of RATES_AS_OF and must be reviewed
 * whenever US Section 301 actions, the US–China truce or the EU robotic mower case change
 * (see content/topics/us-tariffs-chinese-cleaning-appliances.json and eu-robotic-mower-anti-dumping.json).
 */

export const RATES_AS_OF = "10 November 2026";

export type ProductKey = "vacuum" | "pool" | "mower" | "custom";
export type Destination = "us" | "eu" | "uk";
export type Origin = "cn" | "vn" | "th" | "my" | "id" | "mx" | "in";
export type Mode = "ocean" | "air";

export type ProductRates = {
  label: string;
  /** Code used for the rates below; the importer's broker confirms the full 10-digit line. */
  hs: string;
  /** US general (MFN) duty, %. */
  usMfn: number;
  /** US Section 301 duty on Chinese origin from the 2018–2019 lists, %. */
  us301: number;
  us301Note: string;
  euDuty: number;
  ukDuty: number;
  basis: string;
};

export const PRODUCTS: Record<Exclude<ProductKey, "custom">, ProductRates> = {
  vacuum: {
    label: "Robot vacuum or cordless vacuum",
    hs: "8508.11",
    usMfn: 0,
    us301: 25,
    us301Note: "List 3, heading 9903.88.03",
    euDuty: 2.2,
    ukDuty: 2,
    basis: "Vacuum cleaners with a motor of 1,500 W or less and a dust container of 20 litres or less, including robot vacuums and most wet-and-dry floor cleaners."
  },
  pool: {
    label: "Robotic pool cleaner",
    hs: "8421.21",
    usMfn: 0,
    us301: 25,
    us301Note: "List 1, heading 9903.88.01 (CBP ruling N352394)",
    euDuty: 1.7,
    ukDuty: 0,
    basis: "Recent US and UK rulings classify robotic pool cleaners with built-in filters as water-filtering machinery."
  },
  mower: {
    label: "Robotic lawn mower",
    hs: "8433.11",
    usMfn: 0,
    us301: 7.5,
    us301Note: "List 4A, heading 9903.88.15 (CBP ruling N351254)",
    euDuty: 0,
    ukDuty: 0,
    basis: "Powered mowers cutting in a horizontal plane; the EU and UK tariffs have a separate line for electric robot mowers (8433 11 10 10)."
  }
};

export const ORIGINS: Record<Origin, { label: string; /** US Section 301 forced-labor duty since 24 July 2026, %. */ usForcedLabor: number }> = {
  cn: { label: "China", usForcedLabor: 12.5 },
  vn: { label: "Vietnam", usForcedLabor: 12.5 },
  th: { label: "Thailand", usForcedLabor: 12.5 },
  my: { label: "Malaysia", usForcedLabor: 10 },
  id: { label: "Indonesia", usForcedLabor: 10 },
  mx: { label: "Mexico", usForcedLabor: 10 },
  in: { label: "India", usForcedLabor: 10 }
};

/** Standard import VAT by EU country, %. */
export const EU_VAT: Record<string, { label: string; vat: number }> = {
  de: { label: "Germany", vat: 19 },
  fr: { label: "France", vat: 20 },
  nl: { label: "Netherlands", vat: 21 },
  it: { label: "Italy", vat: 22 },
  es: { label: "Spain", vat: 21 },
  pl: { label: "Poland", vat: 23 },
  be: { label: "Belgium", vat: 21 },
  se: { label: "Sweden", vat: 25 }
};

export const UK_VAT = 20;
/** US Merchandise Processing Fee, fiscal year 2027 (from 1 October 2026). */
export const US_MPF = { rate: 0.3464, min: 34.58, max: 670.86 };
/** US Harbor Maintenance Fee on ocean shipments. */
export const US_HMF = 0.125;

export type LandedInputs = {
  product: ProductKey;
  origin: Origin;
  destination: Destination;
  euCountry: string;
  mode: Mode;
  /** Factory (FOB) price per unit, USD. */
  unitPrice: number;
  units: number;
  /** International freight for the whole shipment, USD. */
  freight: number;
  /** Cargo insurance, % of goods value. */
  insurance: number;
  /** Broker, port, inland delivery and other costs, USD. */
  otherCosts: number;
  /** Custom product only: duty rates the user enters, %. */
  customDuty: number;
  customUs301: number;
  /** EU robotic mowers from China: an anti-dumping rate to model while the case is open, %. */
  antiDumping: number;
};

export const LANDED_DEFAULTS: LandedInputs = {
  product: "vacuum",
  origin: "cn",
  destination: "us",
  euCountry: "de",
  mode: "ocean",
  unitPrice: 180,
  units: 1000,
  freight: 4500,
  insurance: 0.3,
  otherCosts: 1500,
  customDuty: 0,
  customUs301: 0,
  antiDumping: 0
};

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T) =>
  allowed.includes(value as T) ? (value as T) : fallback;
const num = (value: unknown, min: number, max: number, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

export function cleanLandedInputs(input: Partial<Record<keyof LandedInputs, unknown>>): LandedInputs {
  const d = LANDED_DEFAULTS;
  return {
    product: pick(input.product, ["vacuum", "pool", "mower", "custom"] as const, d.product),
    origin: pick(input.origin, Object.keys(ORIGINS) as Origin[], d.origin),
    destination: pick(input.destination, ["us", "eu", "uk"] as const, d.destination),
    euCountry: pick(input.euCountry, Object.keys(EU_VAT), d.euCountry),
    mode: pick(input.mode, ["ocean", "air"] as const, d.mode),
    unitPrice: num(input.unitPrice, 0, 1000000, d.unitPrice),
    units: Math.round(num(input.units, 1, 10000000, d.units)),
    freight: num(input.freight, 0, 100000000, d.freight),
    insurance: num(input.insurance, 0, 10, d.insurance),
    otherCosts: num(input.otherCosts, 0, 100000000, d.otherCosts),
    customDuty: num(input.customDuty, 0, 500, d.customDuty),
    customUs301: num(input.customUs301, 0, 500, d.customUs301),
    antiDumping: num(input.antiDumping, 0, 500, d.antiDumping)
  };
}

export type CostLine = { label: string; amount: number; note?: string };

export type LandedResult = {
  goods: number;
  /** The value duty is charged on: FOB for the US, CIF for the EU and UK. */
  customsValue: number;
  customsBasis: string;
  lines: CostLine[];
  dutiesAndFees: number;
  /** Goods, freight, insurance, duties, fees and other costs, without import VAT. */
  landedTotal: number;
  landedPerUnit: number;
  /** Import VAT, usually reclaimable by a VAT-registered importer. */
  vat: number;
  vatRate: number;
  /** Duties and fees as a share of the goods value, %. */
  effectiveDutyRate: number;
  rateNotes: string[];
};

export function calculateLanded(inputs: LandedInputs): LandedResult {
  const goods = inputs.unitPrice * inputs.units;
  const insurance = goods * (inputs.insurance / 100);
  const product = inputs.product === "custom" ? undefined : PRODUCTS[inputs.product];
  const origin = ORIGINS[inputs.origin];
  const lines: CostLine[] = [];
  const rateNotes: string[] = [];
  let vat = 0;
  let vatRate = 0;
  let customsValue: number;
  let customsBasis: string;

  if (inputs.destination === "us") {
    customsValue = goods;
    customsBasis = "US duty is charged on the FOB value: international freight and insurance are not included.";
    const mfn = product ? product.usMfn : inputs.customDuty;
    const s301 = inputs.origin === "cn" ? (product ? product.us301 : inputs.customUs301) : 0;
    lines.push({ label: `General duty (${mfn}%)`, amount: (customsValue * mfn) / 100 });
    if (inputs.origin === "cn") {
      lines.push({ label: `Section 301 China duty (${s301}%)`, amount: (customsValue * s301) / 100, note: product?.us301Note });
    }
    lines.push({
      label: `Section 301 forced-labor duty (${origin.usForcedLabor}%)`,
      amount: (customsValue * origin.usForcedLabor) / 100,
      note: `${origin.label} rate, in force since 24 July 2026`
    });
    const mpf = customsValue > 2500 ? Math.min(US_MPF.max, Math.max(US_MPF.min, (customsValue * US_MPF.rate) / 100)) : 0;
    lines.push({ label: "Merchandise Processing Fee", amount: mpf, note: customsValue > 2500 ? "0.3464%, min $34.58, max $670.86" : "Informal entry under $2,500: a small flat fee instead" });
    if (inputs.mode === "ocean") lines.push({ label: "Harbor Maintenance Fee (0.125%)", amount: (customsValue * US_HMF) / 100 });
    rateNotes.push("US rates as of " + RATES_AS_OF + ". The US–China truce runs to 10 January 2027.");
    if (inputs.origin === "cn") rateNotes.push("Products of China pay both Section 301 duties. Moving final assembly out of China removes the China duty only if the product's origin genuinely changes.");
    rateNotes.push("Advanced robots produced outside the US also need FCC authorization, which new models can no longer get without Conditional Approval.");
  } else {
    customsValue = goods + inputs.freight + insurance;
    customsBasis = "EU and UK duty is charged on the CIF value: goods, freight and insurance to the border.";
    const duty = product ? (inputs.destination === "eu" ? product.euDuty : product.ukDuty) : inputs.customDuty;
    const where = inputs.destination === "eu" ? "EU" : "UK";
    lines.push({ label: `${where} customs duty (${duty}%)`, amount: (customsValue * duty) / 100 });
    if (inputs.destination === "eu" && inputs.product === "mower" && inputs.origin === "cn") {
      lines.push({
        label: `Possible anti-dumping duty (${inputs.antiDumping}%)`,
        amount: (customsValue * inputs.antiDumping) / 100,
        note: "Case AD745: decision due by 19 January 2027"
      });
      rateNotes.push("Rates of 45.6% to 53.3% were reported at the EU's disclosure stage but have not been published. Set the rate above to model a duty.");
    }
    vatRate = inputs.destination === "eu" ? EU_VAT[inputs.euCountry].vat : UK_VAT;
    const dutySoFar = lines.reduce((sum, line) => sum + line.amount, 0);
    vat = ((customsValue + dutySoFar) * vatRate) / 100;
    rateNotes.push(`${where} rates as of ${RATES_AS_OF}. Import VAT is charged on the CIF value plus duty and is usually reclaimed by a VAT-registered importer.`);
    if (inputs.destination === "eu") rateNotes.push("Parcels under €150 sent straight to consumers also pay the new flat EU low-value duty and handling fee; this calculator covers bulk B2B shipments.");
  }

  const dutiesAndFees = lines.reduce((sum, line) => sum + line.amount, 0);
  const landedTotal = goods + inputs.freight + insurance + dutiesAndFees + inputs.otherCosts;
  return {
    goods,
    customsValue,
    customsBasis,
    lines,
    dutiesAndFees,
    landedTotal,
    landedPerUnit: landedTotal / inputs.units,
    vat,
    vatRate,
    effectiveDutyRate: goods > 0 ? (dutiesAndFees / goods) * 100 : 0,
    rateNotes
  };
}

/** Freight and insurance in the result, for display. */
export function insuranceAmount(inputs: LandedInputs) {
  return inputs.unitPrice * inputs.units * (inputs.insurance / 100);
}
