import { successResponse } from '../utils/apiResponse.js';
import {
  getNotificationsForUser,
  markAllNotificationsAsReadForUser,
  markNotificationAsReadForUser,
} from '../services/notification.service.js';

export async function listNotifications(req, res) {
  const data = await getNotificationsForUser(req.user.id, req.query);

  res.status(200).json(
    successResponse({
      message: 'Notifications loaded successfully',
      data,
    }),
  );
}

export async function markNotificationAsRead(req, res) {
  const data = await markNotificationAsReadForUser(req.user.id, req.params.notificationId);

  res.status(200).json(
    successResponse({
      message: 'Notification marked as read',
      data,
    }),
  );
}

export async function markAllNotificationsAsRead(req, res) {
  const data = await markAllNotificationsAsReadForUser(req.user.id);

  res.status(200).json(
    successResponse({
      message: 'All notifications marked as read',
      data,
    }),
  );
}
