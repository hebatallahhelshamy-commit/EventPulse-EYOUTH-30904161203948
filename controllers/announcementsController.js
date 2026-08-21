const Message = require('../models/message.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// 1. إرسال إعلان جديد بواسطة Admin (POST /api/announcements)
exports.createAnnouncement = asyncHandler(async (req, res, next) => {
  const { eventId, text } = req.body;

  if (!eventId || !text) {
    return next(new AppError('يرجى تحديد الفعالية وكتابة نص الإعلان', 400));
  }

  // حفظ الإعلان في قاعدة البيانات
  const message = await Message.create({
    event: eventId,
    sender: req.user.userId,
    text,
  });

  // جلب تفاصيل المرسل لإرسالها عبر Socket
  const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');

  // إرسال الإعلان لحظياً لغرفة الفعالية الخاصة
  const io = req.app.get('io');
  if (io) {
    io.to(eventId).emit('announcement', populatedMessage);
  }

  res.status(201).json({
    status: 'success',
    data: populatedMessage,
  });
});

// 2. جلب سجل الإعلانات لفعالية معينة (GET /api/announcements/:eventId)
exports.getAnnouncements = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const messages = await Message.find({ event: eventId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});