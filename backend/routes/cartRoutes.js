import express from 'express'
import  isAuth  from '../middlewares/isAuth.js'
import { addToCart, getCartUser, updateCart } from '../controllers/cartController.js';


const router = express.Router();
router.route('/get').post(isAuth,getCartUser);
router.route('/add').post(isAuth,addToCart);
router.route('/update').post(isAuth,updateCart);

export default router;