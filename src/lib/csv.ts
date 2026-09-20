export type CsvRow = Record<string, string>;

export function parseCsv(raw: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const input = raw.replace(/^\uFEFF/, "");

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers = [], ...records] = rows.filter((record) =>
    record.some((value) => value.trim().length > 0),
  );

  return records.map((record) =>
    Object.fromEntries(
      headers.map((header, index) => [header.trim(), record[index] ?? ""]),
    ),
  );
}

export function parseNumber(rawValue: string): number {
  const parsed = Number(rawValue.replace(/[^0-9.-]/g, ""));

  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseDurationHours(rawValue: string): number {
  const [hours = "0", minutes = "0", seconds = "0"] = rawValue
    .split(" ")[0]
    .split(":");
  const totalHours =
    Number(hours) + Number(minutes) / 60 + Number(seconds) / 3600;

  return Number(totalHours.toFixed(1));
}
