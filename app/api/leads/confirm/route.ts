import { readConfirmToken } from "@/lib/leadConfirm";

export const runtime = "nodejs";

const num = (value: string | undefined) => (value && /^\d+$/.test(value) ? Number(value) : undefined);
const redirect = (request: Request, path: string) => Response.redirect(new URL(path, request.url), 303);

/** Confirms a newsletter sign-up from the button on /subscribe/confirm (a POST, so link scanners cannot confirm). */
export async function POST(request: Request) {
  const key = process.env.BREVO_API_KEY;
  const list = num(process.env.BREVO_LIST_NEWSLETTER);
  const secret = process.env.LEAD_CONFIRM_SECRET || key;
  if (!key || !list || !secret) return redirect(request, "/subscribe/confirm?status=error");

  const form = await request.formData().catch(() => null);
  const token = String(form?.get("token") ?? "");
  const result = readConfirmToken(token, secret);
  if (!result.ok) return redirect(request, `/subscribe/confirm?status=${result.reason}`);

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email: result.payload.email,
      attributes: { ...result.payload.attributes, OPT_IN: true },
      listIds: [list],
      updateEnabled: true
    })
  });
  if (!response.ok && response.status !== 204) {
    console.error("newsletter confirm failed", response.status, (await response.text().catch(() => "")).slice(0, 300));
    return redirect(request, "/subscribe/confirm?status=error");
  }
  return redirect(request, "/subscribed");
}
