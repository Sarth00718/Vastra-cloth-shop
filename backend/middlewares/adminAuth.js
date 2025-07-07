import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // You can store full user info in token payload (e.g., isAdmin)
    if (!decoded) {
      return res.status(403).json({ msg: 'Forbidden: Admins only' });
    }

    req.adminEmail = process.env.ADMIN_EMAIL

    next();
  } catch (error) {
    console.error("Admin JWT verification failed:", error.message);
    return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
  }
};

export default adminAuth;
