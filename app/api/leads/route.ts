import { getInsights } from "@/lib/content";
import { getEditorialInsights } from "@/lib/insightCollections";
import { createConfirmToken } from "@/lib/leadConfirm";
import { getNews } from "@/lib/news";
import { welcomeEmailHtml } from "@/lib/welcomeEmail";
import { brevoAttributes, directListFor, looksAutomated, validateLead, wantsNewsletter, type Lead } from "@/lib/leads";

export const runtime = "nodejs";

const BREVO = "https://api.brevo.com/v3";
const num = (value: string | undefined) => (value && /^\d+$/.test(value) ? Number(value) : undefined);

function config() {
  return {
    key: process.env.BREVO_API_KEY,
    lists: {
      newsletter: num(process.env.BREVO_LIST_NEWSLETTER),
      inquiry: num(process.env.BREVO_LIST_INQUIRY),
      expoVisitor: num(process.env.BREVO_LIST_EXPO_VISITOR),
      expoExhibitor: num(process.env.BREVO_LIST_EXPO_EXHIBITOR)
    },
    sender: process.env.BREVO_SENDER_EMAIL,
    notify: process.env.LEAD_NOTIFY_EMAIL
  };
}

async function brevo(key: string, path: string, body: unknown) {
  const response = await fetch(`${BREVO}${path}`, {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok && response.status !== 204) {
    const text = await response.text().catch(() => "");
    throw new Error(`Brevo ${path} ${response.status} ${text.slice(0, 300)}`);
  }
}

const escape = (value = "") => value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);

function notificationHtml(lead: Lead) {
  const rows = Object.entries({
    Form: lead.kind === "expo" ? `WCB Expo ${lead.expoRole}` : lead.kind,
    Need: lead.need,
    Name: lead.name,
    Email: lead.email,
    Company: lead.company,
    Country: lead.country,
    Category: lead.category,
    "Phone or WeChat": lead.phone,
    Message: lead.message,
    Page: lead.sourcePage
  }).filter(([, value]) => value);
  return `<table>${rows.map(([label, value]) => `<tr><td><b>${label}</b></td><td>${escape(String(value))}</td></tr>`).join("")}</table>`;
}

/** The newest WCB analysis and news for the welcome email. */
function welcomeItems(origin: string) {
  const analysis = getEditorialInsights(getInsights())
    .filter((article) => !article.series)
    .slice(0, 3)
    .map((article) => ({ title: article.title, url: `${origin}/blog/${article.slug}`, summary: article.excerpt }));
  const news = getNews()
    .slice(0, 3)
    .map((story) => ({ title: story.title, url: `${origin}/news/${story.slug}` }));
  return { analysis, news };
}

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  // Quietly accept what looks automated, so bots get no signal to retry.
  if (looksAutomated(input)) return Response.json({ ok: true });

  const result = validateLead(input);
  if (!result.ok) return Response.json(result, { status: 422 });
  const lead = result.lead;

  const settings = config();
  if (!settings.key) {
    return Response.json({ ok: false, error: "Forms are being set up. Please email us in the meantime.", code: "not_configured" }, { status: 503 });
  }

  try {
    const attributes = brevoAttributes(lead);
    const list = directListFor(lead, settings.lists);
    if (list) {
      await brevo(settings.key, "/contacts", { email: lead.email, attributes, listIds: [list], updateEnabled: true });
    }
    if (wantsNewsletter(lead) && settings.lists.newsletter) {
      // Single opt-in: subscribed straight away, then a welcome email with real
      // content and a one-click unsubscribe link (also in List-Unsubscribe).
      await brevo(settings.key, "/contacts", {
        email: lead.email,
        attributes: { ...attributes, OPT_IN: true },
        listIds: [settings.lists.newsletter],
        updateEnabled: true
      });
      if (settings.sender) {
        const origin = new URL(request.url).origin;
        const token = createConfirmToken(lead.email, {}, process.env.LEAD_CONFIRM_SECRET || settings.key);
        const unsubscribeUrl = `${origin}/unsubscribed?token=${encodeURIComponent(token)}`;
        await brevo(settings.key, "/smtp/email", {
          sender: { email: settings.sender, name: "World Clean Biz" },
          to: [{ email: lead.email, ...(lead.name ? { name: lead.name } : {}) }],
          subject: "Welcome to the WCB weekly brief",
          htmlContent: welcomeEmailHtml({
            ...welcomeItems(origin),
            unsubscribeUrl,
            reportUrl: lead.reportId ? `${origin}/reports` : undefined
          }),
          headers: {
            "List-Unsubscribe": `<${origin}/api/leads/unsubscribe?token=${encodeURIComponent(token)}>, <mailto:news@worldcleanbiz.com?subject=unsubscribe>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
          },
          tags: ["newsletter-welcome"]
        });
      }
    }
    if (lead.kind !== "subscribe" && settings.sender && settings.notify) {
      await brevo(settings.key, "/smtp/email", {
        sender: { email: settings.sender, name: "WCB website" },
        to: [{ email: settings.notify }],
        replyTo: { email: lead.email, name: lead.name || lead.email },
        subject: lead.kind === "expo" ? `WCB Expo ${lead.expoRole}: ${lead.company || lead.email}` : `New inquiry (${lead.need}): ${lead.company || lead.email}`,
        htmlContent: notificationHtml(lead)
      });
    }
  } catch (error) {
    console.error("lead submission failed", error);
    return Response.json({ ok: false, error: "Something went wrong. Please try again or email us." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
