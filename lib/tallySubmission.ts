export type TallySubmission = { id?: string; responseId?: string };

export function readTallyMessage(data: unknown, formId: string) {
  try {
    const message = typeof data === "string" ? JSON.parse(data) : data;
    if (!message || typeof message !== "object") return null;
    if (message.payload?.formId !== formId) return null;
    if (message.event === "Tally.FormLoaded") return { event: "loaded" as const };
    if (message.event !== "Tally.FormSubmitted") return null;
    const id = message.payload.id || message.payload.responseId;
    if (typeof id !== "string" || !id) return null;
    return { event: "submitted" as const, id };
  } catch {
    return null;
  }
}
