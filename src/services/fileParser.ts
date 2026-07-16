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

/**
 * Parse an uploaded CSV or XLSX buffer into an array of row objects keyed by the
 * header row. Both formats are handled by SheetJS; the first worksheet is used.
 */
export function parseFile(buffer: Buffer, originalName: string): InputRow[] {
  const ext = path.extname(originalName).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new UnsupportedFileTypeError(ext || '(none)');
  }

  const workbook = XLSX.read(buffer, { type: 'buffer', raw: ext === '.csv' });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return [];
  }

  const sheet = workbook.Sheets[firstSheetName];
  // defval: '' ensures every column is present even when a cell is blank.
  return XLSX.utils.sheet_to_json<InputRow>(sheet, { defval: '', raw: false });
}
