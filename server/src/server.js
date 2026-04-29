import app from './app.js';
import { pingDatabase } from './config/db.js';
import { env } from './config/env.js';

const port = env.SERVER_PORT;

async function bootstrap() {
  try {
    await pingDatabase();
    console.log('Database connection established');
  } catch (error) {
    console.warn('Database connection not available at startup');
    console.warn(error.message);
  }

  app.listen(port, () => {
    console.log(`NOVA Store server listening on port ${port}`);
  });
}

bootstrap();
