/**
 * "Email me this result": the server recomputes the result from the submitted inputs (never trusting
 * figures from the browser) and builds the email, so the message only ever contains WCB's own wording.
 */

import { CERT_MARKETS, CERT_PRODUCTS, CHECKLIST_AS_OF, LEVEL_LABELS, checklistFor, formatCertDate, type CertMarket, type CertProduct } from "@/lib/tools/certifications";
import { getTool, money, fixed, CURRENCIES, type Currency, type ToolId } from "@/lib/tools/catalog";
import { EU_VAT, ORIGINS, PRODUCTS, RATES_AS_OF, calculateLanded, cleanLandedInputs, insuranceAmount } from "@/lib/tools/landedCost";
import { calculateRoi, cleanRoiInputs } from "@/lib/tools/roi";

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);

type Row = [string, string];

function table(rows: Row[], strongLast = false) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows
    .map(([label, value], index) => {
      const strong = strongLast && index === rows.length - 1;
      return `<tr><td style="padding:8px 0;border-top:1px solid #eaecf0;font-size:14px;color:#475467">${escapeHtml(label)}</td><td align="right" style="padding:8px 0 8px 12px;border-top:1px solid #eaecf0;font-size:14px;${strong ? "font-weight:bold;color:#101828" : "color:#101828"}">${escapeHtml(value)}</td></tr>`;
    })
    .join("")}</table>`;
}

const heading = (text: string) => `<tr><td style="padding-top:22px;font-size:12px;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;color:#2447d6">${escapeHtml(text)}</td></tr>`;
const para = (text: string) => `<tr><td style="padding-top:10px;font-size:14px;line-height:1.6;color:#475467">${escapeHtml(text)}</td></tr>`;
const block = (html: string) => `<tr><td style="padding-top:8px">${html}</td></tr>`;

export type ToolEmail = { subject: string; body: string; summary: string };

export function landedEmail(raw: Record<string, unknown>): ToolEmail {
  const inputs = cleanLandedInputs(raw);
  const result = calculateLanded(inputs);
  const product = inputs.product === "custom" ? "Other product (your rates)" : PRODUCTS[inputs.product].label;
  const market = inputs.destination === "us" ? "United States" : inputs.destination === "uk" ? "United Kingdom" : `European Union (${EU_VAT[inputs.euCountry].label})`;
  const summary = `${product}, ${ORIGINS[inputs.origin].label} to ${market}`;
  const body = [
    heading("Shipment"),
    block(table([
      ["Product", product],
      ["Made in", ORIGINS[inputs.origin].label],
      ["Shipping to", market],
      ["Units", inputs.units.toLocaleString("en-US")],
      ["Factory price per unit (FOB)", money(inputs.unitPrice, "USD", 2)],
      ["Freight", money(inputs.freight)],
      ["Insurance", money(insuranceAmount(inputs))],
      ["Other costs", money(inputs.otherCosts)]
    ])),
    heading("Duties and fees"),
    block(table([...result.lines.map((line): Row => [line.label, money(line.amount)]), ["Total duties and fees", money(result.dutiesAndFees)]], true)),
    heading("Landed cost"),
    block(table([
      ["Goods value", money(result.goods)],
      ["Effective duty rate on goods", `${fixed(result.effectiveDutyRate)}%`],
      ...(result.vat ? ([[`Import VAT (${result.vatRate}%, usually reclaimable)`, money(result.vat)]] as Row[]) : []),
      ["Landed cost per unit", money(result.landedPerUnit, "USD", 2)],
      ["Landed cost, whole shipment", money(result.landedTotal)]
    ], true)),
    para(result.customsBasis),
    ...result.rateNotes.map(para),
    para(`Rates as of ${RATES_AS_OF}. A guide only, not customs or legal advice: confirm the classification and rates with your customs broker before you price or ship.`)
  ].join("");
  return { subject: `Your landed cost: ${summary}`, body, summary };
}

export function complianceEmail(raw: Record<string, unknown>): ToolEmail {
  const product = CERT_PRODUCTS.find((item) => item.value === raw.product) ?? CERT_PRODUCTS[0];
  const market = CERT_MARKETS.find((item) => item.value === raw.market) ?? CERT_MARKETS[0];
  const connected = raw.connected === true;
  const items = checklistFor(market.value as CertMarket, { product: product.value as CertProduct, connected });
  const summary = `${product.label}${connected ? " (connected)" : ""} for ${market.label}`;
  const body = [
    heading(`${market.label}: ${items.length} items`),
    ...items.map((item) =>
      block(`<div style="padding:10px 0;border-top:1px solid #eaecf0"><div style="font-size:15px;font-weight:bold;color:#101828">${escapeHtml(item.name)}</div><div style="padding-top:2px;font-size:12px;font-weight:bold;color:${item.level === "required" ? "#b42318" : item.level === "retailer" ? "#2447d6" : "#9a5b00"}">${escapeHtml(LEVEL_LABELS[item.level])}${item.date ? ` · ${escapeHtml(item.dateLabel ?? "Date")} ${formatCertDate(item.date)}` : ""}</div><div style="padding-top:4px;font-size:14px;line-height:1.55;color:#475467">${escapeHtml(item.what)}</div></div>`)
    ),
    para(`Checked as of ${CHECKLIST_AS_OF}. A starting checklist, not legal advice: confirm the exact standards with an accredited test lab for your product.`)
  ].join("");
  return { subject: `Your export checklist: ${summary}`, body, summary };
}

export function roiEmail(raw: Record<string, unknown>): ToolEmail {
  const inputs = cleanRoiInputs(raw);
  const currency: Currency = typeof raw.currency === "string" && raw.currency in CURRENCIES ? (raw.currency as Currency) : "USD";
  const result = calculateRoi(inputs);
  const payback = result.paybackMonths === null ? "Does not pay back" : `${fixed(result.paybackMonths)} months`;
  const summary = `${inputs.area.toLocaleString("en-US")} m² a day, payback ${payback.toLowerCase()}`;
  const body = [
    heading("Your inputs"),
    block(table([
      ["Floor area cleaned per day", `${inputs.area.toLocaleString("en-US")} m²`],
      ["Manual cleaning rate", `${inputs.manualRate.toLocaleString("en-US")} m² per hour`],
      ["Cleaning days per year", String(inputs.days)],
      ["Labour cost per hour", money(inputs.wage, currency, 2)],
      ["Work the robot takes over", `${inputs.coverage}%`],
      ["Staff time on the robot per day", `${fixed(inputs.supervision)} h`],
      ["Robot price", money(inputs.price, currency)],
      ["Running costs per year", money(inputs.running, currency)],
      ["Expected life", `${inputs.life} years`]
    ])),
    heading("Result"),
    block(table([
      ["Cleaning hours freed per day", `${fixed(result.hoursSavedPerDay)} h`],
      ["Hours freed per year", Math.round(result.hoursSavedPerYear).toLocaleString("en-US")],
      ["Full-time cleaners' worth of hours", fixed(result.fteFreed, 2)],
      ["Labour saved per year", money(result.labourSavedPerYear, currency)],
      ["Net saving per year after running costs", money(result.netSavingPerYear, currency)],
      [`Net gain over ${inputs.life} years`, money(result.lifetimeNet, currency)],
      ["Payback", payback]
    ], true)),
    para("Savings are cleaning hours that can be moved to other work or no longer paid for. A guide only: ask the robot supplier for a site trial to confirm coverage and cleaning rate.")
  ].join("");
  return { subject: `Your cleaning robot payback: ${summary}`, body, summary };
}

export function toolEmail(tool: ToolId, inputs: Record<string, unknown>) {
  if (tool === "landed-cost") return landedEmail(inputs);
  if (tool === "export-compliance") return complianceEmail(inputs);
  return roiEmail(inputs);
}

export function toolEmailHtml(tool: ToolId, email: ToolEmail, { origin, unsubscribeUrl }: { origin: string; unsubscribeUrl?: string }) {
  const meta = getTool(tool)!;
  const url = `${origin}${meta.href}?utm_source=brevo&utm_medium=email&utm_campaign=tool-result`;
  return `<!doctype html><html><body style="margin:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#101828">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;padding:32px">
<tr><td style="font-size:13px;font-weight:bold;letter-spacing:.06em;color:#2447d6;text-transform:uppercase">World Clean Biz tools</td></tr>
<tr><td style="padding-top:12px;font-size:22px;font-weight:bold;line-height:1.3">${escapeHtml(meta.title)}</td></tr>
<tr><td style="padding-top:6px;font-size:15px;line-height:1.6;color:#344054">${escapeHtml(email.summary)}</td></tr>
${email.body}
<tr><td style="padding-top:24px"><a href="${escapeHtml(url)}" style="display:inline-block;background:#2447d6;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 22px;border-radius:8px">Open the tool again</a></td></tr>
<tr><td style="padding-top:28px;font-size:12px;line-height:1.6;color:#667085">You asked for this result on worldcleanbiz.com.${unsubscribeUrl ? ` You also subscribed to the WCB weekly brief: <a href="${escapeHtml(unsubscribeUrl)}" style="color:#667085">unsubscribe in one click</a>.` : " We won't email you again unless you subscribe."}<br>World Clean Biz · worldcleanbiz.com</td></tr>
</table></td></tr></table></body></html>`;
}
