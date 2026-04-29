import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((value) => value.trim()),
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authLimiter);
app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to NOVA Store server',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
