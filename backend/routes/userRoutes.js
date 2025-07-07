import express from 'express';
import { getAdmin, getCurrentUser } from '../controllers/usercontroller.js';
import  isAuth  from '../middlewares/isAuth.js'
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();
router.route('/getcurrentuser').post(isAuth,getCurrentUser);
router.route('/getadmin').post(adminAuth,getAdmin);

export default router;