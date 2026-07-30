import type { ReactNode } from "react";

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
      <caption className="sr-only">{caption}</caption>
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
