import { Router } from 'express';
import multer from 'multer';
import { config } from '../config';
import { convert } from '../controllers/convert.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadBytes },
});

export const convertRouter = Router();

convertRouter.post('/convert', upload.single('file'), convert);
