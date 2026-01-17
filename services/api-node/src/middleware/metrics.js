import { httpRequestsTotal, httpRequestDuration } from '../metrics.js';

export function metricsMiddleware(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;
    
    // Use req.path or req.originalUrl as fallback
    const path = req.route?.path || req.path || req.originalUrl || 'unknown';
    const status = res.statusCode.toString();

    httpRequestsTotal
      .labels(req.method, path, status)
      .inc();

    httpRequestDuration
      .labels(req.method, path, status)
      .observe(duration);
  });

  next();
}
