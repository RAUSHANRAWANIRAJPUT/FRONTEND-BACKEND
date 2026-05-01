const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getTokenFromRequest = (req) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return authHeader.trim();
};

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(403).json({ message: 'Access Denied. No token provided.' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(verified.userId).select('-password');

    if (!currentUser) {
      return res.status(401).json({ message: 'User not found for this token.' });
    }

    req.token = token;
    req.user = {
      userId: currentUser._id.toString(),
      role: currentUser.role,
    };
    req.currentUser = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

// Middleware to check for Admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = req.currentUser || await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { verifyToken, isAdmin };
