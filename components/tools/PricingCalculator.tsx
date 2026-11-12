"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CURRENCIES, fixed, money } from "@/lib/tools/catalog";
import {
  MARKET_PRESETS,
  PRICING_CHANNELS,
  PRICING_DEFAULTS,
  PRICING_MARKETS,
  calculatePricing,
  cleanPricingInputs,
  type PricingChannel,
  type PricingInputs,
  type PricingMarket,
  type PricingMode
} from "@/lib/tools/pricing";
import { NumberField, ResultRow, Segmented, SelectField, ToolEmailForm, useFirstUse } from "./ToolParts";

type NumberKey = Exclude<keyof PricingInputs, "mode" | "market" | "channel">;

export function PricingCalculator() {
  const [mode, setMode] = useState<PricingMode>("toFob");
  const [market, setMarket] = useState<PricingMarket>("us");
  const [channel, setChannel] = useState<PricingChannel>("amazon");
  const [values, setValues] = useState<Record<NumberKey, string>>(
    () =>
      Object.fromEntries(
        Object.entries(PRICING_DEFAULTS).filter(([key]) => !["mode", "market", "channel"].includes(key)).map(([key, value]) => [key, String(value)])
      ) as Record<NumberKey, string>
  );
  const firstUse = useFirstUse("retail-to-fob");
  const set = (key: NumberKey) => (value: string) => {
    firstUse();
    setValues((current) => ({ ...current, [key]: value }));
  };
  const inputs = useMemo(() => cleanPricingInputs({ ...values, mode, market, channel }), [values, mode, market, channel]);
  const result = useMemo(() => calculatePricing(inputs), [inputs]);
  const currency = PRICING_MARKETS[market].currency;
  const symbol = CURRENCIES[currency];
  const headline = mode === "toFob" ? result.fobPrice : result.retailPrice;

  return (
    <div className="tool-layout">
      <form className="tool-panel" onSubmit={(event) => event.preventDefault()} aria-label="Price, channel and costs">
        <div className="tool-grid">
          <div className="tool-span">
            <Segmented<PricingMode>
              label="Work out"
              value={mode}
              options={[{ value: "toFob", label: "Retail → highest FOB" }, { value: "toRetail", label: "FOB → retail price" }]}
              onChange={(value) => {
                firstUse();
                setMode(value);
              }}
            />
          </div>
          <SelectField<PricingMarket>
            label="Market"
            value={market}
            options={(Object.keys(PRICING_MARKETS) as PricingMarket[]).map((value) => ({ value, label: `${PRICING_MARKETS[value].label} (${PRICING_MARKETS[value].currency})` }))}
            onChange={(value) => {
              firstUse();
              setMarket(value);
              setValues((current) => ({ ...current, vat: String(MARKET_PRESETS[value].vat), duty: String(MARKET_PRESETS[value].duty) }));
            }}
          />
          <SelectField<PricingChannel>
            label="Sales channel"
            value={channel}
            options={(Object.keys(PRICING_CHANNELS) as PricingChannel[]).map((value) => ({ value, label: PRICING_CHANNELS[value] }))}
            onChange={(value) => {
              firstUse();
              setChannel(value);
            }}
          />
          {mode === "toFob" ? (
            <NumberField label="Shelf price" prefix={symbol} value={values.retailPrice} onChange={set("retailPrice")} hint={market === "us" ? "Before sales tax" : "Including VAT"} />
          ) : (
            <NumberField label="FOB price per unit" prefix={symbol} value={values.fobPrice} onChange={set("fobPrice")} hint={`Factory price in ${currency}`} />
          )}
          {market !== "us" ? <NumberField label="VAT in the shelf price" suffix="%" value={values.vat} onChange={set("vat")} hint="Germany 19, France 20, UK 20" /> : null}
        </div>

        <h2 className="tool-panel-title">{channel === "amazon" ? "Marketplace costs" : "Channel margins"}</h2>
        <div className="tool-grid">
          {channel === "amazon" ? (
            <>
              <NumberField label="Referral fee" suffix="%" value={values.referralFee} onChange={set("referralFee")} hint="15% for most home and kitchen products on Amazon" />
              <NumberField label="Fulfilment fee per unit" prefix={symbol} value={values.fulfilmentFee} onChange={set("fulfilmentFee")} hint="Example for a large boxed appliance: use your size tier" />
              <NumberField label="Advertising" suffix="% of sales" value={values.advertising} onChange={set("advertising")} />
            </>
          ) : (
            <>
              <NumberField label="Retailer margin" suffix="%" value={values.retailerMargin} onChange={set("retailerMargin")} hint="Of the retailer's selling price, before VAT" />
              {channel === "distributor" ? <NumberField label="Distributor margin" suffix="%" value={values.distributorMargin} onChange={set("distributorMargin")} /> : null}
            </>
          )}
          <NumberField label="Returns and warranty" suffix="%" value={values.returns} onChange={set("returns")} hint="Returns, repairs, markdowns" />
          <NumberField label="Brand margin" suffix="%" value={values.brandMargin} onChange={set("brandMargin")} hint="What the brand keeps after every cost here" />
        </div>

        <h2 className="tool-panel-title">Import costs per unit</h2>
        <div className="tool-grid">
          <NumberField
            label="Import duty"
            suffix="%"
            value={values.duty}
            onChange={set("duty")}
            hint={market === "us" ? "37.5% for a Chinese robot or cordless vacuum (301 + forced-labor duty)" : "Of the CIF value"}
          />
          <NumberField label="Freight and insurance" prefix={symbol} value={values.freight} onChange={set("freight")} hint="Sea freight per unit: see the container calculator" />
          <NumberField label="Customs, port, warehousing" prefix={symbol} value={values.importCosts} onChange={set("importCosts")} />
        </div>
        <p className="tool-basis">
          Duty rates for other products and origins are in the <Link href="/tools/landed-cost-calculator">landed cost calculator</Link>. Sea freight per unit comes from the <Link href="/tools/container-loading-calculator">container loading calculator</Link>.
        </p>
      </form>

      <section className="tool-result" aria-live="polite" aria-label="Price ladder">
        <p className="tool-kicker">{mode === "toFob" ? "Highest FOB price" : "Shelf price needed"}</p>
        <p className="tool-big">{result.impossible ? "Not workable" : money(headline, currency, 2)}</p>
        <p className="tool-sub">
          {result.impossible
            ? "The channel fees and margins take more than the shelf price. Lower the margins or raise the price."
            : `FOB is ${fixed(result.fobShare, 0)}% of the shelf price; the shelf price is ${result.multiple ? fixed(result.multiple) : "–"}× FOB.`}
        </p>
        <div className="tool-rows">
          <ResultRow label="Shelf price" value={result.impossible && mode === "toRetail" ? "–" : money(result.retailPrice, currency, 2)} strong />
          {result.ladder.map((step) => (
            <ResultRow key={step.label} label={step.label} value={money(step.amount, currency, 2)} />
          ))}
          <ResultRow label="FOB price per unit" value={result.impossible ? "–" : money(result.fobPrice, currency, 2)} strong />
        </div>
        <div className="tool-rows">
          <ResultRow label="Brand revenue per unit" value={money(result.brandRevenue, currency, 2)} note="After the channel, fees and returns" />
          <ResultRow label="Landed cost per unit" value={money(result.landedCost, currency, 2)} note={`Including ${money(result.dutyAmount, currency, 2)} duty`} />
        </div>
        <ToolEmailForm tool="retail-to-fob" inputs={{ ...inputs }} />
      </section>
    </div>
  );
}
