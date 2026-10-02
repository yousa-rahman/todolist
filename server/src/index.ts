import app from './app';
import { env } from './config/env';
import { connectDB } from './db/connect';

async function main() {
  await connectDB(env.mongodbUri);
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${env.port}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
