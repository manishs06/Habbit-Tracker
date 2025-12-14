import express from 'express';
import {
  getDashboardStats,
  getChartData
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/charts/:fileId/:sheetName', getChartData);

export default router;

