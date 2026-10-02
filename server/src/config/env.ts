import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy server/.env.example to server/.env and fill it in.`
    );
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  mongodbUri: required('MONGODB_URI'),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
