import mysql from 'mysql2/promise';

import { env } from './env.js';

export const dbPool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function pingDatabase() {
  const connection = await dbPool.getConnection();

  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}
