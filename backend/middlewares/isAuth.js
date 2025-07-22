import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  try {
  const { token } = req.cookies || req.headers.authorization?.split(' ')[1] || {};
    //console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
  }
};

export default isAuth;