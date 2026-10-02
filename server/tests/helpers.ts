import { UserModel } from '../src/models/User';
import { signToken } from '../src/utils/jwt';
import { hashPassword } from '../src/utils/password';

let counter = 0;

export async function createUserWithToken(username?: string, password = 'password123') {
  const uniqueUsername = username ?? `user${Date.now()}${counter++}`;
  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({ username: uniqueUsername, passwordHash });
  const token = signToken({ sub: String(user._id), username: user.username });
  return { user, token };
}
