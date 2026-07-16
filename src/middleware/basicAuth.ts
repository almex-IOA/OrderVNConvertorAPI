import { NextFunction, Request, Response } from 'express';
import { timingSafeEqual } from 'crypto';
import { config } from '../config';

/** Constant-time string comparison to avoid leaking length/content via timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison to keep timing uniform, then fail.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/**
 * HTTP Basic Auth guard. Rejects requests without valid `Authorization: Basic`
 * credentials matching the configured username/password.
 */
export function basicAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);

    const userOk = safeEqual(user, config.auth.username);
    const passOk = safeEqual(pass, config.auth.password);
    if (userOk && passOk) {
      next();
      return;
    }
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="OrderVN Convertor API", charset="UTF-8"');
  res.status(401).json({ error: 'Authentication required.' });
}
