import { pingDatabase } from '../config/db.js';
import { successResponse } from '../utils/apiResponse.js';

export async function getApiHealth(_req, res) {
  res.status(200).json(
    successResponse({
      message: 'API is healthy',
      data: {
        service: 'nova-store-server',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    }),
  );
}

export async function getDatabaseHealth(_req, res, next) {
  try {
    await pingDatabase();

    res.status(200).json(
      successResponse({
        message: 'Database is reachable',
        data: {
          database: 'mysql',
          timestamp: new Date().toISOString(),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
}
