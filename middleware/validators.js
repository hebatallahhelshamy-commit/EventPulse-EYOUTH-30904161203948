const { body, param } = require('express-validator');

exports.registerRules = [
  body('name').notEmpty().withMessage('الاسم مطلوب'),
  body('email').isEmail().withMessage('يرجى تقديم بريد إلكتروني صالح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة السر يجب ألا تقل عن 6 أحرف'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('يرجى تقديم بريد إلكتروني صالح'),
  body('password').notEmpty().withMessage('كلمة السر مطلوبة'),
];

exports.eventRules = [
  body('title').notEmpty().withMessage('عنوان الفعالية مطلوب'),
  body('description').notEmpty().withMessage('وصف الفعالية مطلوب'),
  body('category').isMongoId().withMessage('معرف التصنيف غير صالح'),
  body('date').isISO8601().withMessage('تاريخ الفعالية غير صالح'),
  body('city').notEmpty().withMessage('المدينة مطلوبة'),
  body('venue').notEmpty().withMessage('مكان الفعالية مطلوب'),
  body('capacity').isInt({ min: 1 }).withMessage('السعة يجب أن تكون رقماً أكبر من 0'),
];

exports.registrationRules = [
  body('event').isMongoId().withMessage('معرف الفعالية غير صالح'),
];