// The first email a new subscriber gets: real WCB content straight away, with
// a one-click unsubscribe link, instead of a separate confirmation step.

export type WelcomeItem = { title: string; url: string; summary?: string };

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);

function itemHtml(item: WelcomeItem) {
  return `<tr><td style="padding:12px 0;border-top:1px solid #eaecf0">
<a href="${escapeHtml(item.url)}" style="font-size:16px;font-weight:bold;line-height:1.4;color:#163b67;text-decoration:none">${escapeHtml(item.title)}</a>
${item.summary ? `<div style="padding-top:4px;font-size:14px;line-height:1.55;color:#475467">${escapeHtml(item.summary)}</div>` : ""}
</td></tr>`;
}

function section(title: string, items: WelcomeItem[]) {
  if (!items.length) return "";
  return `<tr><td style="padding-top:24px;font-size:12px;font-weight:bold;letter-spacing:.06em;text-transform:uppercase;color:#2447d6">${escapeHtml(title)}</td></tr>${items.map(itemHtml).join("")}`;
}

export function welcomeEmailHtml({
  analysis,
  news,
  unsubscribeUrl,
  reportUrl
}: {
  analysis: WelcomeItem[];
  news: WelcomeItem[];
  unsubscribeUrl: string;
  reportUrl?: string;
}) {
  return `<!doctype html><html><body style="margin:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#101828">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;padding:32px">
<tr><td style="font-size:13px;font-weight:bold;letter-spacing:.06em;color:#2447d6;text-transform:uppercase">World Clean Biz</td></tr>
<tr><td style="padding-top:12px;font-size:24px;font-weight:bold;line-height:1.3">Welcome to the WCB weekly brief</td></tr>
<tr><td style="padding-top:12px;font-size:15px;line-height:1.6;color:#344054">Every Friday you will get five stories that matter in the cleaning industry and one WCB analysis, from Denny You and the WCB news desk. Here is what readers are following this week.</td></tr>
${reportUrl ? `<tr><td style="padding-top:20px"><a href="${escapeHtml(reportUrl)}" style="display:inline-block;background:#2447d6;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 22px;border-radius:8px">Get your report</a></td></tr>` : ""}
${section("Latest analysis", analysis)}
${section("Industry news", news)}
<tr><td style="padding-top:28px;font-size:12px;line-height:1.6;color:#667085">You are receiving this because this address was subscribed on worldcleanbiz.com. Not you, or not interested? <a href="${escapeHtml(unsubscribeUrl)}" style="color:#667085">Unsubscribe in one click</a>.<br>World Clean Biz · worldcleanbiz.com</td></tr>
</table></td></tr></table></body></html>`;
}
