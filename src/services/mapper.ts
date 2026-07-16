import { InputRow } from './fileParser';
import { TargetOrder, emptyTargetOrder } from '../schema/targetSchema';

/**
 * Convert parsed input rows (the order-export schema) into the target schema.
 *
 * Input columns (Hebrew headers) -> target fields:
 *   שם לקוח        -> fullName
 *   טלפון          -> mobilePhone      (normalized to 0NN-NNNNNNN)
 *   כתובת          -> street + houseNumber (+ apartmentNumber when "house/apt")
 *   עיר            -> city
 *   שיטת משלוח     -> actionDescription
 *   מוצרים         -> productDescription
 *   מספר הזמנה     -> orderNumber
 *   תאריך הזמנה    -> receivedOn        (dd/mm/yyyy hh:mm -> yyyy-mm-dd)
 *   מספר משלוח     -> shipmentNumber
 *   הערות          -> notes
 *   מועדון         -> purchasedFrom
 *   משלוח          -> shipmentStatus
 * chevrat mishlochim (shippingCompany) and apartmentNumber have no source column.
 */
export function mapToTargetOrders(rows: InputRow[]): TargetOrder[] {
  return rows.map((row) => {
    const target = emptyTargetOrder();
    const { street, houseNumber, apartmentNumber } = parseAddress(str(row['כתובת']));

    target.fullName = str(row['שם לקוח']);
    target.mobilePhone = normalizePhone(str(row['טלפון']));
    target.street = street;
    target.houseNumber = houseNumber;
    target.apartmentNumber = apartmentNumber;
    target.city = str(row['עיר']);
    target.actionDescription = str(row['שיטת משלוח']);
    target.productDescription = str(row['מוצרים']);
    target.orderNumber = str(row['מספר הזמנה']);
    target.receivedOn = normalizeDate(str(row['תאריך הזמנה']));
    target.shipmentNumber = str(row['מספר משלוח']);
    target.notes = str(row['הערות']);
    target.purchasedFrom = str(row['מועדון']);
    // shippingCompany: no matching input column -> left empty.
    target.shipmentStatus = str(row['משלוח']);

    return target;
  });
}

/** Coerce any cell value to a trimmed string. */
function str(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Normalize an Israeli phone number to `0NN-NNNNNNN`.
 * Handles a leading Excel text-guard apostrophe and `+972` / `972` country codes.
 * Returns the cleaned input unchanged if it doesn't look like a 10-digit local number.
 */
function normalizePhone(raw: string): string {
  if (!raw) return '';
  let digits = raw.replace(/^'/, '').replace(/[\s-]/g, '');
  if (digits.startsWith('+972')) digits = '0' + digits.slice(4);
  else if (digits.startsWith('972')) digits = '0' + digits.slice(3);
  digits = digits.replace(/\D/g, '');

  if (digits.length === 10 && digits.startsWith('0')) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits || raw.replace(/^'/, '');
}

/**
 * Convert `dd/mm/yyyy hh:mm` (or `dd/mm/yyyy`) to ISO date `yyyy-mm-dd`.
 * Returns the original string if it doesn't match.
 */
function normalizeDate(raw: string): string {
  if (!raw) return '';
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return raw;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

/**
 * Split a free-text address into street, house number and (optional) apartment.
 * Examples:
 *   'ויצמן 33'    -> { street: 'ויצמן', houseNumber: '33' }
 *   'הנח"ל 10'    -> { street: 'הנח"ל', houseNumber: '10' }
 *   'ויצמן 33/5'  -> { street: 'ויצמן', houseNumber: '33', apartmentNumber: '5' }
 * If no trailing number is found, the whole value is treated as the street.
 */
function parseAddress(raw: string): {
  street: string;
  houseNumber: string;
  apartmentNumber: string;
} {
  if (!raw) return { street: '', houseNumber: '', apartmentNumber: '' };

  const m = raw.match(/^(.*\S)\s+(\d+)\s*(?:\/\s*(\d+))?\s*$/);
  if (!m) return { street: raw, houseNumber: '', apartmentNumber: '' };

  const [, street, houseNumber, apartmentNumber] = m;
  return {
    street: street.trim(),
    houseNumber,
    apartmentNumber: apartmentNumber ?? '',
  };
}
