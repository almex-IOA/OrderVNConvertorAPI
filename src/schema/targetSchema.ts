/**
 * Target (output) schema.
 *
 * Extracted from the reference workbook `d8b44b50d1c64d2fb4cef2cec1d563f4.26-07-14.xlsx`.
 * Every converted row must match this schema exactly: same 15 columns, same order,
 * same Hebrew headers. This file is the single source of truth — the mapper and the
 * CSV writer both import from here so headers and column order can never drift.
 */

export interface TargetOrder {
  /** שם מלא — Full name */
  fullName: string;
  /** טלפון נייד — Mobile phone */
  mobilePhone: string;
  /** רחוב — Street */
  street: string;
  /** מספר בית — House number */
  houseNumber: string;
  /** מספר דירה — Apartment number */
  apartmentNumber: string;
  /** עיר — City */
  city: string;
  /** תיאור פעולה — Action description */
  actionDescription: string;
  /** תיאור מוצר — Product description */
  productDescription: string;
  /** מספר הזמנה — Order number */
  orderNumber: string;
  /** נקלט ביום — Received-on date */
  receivedOn: string;
  /** מספר משלוח — Shipment number */
  shipmentNumber: string;
  /** הערות — Notes */
  notes: string;
  /** נרכש מ — Purchased from */
  purchasedFrom: string;
  /** חברת משלוחים — Shipping company */
  shippingCompany: string;
  /** סטטוס משלוח — Shipment status */
  shipmentStatus: string;
}

export interface TargetColumn {
  key: keyof TargetOrder;
  /** Exact Hebrew header text as it must appear in the output file. */
  header: string;
}

/** Ordered columns (A..O) with their exact Hebrew headers. */
export const TARGET_COLUMNS: readonly TargetColumn[] = [
  { key: 'fullName', header: 'שם מלא' },
  { key: 'mobilePhone', header: 'טלפון נייד' },
  { key: 'street', header: 'רחוב' },
  { key: 'houseNumber', header: 'מספר בית' },
  { key: 'apartmentNumber', header: 'מספר דירה' },
  { key: 'city', header: 'עיר' },
  { key: 'actionDescription', header: 'תיאור פעולה' },
  { key: 'productDescription', header: 'תיאור מוצר ' },
  { key: 'orderNumber', header: 'מספר הזמנה' },
  { key: 'receivedOn', header: 'נקלט ביום' },
  { key: 'shipmentNumber', header: 'מספר משלוח' },
  { key: 'notes', header: 'הערות' },
  { key: 'purchasedFrom', header: 'נרכש מ' },
  { key: 'shippingCompany', header: 'חברת משלוחים' },
  { key: 'shipmentStatus', header: 'סטטוס משלוח' },
];

/** An empty TargetOrder with every field present as an empty string. */
export function emptyTargetOrder(): TargetOrder {
  return {
    fullName: '',
    mobilePhone: '',
    street: '',
    houseNumber: '',
    apartmentNumber: '',
    city: '',
    actionDescription: '',
    productDescription: '',
    orderNumber: '',
    receivedOn: '',
    shipmentNumber: '',
    notes: '',
    purchasedFrom: '',
    shippingCompany: '',
    shipmentStatus: '',
  };
}
