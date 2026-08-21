const Registration = require('../models/registration.model');
const Event = require('../models/event.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// 1. التسجيل في فعالية (POST /api/registrations)
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const { event: eventId } = req.body;

  // أ. التأكد من وجود الفعالية
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('الفعالية غير موجودة', 404));
  }

  // ب. التأكد من عدم التسجيل المسبق لنفس المستخدم
  const existingRegistration = await Registration.findOne({
    event: eventId,
    attendee: userId,
  });
  if (existingRegistration) {
    return next(new AppError('أنت مسجل بالفعل في هذه الفعالية', 400));
  }

  // ج. التحقق من سعة الفعالية (Capacity Enforcement)
  const currentCount = await Registration.countDocuments({ event: eventId });
  if (currentCount >= event.capacity) {
    return next(new AppError('عذراً، هذه الفعالية اكتملت سعتها بالكامل', 400));
  }

  // د. إنشائ التسجيل
  const registration = await Registration.create({
    event: eventId,
    attendee: userId,
  });

  res.status(201).json({
    status: 'success',
    data: registration,
  });
});

// 2. عرض تذاكري/تسجيلاتي (GET /api/registrations/my)
exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  const registrations = await Registration.find({ attendee: userId }).populate({
    path: 'event',
    populate: { path: 'category organizer', select: 'name email' },
  });

  res.status(200).json({
    status: 'success',
    results: registrations.length,
    data: registrations,
  });
});

// 3. إلغاء التسجيل (DELETE /api/registrations/:id)
exports.cancelRegistration = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const registrationId = req.params.id;

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    return next(new AppError('التسجيل غير موجود', 404));
  }

  // التأكد أن المستخدم يلغي تسجيله الخاص فقط
  if (registration.attendee.toString() !== userId) {
    return next(new AppError('يمكنك إلغاء تسجيلك الخاص فقط', 403));
  }

  await registration.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'تم إلغاء التسجيل بنجاح',
  });
});