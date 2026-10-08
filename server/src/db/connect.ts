import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Idempotent, cached connect — safe to call on every request in a serverless
 * environment (Vercel Functions reuse the module/connection across warm
 * invocations) as well as once at startup in a traditional long-running
 * process. Concurrent callers before the first connection resolves share the
 * same in-flight promise rather than racing separate `mongoose.connect()`
 * calls.
 */
export function connectDB(uri: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (!connectionPromise) {
    mongoose.set('strictQuery', true);
    connectionPromise = mongoose.connect(uri).catch((err) => {
      connectionPromise = null; // allow a retry on the next call instead of caching a permanent failure
      throw err;
    });
  }

  return connectionPromise;
}
