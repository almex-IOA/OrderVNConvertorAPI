import { Request, Response, NextFunction } from 'express';
import { parseFile, UnsupportedFileTypeError } from '../services/fileParser';
import { mapToTargetOrders } from '../services/mapper';
import { toCsvBuffer } from '../services/csvWriter';
import { validateInputSchema } from '../schema/inputSchema';

/**
 * POST /api/convert
 * Accepts a multipart upload (field `file`) of a CSV or XLSX order file, converts each
 * row to the target schema, and returns the result as a downloadable CSV.
 */
export function convert(req: Request, res: Response, next: NextFunction): void {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded. Send a CSV or XLSX in the "file" field.' });
      return;
    }

    const { headers, rows } = parseFile(file.buffer, file.originalname);

    // Validation layer: reject files that aren't in the expected input schema.
    const validation = validateInputSchema(headers);
    if (!validation.valid) {
      res.status(422).json({
        error: 'הקובץ אינו תואם למבנה הנדרש',
        missing: validation.missing,
      });
      return;
    }

    const orders = mapToTargetOrders(rows);
    const csv = toCsvBuffer(orders);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.csv"');
    res.send(csv);
  } catch (err) {
    if (err instanceof UnsupportedFileTypeError) {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
}
