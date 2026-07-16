import * as path from 'path';
import * as XLSX from 'xlsx';

/** Row shape after parsing: header text -> cell value. */
export type InputRow = Record<string, unknown>;

export class UnsupportedFileTypeError extends Error {
  constructor(ext: string) {
    super(`Unsupported file type "${ext}". Only .csv and .xlsx are accepted.`);
    this.name = 'UnsupportedFileTypeError';
  }
}

const SUPPORTED_EXTENSIONS = new Set(['.csv', '.xlsx']);

export interface ParsedFile {
  /** Trimmed header names from the first (header) row, in file order. */
  headers: string[];
  /** Data rows keyed by header text. */
  rows: InputRow[];
}

/**
 * Parse an uploaded CSV or XLSX buffer into its header row and an array of row
 * objects keyed by the header row. Both formats are handled by SheetJS; the first
 * worksheet is used.
 */
export function parseFile(buffer: Buffer, originalName: string): ParsedFile {
  const ext = path.extname(originalName).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new UnsupportedFileTypeError(ext || '(none)');
  }

  const workbook = XLSX.read(buffer, { type: 'buffer', raw: ext === '.csv' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { headers: [], rows: [] };
  }

  const sheet = workbook.Sheets[firstSheetName];

  // Header row as a raw array (header: 1 returns array-of-arrays).
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false });
  const headers = ((aoa[0] as unknown[]) || [])
    .map((h) => (h === null || h === undefined ? '' : String(h).trim()))
    .filter((h) => h.length > 0);

  // defval: '' ensures every column is present even when a cell is blank.
  const rows = XLSX.utils.sheet_to_json<InputRow>(sheet, { defval: '', raw: false });

  return { headers, rows };
}
