import express from 'express';
import {
  uploadFile,
  getFiles,
  getFile,
  deleteFile
} from '../controllers/file.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload, handleUploadError } from '../middlewares/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/upload', upload.single('file'), handleUploadError, uploadFile);
router.get('/', getFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

export default router;

