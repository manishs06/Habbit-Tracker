import express from 'express';
import {
  getFileData,
  getSheetData,
  updateCellData,
  exportSheet
} from '../controllers/data.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/file/:fileId', getFileData);
router.get('/file/:fileId/sheet/:sheetName', getSheetData);
router.put('/file/:fileId/sheet/:sheetName', updateCellData);
router.post('/file/:fileId/sheet/:sheetName/export', exportSheet);

export default router;

