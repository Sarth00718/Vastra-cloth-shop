import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
    }

    // New unified logic: Check user role from database using userId from token
    if (decoded.userId) {
        const user = await User.findById(decoded.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
        }
        req.adminEmail = user.email;
        req.userId = user._id;
    } 
    // Legacy support for admin-only tokens (if any still exist)
    else if (decoded.email && decoded.email === process.env.ADMIN_EMAIL) {
        req.adminEmail = decoded.email;
    } 
    else {
        return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
    }

    next();
  } catch (error) {
    console.error("Admin JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export default adminAuth;
