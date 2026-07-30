export type BrandDateStyle = "medium" | "long";

const yearPattern = /^\d{4}$/;
const monthPattern = /^(\d{4})-(\d{2})$/;
const dayPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timestampPattern =
  /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/;

function validUtcCalendarDate(year: number, month: number, day: number) {
  const candidate = new Date(Date.UTC(year, month - 1, day));

  return candidate.getUTCFullYear() === year
    && candidate.getUTCMonth() === month - 1
    && candidate.getUTCDate() === day;
}

export function isValidBrandDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (yearPattern.test(value)) return true;

  const monthMatch = value.match(monthPattern);
  if (monthMatch) {
    const month = Number(monthMatch[2]);
    return month >= 1 && month <= 12;
  }

  const dayMatch = value.match(dayPattern);
  if (dayMatch) {
    return validUtcCalendarDate(
      Number(dayMatch[1]),
      Number(dayMatch[2]),
      Number(dayMatch[3])
    );
  }

  const timestampMatch = value.match(timestampPattern);
  if (!timestampMatch) return false;

  return validUtcCalendarDate(
    Number(timestampMatch[1]),
    Number(timestampMatch[2]),
    Number(timestampMatch[3])
  ) && !Number.isNaN(Date.parse(value));
}

export function formatBrandDate(
  value: string,
  style: BrandDateStyle = "medium"
): string {
  if (yearPattern.test(value)) return value;

  const monthMatch = value.match(monthPattern);
  if (monthMatch) {
    const year = Number(monthMatch[1]);
    const month = Number(monthMatch[2]);
    if (!validUtcCalendarDate(year, month, 1)) return value;

    return new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, 1)));
  }

  const dayMatch = value.match(dayPattern);
  if (dayMatch) {
    const year = Number(dayMatch[1]);
    const month = Number(dayMatch[2]);
    const day = Number(dayMatch[3]);
    if (!validUtcCalendarDate(year, month, day)) return value;

    return new Intl.DateTimeFormat("en", {
      dateStyle: style,
      timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    dateStyle: style,
    timeZone: "Asia/Shanghai"
  }).format(parsed);
}
