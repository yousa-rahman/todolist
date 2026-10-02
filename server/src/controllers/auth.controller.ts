import type { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { comparePassword, hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';

function toPublicUser(user: { _id: unknown; username: string }) {
  return { id: String(user._id), username: user.username };
}

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  const existing = await UserModel.findOne({ username });
  if (existing) {
    throw ApiError.badRequest('Username is already taken', [
      { field: 'username', message: 'Username is already taken' },
    ]);
  }

  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({ username, passwordHash });

  const token = signToken({ sub: String(user._id), username: user.username });
  res.status(201).json({ user: toPublicUser(user), token });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  const isValid = user ? await comparePassword(password, user.passwordHash) : false;
  if (!user || !isValid) {
    throw ApiError.unauthorized('Invalid username or password');
  }

  const token = signToken({ sub: String(user._id), username: user.username });
  res.json({ user: toPublicUser(user), token });
}

export async function me(req: Request, res: Response) {
  const user = await UserModel.findById(req.user!.id);
  if (!user) {
    throw ApiError.unauthorized('Invalid or expired token');
  }
  res.json({ user: toPublicUser(user) });
}
