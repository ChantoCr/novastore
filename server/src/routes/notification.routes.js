import { Router } from 'express';

import {
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../controllers/notification.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  listNotificationsQuerySchema,
  notificationIdentifierSchema,
} from '../validators/notification.validators.js';

const notificationRouter = Router();

notificationRouter.use(authenticateToken);

notificationRouter.get('/', validateRequest({ query: listNotificationsQuerySchema }), asyncHandler(listNotifications));
notificationRouter.patch('/read-all', asyncHandler(markAllNotificationsAsRead));
notificationRouter.patch(
  '/:notificationId/read',
  validateRequest({ params: notificationIdentifierSchema }),
  asyncHandler(markNotificationAsRead),
);

export default notificationRouter;
