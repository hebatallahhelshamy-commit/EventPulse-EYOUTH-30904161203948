const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// 1. تسجيل حساب جديد (Register)
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // التاكد من عدم وجود الايميل سابقاً
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('البريد الإلكتروني مُسجل بالفعل', 400));
  }

  // تشفير كلمة السر
  const hashedPassword = await bcrypt.hash(password, 12);

  // إنشاء المستخدم
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'attendee',
  });

  // إنشاء التوكن
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.status(201).json({
    status: 'success',
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// 2. تسجيل الدخول (Login)
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // جلب المستخدم مع كلمة السر المشفره
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('البريد الإلكتروني أو كلمة السر غير صحيحة', 401));
  }

  // مطابقة كلمة السر
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError('البريد الإلكتروني أو كلمة السر غير صحيحة', 401));
  }

  // إنشاء التوكن
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.status(200).json({
    status: 'success',
    token,
  });
});