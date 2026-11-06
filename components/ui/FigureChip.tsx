import { figureDirection } from "@/lib/brandMarks";

/** A reported figure with its change, coloured by direction ("Revenue +34.85%"). */
export function FigureChip({ label, change }: { label: string; change?: string }) {
  if (!change) return null;
  const direction = figureDirection(change);
  const shortChange = change.replace(/\s*(YoY|year[- ]on[- ]year)\b.*$/i, "").trim();
  return (
    <span className={`figure-chip figure-chip--${direction}`}>
      <span className="figure-chip-label">{label}</span> {shortChange}
    </span>
  );
}
