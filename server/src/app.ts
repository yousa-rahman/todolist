import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import todosRouter from './routes/todos.routes';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/todos', todosRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp();
