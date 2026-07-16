import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';
import { convertRouter } from './routes/convert.route';
import { openapiSpec } from './docs/openapi';
import { basicAuth } from './middleware/basicAuth';

export function createApp() {
  const app = express();

  // Static web UI (public/ at the project root). Serves index.html at '/'.
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Health check.
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Swagger UI.
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

  // API routes — protected by HTTP Basic Auth.
  app.use('/api', basicAuth, convertRouter);

  // Central error handler — keeps responses consistent as JSON.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: `Upload error: ${err.message}` });
      return;
    }
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  });

  return app;
}
