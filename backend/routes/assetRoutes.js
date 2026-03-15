import express from 'express';
import { uploadAssetsAndCreateProducts } from '../controllers/assetController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

router.post('/upload-and-create', adminAuth, uploadAssetsAndCreateProducts);

export default router;