import type { CSSProperties, ReactNode } from "react";

const visuallyHiddenCaptionStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0
};

type BrandDataColumn = {
  key: string;
  label: string;
};

type BrandDataTableProps = {
  caption: string;
  columns: BrandDataColumn[];
  rows: Array<Record<string, ReactNode>>;
};

export function BrandDataTable({
  caption,
  columns,
  rows
}: BrandDataTableProps) {
  return (
    <table className="brand-data-table">
      <caption style={visuallyHiddenCaptionStyle}>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.key} data-label={column.label}>
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
