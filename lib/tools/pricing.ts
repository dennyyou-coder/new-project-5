/**
 * Price ladder from factory to shelf: works back from a target retail price to the highest FOB price that
 * still leaves the brand its margin, or forward from an FOB price to the retail price it needs.
 * Shared by the /tools page and the results email.
 */

import { ORIGINS, PRODUCTS } from "@/lib/tools/landedCost";

export type PricingMarket = "us" | "eu" | "uk";
export type PricingChannel = "amazon" | "retail" | "distributor";
export type PricingMode = "toFob" | "toRetail";

export const PRICING_MARKETS: Record<PricingMarket, { label: string; currency: "USD" | "EUR" | "GBP"; vat: number; dutyOnFreight: boolean }> = {
  // US shelf prices exclude sales tax and duty is charged on the FOB value.
  us: { label: "United States", currency: "USD", vat: 0, dutyOnFreight: false },
  // EU and UK shelf prices include VAT and duty is charged on the CIF value.
  eu: { label: "European Union", currency: "EUR", vat: 20, dutyOnFreight: true },
  uk: { label: "United Kingdom", currency: "GBP", vat: 20, dutyOnFreight: true }
};

export const PRICING_CHANNELS: Record<PricingChannel, string> = {
  amazon: "Amazon or another marketplace",
  retail: "Retail chain",
  distributor: "Distributor, then retailer"
};

/** A robot or cordless vacuum made in China and sold in the US: Section 301 List 3 plus the forced-labor duty. */
export const DEFAULT_US_DUTY = PRODUCTS.vacuum.usMfn + PRODUCTS.vacuum.us301 + ORIGINS.cn.usForcedLabor;

/** Starting VAT and duty when the reader switches market (robot or cordless vacuum from China). */
export const MARKET_PRESETS: Record<PricingMarket, { vat: number; duty: number }> = {
  us: { vat: 0, duty: DEFAULT_US_DUTY },
  eu: { vat: 20, duty: PRODUCTS.vacuum.euDuty },
  uk: { vat: 20, duty: PRODUCTS.vacuum.ukDuty }
};

export type PricingInputs = {
  mode: PricingMode;
  market: PricingMarket;
  channel: PricingChannel;
  /** Shelf price the consumer pays (VAT included in the EU and UK). Used when working back to FOB. */
  retailPrice: number;
  /** Factory price per unit. Used when working forward to retail. */
  fobPrice: number;
  /** VAT in the shelf price, % (EU and UK only). */
  vat: number;
  /** Marketplace referral fee, % of the shelf price. */
  referralFee: number;
  /** Marketplace fulfilment fee per unit. */
  fulfilmentFee: number;
  /** Advertising, % of net sales. */
  advertising: number;
  /** Retailer margin, % of the retailer's net selling price. */
  retailerMargin: number;
  /** Distributor margin, % of the distributor's selling price. */
  distributorMargin: number;
  /** Returns, warranty and markdowns, % of the brand's revenue. */
  returns: number;
  /** Import duty, % of the customs value. */
  duty: number;
  /** Sea freight and insurance per unit. */
  freight: number;
  /** Customs broker, port, inland delivery and warehousing per unit. */
  importCosts: number;
  /** The brand's margin after all of the above, % of its revenue. */
  brandMargin: number;
};

export const PRICING_DEFAULTS: PricingInputs = {
  mode: "toFob",
  market: "us",
  channel: "amazon",
  retailPrice: 399,
  fobPrice: 120,
  vat: 0,
  referralFee: 15,
  fulfilmentFee: 14,
  advertising: 10,
  retailerMargin: 35,
  distributorMargin: 15,
  returns: 5,
  duty: DEFAULT_US_DUTY,
  freight: 4,
  importCosts: 6,
  brandMargin: 20
};

const PERCENT: [number, number] = [0, 95];
const MONEY: [number, number] = [0, 1000000];
const LIMITS: Record<Exclude<keyof PricingInputs, "mode" | "market" | "channel">, [number, number]> = {
  retailPrice: MONEY,
  fobPrice: MONEY,
  vat: [0, 30],
  referralFee: PERCENT,
  fulfilmentFee: MONEY,
  advertising: PERCENT,
  retailerMargin: PERCENT,
  distributorMargin: PERCENT,
  returns: PERCENT,
  duty: [0, 500],
  freight: MONEY,
  importCosts: MONEY,
  brandMargin: PERCENT
};

export function cleanPricingInputs(input: Partial<Record<keyof PricingInputs, unknown>>): PricingInputs {
  const out = { ...PRICING_DEFAULTS };
  if (input.mode === "toFob" || input.mode === "toRetail") out.mode = input.mode;
  if (typeof input.market === "string" && input.market in PRICING_MARKETS) out.market = input.market as PricingMarket;
  if (typeof input.channel === "string" && input.channel in PRICING_CHANNELS) out.channel = input.channel as PricingChannel;
  for (const [key, [min, max]] of Object.entries(LIMITS) as [keyof typeof LIMITS, [number, number]][]) {
    const value = Number(input[key]);
    if (Number.isFinite(value)) out[key] = Math.min(max, Math.max(min, value));
  }
  if (out.market === "us") out.vat = 0;
  return out;
}

export type PricingStep = { label: string; amount: number; note?: string };

export type PricingResult = {
  retailPrice: number;
  /** Shelf price without VAT. */
  netRetail: number;
  /** What the brand receives per unit after the channel and returns. */
  brandRevenue: number;
  brandProfit: number;
  landedCost: number;
  dutyAmount: number;
  fobPrice: number;
  /** FOB as a share of the shelf price, %. */
  fobShare: number;
  /** Retail price over FOB. */
  multiple: number | null;
  /** From the shelf price down to FOB, each deduction as a negative amount. */
  ladder: PricingStep[];
  /** The channel and margins take more than the shelf price: no FOB price works. */
  impossible: boolean;
};

/**
 * Brand revenue per unit is linear in the shelf price P: revenue = k·P − c.
 * Returns k and c for the chosen channel, so the same model runs in both directions.
 */
function channelLine(inputs: PricingInputs) {
  const vat = inputs.vat / 100;
  const keep = 1 - inputs.returns / 100;
  if (inputs.channel === "amazon") {
    // Referral fees are charged on the full price the customer pays, VAT included.
    const k = ((1 - inputs.advertising / 100) / (1 + vat) - inputs.referralFee / 100) * keep;
    return { k, c: inputs.fulfilmentFee * keep };
  }
  const distributor = inputs.channel === "distributor" ? 1 - inputs.distributorMargin / 100 : 1;
  return { k: ((1 - inputs.retailerMargin / 100) * distributor * keep) / (1 + vat), c: 0 };
}

function landedFromFob(inputs: PricingInputs, fob: number) {
  const dutyBase = PRICING_MARKETS[inputs.market].dutyOnFreight ? fob + inputs.freight : fob;
  const dutyAmount = dutyBase * (inputs.duty / 100);
  return { dutyAmount, landed: fob + inputs.freight + dutyAmount + inputs.importCosts };
}

function fobFromLanded(inputs: PricingInputs, landed: number) {
  const rate = 1 + inputs.duty / 100;
  return PRICING_MARKETS[inputs.market].dutyOnFreight
    ? (landed - inputs.importCosts) / rate - inputs.freight
    : (landed - inputs.importCosts - inputs.freight) / rate;
}

export function calculatePricing(inputs: PricingInputs): PricingResult {
  const { k, c } = channelLine(inputs);
  const margin = inputs.brandMargin / 100;
  let retailPrice: number;
  let fobPrice: number;
  if (inputs.mode === "toFob") {
    retailPrice = inputs.retailPrice;
    const revenue = k * retailPrice - c;
    fobPrice = fobFromLanded(inputs, revenue * (1 - margin));
  } else {
    fobPrice = inputs.fobPrice;
    const needed = landedFromFob(inputs, fobPrice).landed / (1 - margin);
    retailPrice = k > 0 ? (needed + c) / k : Number.POSITIVE_INFINITY;
  }
  const impossible = !Number.isFinite(retailPrice) || fobPrice <= 0 || k <= 0;
  const vat = inputs.vat / 100;
  const netRetail = retailPrice / (1 + vat);
  const brandRevenue = k * retailPrice - c;
  const { dutyAmount, landed } = landedFromFob(inputs, Math.max(0, fobPrice));
  const brandProfit = brandRevenue - landed;

  const ladder: PricingStep[] = [];
  if (vat > 0) ladder.push({ label: `VAT (${inputs.vat}%)`, amount: -(retailPrice - netRetail) });
  const keep = 1 - inputs.returns / 100;
  let beforeReturns: number;
  if (inputs.channel === "amazon") {
    const referral = retailPrice * (inputs.referralFee / 100);
    const ads = netRetail * (inputs.advertising / 100);
    ladder.push({ label: `Referral fee (${inputs.referralFee}%)`, amount: -referral });
    ladder.push({ label: "Fulfilment fee", amount: -inputs.fulfilmentFee });
    ladder.push({ label: `Advertising (${inputs.advertising}%)`, amount: -ads });
    beforeReturns = netRetail - referral - inputs.fulfilmentFee - ads;
  } else {
    const retailerTake = netRetail * (inputs.retailerMargin / 100);
    ladder.push({ label: `Retailer margin (${inputs.retailerMargin}%)`, amount: -retailerTake });
    beforeReturns = netRetail - retailerTake;
    if (inputs.channel === "distributor") {
      const distributorTake = beforeReturns * (inputs.distributorMargin / 100);
      ladder.push({ label: `Distributor margin (${inputs.distributorMargin}%)`, amount: -distributorTake });
      beforeReturns -= distributorTake;
    }
  }
  ladder.push({ label: `Returns and warranty (${inputs.returns}%)`, amount: -beforeReturns * (1 - keep) });
  ladder.push({ label: `Brand margin (${inputs.brandMargin}%)`, amount: -brandProfit });
  ladder.push({ label: "Import costs and warehousing", amount: -inputs.importCosts });
  ladder.push({ label: `Import duty (${inputs.duty}%)`, amount: -dutyAmount });
  ladder.push({ label: "Freight and insurance", amount: -inputs.freight });

  return {
    retailPrice,
    netRetail,
    brandRevenue,
    brandProfit,
    landedCost: landed,
    dutyAmount,
    fobPrice,
    fobShare: retailPrice > 0 ? (fobPrice / retailPrice) * 100 : 0,
    multiple: fobPrice > 0 && Number.isFinite(retailPrice) ? retailPrice / fobPrice : null,
    ladder,
    impossible
  };
}
