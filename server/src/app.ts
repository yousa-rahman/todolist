import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { connectDB } from './db/connect';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRouter from './routes/auth.routes';
import todosRouter from './routes/todos.routes';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  // Stays DB-independent on purpose, so it works as a liveness probe even if
  // Mongo is unreachable.
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  // Ensures a Mongo connection exists before any data route runs, regardless
  // of whether this app is started via index.ts's traditional listen() flow
  // or invoked per-request by a serverless platform. connectDB() is cached,
  // so this is a near-instant no-op once the first connection has resolved.
  app.use((_req, _res, next) => {
    connectDB(env.mongodbUri).then(() => next(), next);
  });

  app.use('/api/auth', authRouter);
  app.use('/api/todos', todosRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp();
