import { check } from 'express-validator';
import { RequestHandler } from 'express';

export const validSignup: RequestHandler[] = [
  check('name', 'Name is required').notEmpty()
    .isLength({ min: 4, max: 32 }).withMessage('Fullname must be between 4 to 32 characters'),
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password', 'Password is required').notEmpty(),
  check('password')
  .trim()
  .isLength({ min: 6 }).withMessage('Password must contain at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number')
];

export const validLogin: RequestHandler[] = [
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password', 'Password is required').notEmpty(),
  check('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number')
];

export const forgotPasswordValidator: RequestHandler[] = [
  check('email')
  .trim()
  .notEmpty().withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
];


export const resetPasswordValidator: RequestHandler[] = [
  check('newPassword')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain a number')
];