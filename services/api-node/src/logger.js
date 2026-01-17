export function log(level, message, meta = {}) {
    const logEntry = {
      level,
      message,
      service: 'api-node',
      timestamp: new Date().toISOString(),
      ...meta,
    };
  
    console.log(JSON.stringify(logEntry));
  }
  