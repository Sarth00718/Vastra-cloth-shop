import express from 'express';
import {register, login, logout, googleLogin, adminLogin} from '../controllers/authController.js';

const router = express.Router();
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/googlelogin').post(googleLogin);
router.route('/adminlogin').post(adminLogin);

export default router;