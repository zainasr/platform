import crypto from 'crypto';
import { log } from '../logger.js';

export function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = id;
  res.setHeader('x-request-id', id);
  log('info', 'requestId middleware', { requestId: id });
  next();
}
