// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { id: decoded.id }; // You can also populate full user here if needed
  next();
});
