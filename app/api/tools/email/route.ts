import { brevo } from "@/lib/brevo";
import { createConfirmToken } from "@/lib/leadConfirm";
import { looksAutomated } from "@/lib/leads";
import { toolEmail, toolEmailHtml } from "@/lib/tools/email";
import { getTool } from "@/lib/tools/catalog";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Emails a tool result to the reader; optionally subscribes them to the weekly brief. */
export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (looksAutomated(input)) return Response.json({ ok: true });

  const tool = getTool(String(input.tool ?? ""));
  if (!tool) return Response.json({ ok: false, error: "Unknown tool" }, { status: 400 });
  const email = String(input.email ?? "").trim().toLowerCase().slice(0, 160);
  if (!EMAIL.test(email)) return Response.json({ ok: false, error: "Enter a valid email address", field: "email" }, { status: 422 });
  const subscribe = input.subscribe === true;
  const inputs = input.inputs && typeof input.inputs === "object" ? (input.inputs as Record<string, unknown>) : {};

  const key = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SENDER_EMAIL;
  const newsletter = Number(process.env.BREVO_LIST_NEWSLETTER) || undefined;
  if (!key || !sender) {
    return Response.json({ ok: false, error: "Email is being set up. Please try again later.", code: "not_configured" }, { status: 503 });
  }

  try {
    const origin = new URL(request.url).origin;
    const attributes = { LEAD_TYPE: `tool-${tool.id}`, SOURCE_PAGE: tool.href };
    let unsubscribeUrl: string | undefined;
    if (subscribe && newsletter) {
      await brevo(key, "/contacts", { email, attributes: { ...attributes, OPT_IN: true }, listIds: [newsletter], updateEnabled: true });
      const token = createConfirmToken(email, {}, process.env.LEAD_CONFIRM_SECRET || key);
      unsubscribeUrl = `${origin}/unsubscribed?token=${encodeURIComponent(token)}`;
    } else {
      await brevo(key, "/contacts", { email, attributes, updateEnabled: true });
    }
    const result = toolEmail(tool.id, inputs);
    await brevo(key, "/smtp/email", {
      sender: { email: sender, name: "World Clean Biz" },
      to: [{ email }],
      subject: result.subject,
      htmlContent: toolEmailHtml(tool.id, result, { origin, unsubscribeUrl }),
      tags: [`tool-${tool.id}`]
    });
  } catch (error) {
    console.error("tool email failed", error);
    return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
