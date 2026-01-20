import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok by node api' });
});

export default router;
