import * as XLSX from 'xlsx';
import { TargetOrder, TARGET_COLUMNS } from '../schema/targetSchema';

/** UTF-8 byte-order mark — makes Excel open the CSV with correct Hebrew encoding. */
const BOM = '﻿';

/**
 * Render target orders as a CSV buffer: a Hebrew header row (in TARGET_COLUMNS order)
 * followed by one row per order. Prefixed with a BOM for Excel compatibility.
 */
export function toCsvBuffer(orders: TargetOrder[]): Buffer {
  const header = TARGET_COLUMNS.map((c) => c.header);
  const body = orders.map((order) => TARGET_COLUMNS.map((c) => order[c.key] ?? ''));

  const sheet = XLSX.utils.aoa_to_sheet([header, ...body]);
  const csv = XLSX.utils.sheet_to_csv(sheet);

  return Buffer.from(BOM + csv, 'utf8');
}
