const AppError = require('../../utils/AppError');

describe('AppError Utility Unit Tests', () => {
  it('should create an operational error with fail status for 4xx codes', () => {
    const error = new AppError('Not Found', 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  it('should create an operational error with error status for 5xx codes', () => {
    const error = new AppError('Server Error', 500);
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
  });
});