const ACRONYMS = new Set(["iec", "ul", "epa", "lg", "fcc", "eu", "us", "uk", "ce", "en", "iso", "ansi", "osha", "nsf", "dvc", "bp", "sv", "hx", "ar", "hd", "rc", "tti", "cat", "dji", "pdf", "hvac"]);

/**
 * Readable link text for an internal source id: "iec-pressure-safety" -> "IEC pressure safety",
 * "tennant-x4-news" -> "Tennant X4 news". The id itself stays in the link target.
 */
export function sourceLabel(id: string): string {
  const words = id.split("-").filter(Boolean).map((word, index) => {
    if (ACRONYMS.has(word) || /\d/.test(word)) return word.toUpperCase();
    return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  });
  return words.join(" ");
}
