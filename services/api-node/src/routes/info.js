import { Router } from 'express';
import { getCoreInfo } from '../services/coreGoClient.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await getCoreInfo(req.requestId);
    res.json({
      gateway: 'api-node',
      upstream: data,
    });
  } catch (err) {
    res.status(502).json({
      error: 'Bad Gateway',
      message: err.message,
      requestId: req.requestId,
    });
  }
});

export default router;
