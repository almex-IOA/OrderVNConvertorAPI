# OrderVN Convertor API

Express + TypeScript web API that converts an uploaded **CSV or XLSX** order file into a
fixed **target schema** (15 Hebrew columns) and returns the result as a downloadable CSV.

## Setup

```bash
npm install
npm run dev        # dev server with watch (tsx)
# or
npm run build && npm start
```

- **Web UI**: `http://localhost:3000` — log in with the API credentials, upload a file, download the converted CSV.
- **Swagger UI**: `http://localhost:3000/api-docs`

## Endpoint

### `POST /api/convert`

Multipart upload, field name `file` (`.csv` or `.xlsx`). Returns `converted.csv`
(UTF-8 with BOM so Excel renders Hebrew correctly).

```bash
curl -F "file=@input.xlsx" http://localhost:3000/api/convert -o converted.csv
```

Errors return JSON: `400` for a missing file / unsupported type, `500` otherwise.

## Target schema (output columns, in order)

שם מלא, טלפון נייד, רחוב, מספר בית, מספר דירה, עיר, תיאור פעולה, תיאור מוצר,
מספר הזמנה, נקלט ביום, מספר משלוח, הערות, נרכש מ, חברת משלוחים, סטטוס משלוח

## Project layout

- `src/schema/targetSchema.ts` — target columns + `TargetOrder` type (single source of truth)
- `src/services/fileParser.ts` — parse CSV/XLSX buffer into rows
- `src/services/mapper.ts` — **stub** input→target mapping (fill in once input schema is known)
- `src/services/csvWriter.ts` — target rows → CSV buffer (BOM)
- `src/controllers/convert.controller.ts` — request orchestration
- `src/routes/convert.route.ts` — route + multer upload
- `src/docs/openapi.ts` — OpenAPI spec for Swagger UI
- `src/app.ts`, `src/server.ts` — app wiring and bootstrap

## Status

Infrastructure complete. The column mapping in `src/services/mapper.ts` is a placeholder —
it currently emits empty target rows (one per input row). Provide an input file example to
implement the real mapping.
