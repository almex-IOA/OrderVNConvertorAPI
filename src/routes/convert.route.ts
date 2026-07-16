import { Router } from 'express';
import multer from 'multer';
import { config } from '../config';
import { convert } from '../controllers/convert.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadBytes },
});

export const convertRouter = Router();

// Lightweight auth check for the UI login screen. Reaching this handler means the
// basicAuth middleware already validated the credentials.
convertRouter.get('/auth', (_req, res) => res.json({ ok: true }));

convertRouter.post('/convert', upload.single('file'), convert);
