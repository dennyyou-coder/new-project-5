/** Minimal Brevo API client shared by the lead and tool-result routes. */

const BREVO = "https://api.brevo.com/v3";

export async function brevo(key: string, path: string, body: unknown) {
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
