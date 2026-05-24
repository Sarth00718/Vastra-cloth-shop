import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if (!decoded.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid user token' });
    }
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export default isAuth;