import { after, before } from 'node:test';

import { dbPool, pingDatabase } from '../../src/config/db.js';

export function registerDatabaseLifecycle() {
  before(async () => {
    try {
      await pingDatabase();
    } catch (error) {
      throw new Error(
        `Database connection failed for integration tests: ${error.message}. If you are running the server tests from the host machine, create a root .env.test with DB_HOST=localhost (see .env.test.example). For Docker-based runs, prefer running the tests inside the server container.`,
      );
    }
  });

  after(async () => {
    await dbPool.end();
  });
}
