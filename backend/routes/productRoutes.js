import express from 'express';
import {
  addProduct,
  listProduct,
  getSingleProduct,
  removeProduct,
  removeAllProducts,
  updateProduct,
} from '../controllers/productController.js';
import adminAuth from '../middlewares/adminAuth.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Public
router.get('/list', listProduct);
router.get('/:id', getSingleProduct);

// Admin
router.post(
  '/addproduct',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);
router.put('/:id', adminAuth, updateProduct);
router.post('/remove/:id', adminAuth, removeProduct);
router.delete('/all', adminAuth, removeAllProducts);

export default router;
