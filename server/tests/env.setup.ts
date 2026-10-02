// Runs before the test framework and test files are loaded, so that
// src/config/env.ts (imported indirectly via src/app.ts) does not throw
// on a missing MONGODB_URI. The real connection used by the tests is
// established in setup.ts via mongodb-memory-server.
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/placeholder-not-used';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.PORT = '4000';
process.env.JWT_SECRET = 'test-jwt-secret-do-not-use-in-production';
