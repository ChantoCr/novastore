import {
  countNotificationsByUser,
  countUnreadNotificationsByUser,
  findNotificationByIdForUser,
  listNotificationsByUser,
  markAllNotificationsAsReadByUser,
  markNotificationAsReadByIdForUser,
} from '../repositories/notification.repository.js';
import { AppError } from '../utils/appError.js';

export async function getNotificationsForUser(userId, query) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const status = query.status || 'all';
  const type = query.type?.trim() || '';

  const [items, totalItems, unreadCount] = await Promise.all([
    listNotificationsByUser({ userId, page, limit, status, type }),
    countNotificationsByUser({ userId, status, type }),
    countUnreadNotificationsByUser(userId),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
    filters: {
      status,
      type,
    },
    summary: {
      unreadCount,
    },
  };
}

export async function markNotificationAsReadForUser(userId, notificationId) {
  const notification = await findNotificationByIdForUser(notificationId, userId);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (!notification.isRead) {
    await markNotificationAsReadByIdForUser(notificationId, userId);
  }

  return {
    ...notification,
    isRead: true,
  };
}

export async function markAllNotificationsAsReadForUser(userId) {
  await markAllNotificationsAsReadByUser(userId);

  return {
    markedAllAsRead: true,
  };
}
