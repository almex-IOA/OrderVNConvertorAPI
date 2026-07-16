/**
 * Expected input (source) schema — the order-export file the service converts from.
 *
 * These are the Hebrew column headers a valid upload must contain. Validation is a
 * subset check: the uploaded file must include every column listed here (extra
 * columns are tolerated). If any are missing, the file is not in the expected schema.
 */
export const EXPECTED_INPUT_COLUMNS: readonly string[] = [
  'מספר הזמנה',
  'מזהה חיצוני',
  'מקור',
  'מועדון',
  'שם לקוח',
  'טלפון',
  'אימייל',
  'כתובת',
  'עיר',
  'מיקוד',
  'תאריך הזמנה',
  'סכום כולל',
  'סכום ששולם',
  'קוד קופון',
  'סטטוס תשלום',
  'סטטוס זרימת עבודה',
  'קוד סטטוס (מקורי)',
  'שיטת משלוח',
  'משלוח',
  'מספר משלוח',
  'מספר מעקב',
  'מוצרים',
  'כמות פריטים',
  'הערות',
  'הערות שירות',
  'מזהה יבואן',
];

export interface SchemaValidationResult {
  valid: boolean;
  /** Expected columns that are absent from the uploaded file. */
  missing: string[];
}

/**
 * Validate that the uploaded file's headers contain every expected input column.
 * Comparison is trimmed and order-independent.
 */
export function validateInputSchema(headers: string[]): SchemaValidationResult {
  const present = new Set(headers.map((h) => h.trim()));
  const missing = EXPECTED_INPUT_COLUMNS.filter((col) => !present.has(col));
  return { valid: missing.length === 0, missing };
}
