import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import  isAuth  from '../middlewares/isAuth.js'

const router = express.Router();
router.route('/getcurrentuser').post(isAuth,getCurrentUser);

export default router;
