const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler Utility Unit Tests', () => {
  it('should execute the passed function successfully', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const req = {}, res = {}, next = jest.fn();

    await asyncHandler(fn)(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('should catch errors and pass them to next', async () => {
    const error = new Error('Async Error');
    const fn = jest.fn().mockRejectedValue(error);
    const req = {}, res = {}, next = jest.fn();

    await asyncHandler(fn)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});