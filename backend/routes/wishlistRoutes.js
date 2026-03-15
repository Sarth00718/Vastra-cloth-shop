import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/get', isAuth, getWishlist);
router.post('/toggle', isAuth, toggleWishlist);

export default router;
