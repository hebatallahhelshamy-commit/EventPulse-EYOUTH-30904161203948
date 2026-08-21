function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'حدث خطأ في السيرفر';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `قيمة غير صالحة للحقل: ${err.path}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'هذه البيانات مسجلة بالفعل بالفيسبوك أو القاعدة';
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;