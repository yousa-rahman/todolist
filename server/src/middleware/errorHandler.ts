import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: { message: err.message, details: err.details } });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ error: { message: details[0]?.message ?? 'Validation failed', details } });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: { message: `Invalid ${err.path}: ${err.value}` } });
  }

  // eslint-disable-next-line no-console
  console.error('Unexpected error:', err);
  return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
}
