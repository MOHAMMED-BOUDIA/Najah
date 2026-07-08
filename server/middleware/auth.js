const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id, role: decoded.role };
    // Backwards compat: old tokens without role — fetch from DB once
    if (!req.user.role) {
      const user = await User.findById(decoded.id).select('role').lean().maxTimeMS(3000);
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user.role = user.role;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  };
};

module.exports = { auth, authorize };