import { body } from 'express-validator';

const usernameChain = body('username')
  .isString()
  .withMessage('Username is required')
  .trim()
  .customSanitizer((v: string) => v.toLowerCase())
  .notEmpty()
  .withMessage('Username is required')
  .isLength({ min: 3, max: 30 })
  .withMessage('Username must be 3-30 characters')
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage('Username may only contain letters, numbers, and underscores');

const passwordChain = body('password')
  .isString()
  .withMessage('Password is required')
  .isLength({ min: 8, max: 72 })
  .withMessage('Password must be 8-72 characters');

export const registerValidators = [usernameChain, passwordChain];

export const loginValidators = [
  body('username').isString().withMessage('Username is required').trim().customSanitizer((v: string) => v.toLowerCase()).notEmpty().withMessage('Username is required'),
  body('password').isString().withMessage('Password is required').notEmpty().withMessage('Password is required'),
];
