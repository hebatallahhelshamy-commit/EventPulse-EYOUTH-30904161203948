const Event = require('../models/event.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// 1. جلب جميع الفعاليات (مع الفلترة والبحث والصفحات والترتيب)
exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, search, sortBy, order, page, limit } = req.query;

  const filter = {};

  // الفلترة حسب التصنيف والمدينة
  if (category) filter.category = category;
  if (city) filter.city = city;

  // الفلترة حسب التاريخ
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  // البحث النصي في العنوان والوصف
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // الترتيب Safe Sorting
  const allowedSortFields = ['date', 'capacity'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = order === 'desc' ? -1 : 1;
  const sort = { [sortField]: sortDirection };

  // التقسيم لصفحات Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    Event.find(filter)
      .populate('category')
      .populate('organizer', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Event.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    status: 'success',
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data,
  });
});

// 2. جلب فعالية واحدة بالـ ID
exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('category')
    .populate('organizer', 'name email');

  if (!event) {
    return next(new AppError('الفعالية غير موجودة', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

// 3. إنشاء فعالية جديدة (Admin Only)
exports.createEvent = asyncHandler(async (req, res, next) => {
  const { title, description, category, date, city, venue, capacity } = req.body;

  const event = await Event.create({
    title,
    description,
    category,
    date,
    city,
    venue,
    capacity,
    organizer: req.user.userId,
  });

  res.status(201).json({
    status: 'success',
    data: event,
  });
});

// 4. تعديل فعالية (Admin Only)
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    return next(new AppError('الفعالية غير موجودة', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

// 5. حذف فعالية (Admin Only)
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('الفعالية غير موجودة', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'تم حذف الفعالية بنجاح',
  });
});