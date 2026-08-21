const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('يجب تسجيل الدخول أولاً للوصول لهذا الرابط', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // يحتوي على { userId, role }
    next();
  } catch (error) {
    return next(new AppError('التوكن غير صالح أو انتهت صلاحيته', 401));
  }
};

exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك صلاحية للقيام بهذا الإجراء', 403));
    }
    next();
  };
};