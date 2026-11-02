import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export type ExportFormat = "xlsx" | "csv";

export type ExportColumn<T> = {
  header: string;
  key: string;
  width?: number;
  value: (row: T) => string | number | null | undefined;
};

export function parseExportFormat(value: string | null): ExportFormat {
  return value === "csv" ? "csv" : "xlsx";
}

function cellText(value: string | number | null | undefined): string {
  if (value == null) return "";
  return String(value);
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function buildCsv<T>(columns: ExportColumn<T>[], rows: T[]): string {
  const header = columns.map((column) => escapeCsv(column.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsv(cellText(column.value(row)))).join(","),
  );
  return `\uFEFF${[header, ...lines].join("\n")}`;
}

export async function buildXlsx<T>(
  sheetName: string,
  columns: ExportColumn<T>[],
  rows: T[],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "RDH Tekstil";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width ?? 18,
  }));
  sheet.getRow(1).font = { bold: true };
  for (const row of rows) {
    const record: Record<string, string> = {};
    for (const column of columns) {
      record[column.key] = cellText(column.value(row));
    }
    sheet.addRow(record);
  }
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

export async function exportTableResponse<T>(options: {
  format: ExportFormat;
  filenameBase: string;
  sheetName: string;
  columns: ExportColumn<T>[];
  rows: T[];
}): Promise<NextResponse> {
  const stamp = new Date().toISOString().slice(0, 10);
  if (options.format === "csv") {
    const csv = buildCsv(options.columns, options.rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${options.filenameBase}-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const buffer = await buildXlsx(options.sheetName, options.columns, options.rows);
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${options.filenameBase}-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
