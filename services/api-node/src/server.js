import express from 'express';
import healthRouter from './routes/health.js';
import infoRouter from './routes/info.js';
import { requestId } from './middleware/requestId.js';
import { log } from './logger.js';
import { register } from './metrics.js';
import { metricsMiddleware } from './middleware/metrics.js';



const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestId);
app.use(metricsMiddleware);

// Define /metrics route before routers to ensure it's matched
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).json({ error: 'Failed to collect metrics', message: error.message });
  }
});

app.use('/health', healthRouter);
app.use('/info', infoRouter);


app.listen(PORT, () => {
  log('info', `api-node started listening on :${PORT}`);
});
