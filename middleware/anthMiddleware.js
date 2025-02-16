// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // 将解码后的 userId 存储在请求对象中
    next(); // 继续执行后续的请求处理
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
