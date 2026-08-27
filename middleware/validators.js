const { body } = require('express-validator');

exports.registerRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.loginRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

exports.eventRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('category')
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('date')
    .isISO8601()
    .withMessage('Invalid event date'),

  body('city')
    .notEmpty()
    .withMessage('City is required'),

  body('venue')
    .notEmpty()
    .withMessage('Venue is required'),

  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be greater than 0'),
];

exports.updateEventRules = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),

  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid event date'),

  body('city')
    .optional()
    .notEmpty()
    .withMessage('City cannot be empty'),

  body('venue')
    .optional()
    .notEmpty()
    .withMessage('Venue cannot be empty'),

  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be greater than 0'),
];

exports.registrationRules = [
  body('event')
    .isMongoId()
    .withMessage('Invalid event ID'),
];

exports.announcementRules = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID'),

  body('text')
    .notEmpty()
    .withMessage('Announcement text is required'),
];