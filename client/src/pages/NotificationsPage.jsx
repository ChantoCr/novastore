import { useMemo, useState } from 'react';

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from '../features/notifications/api/notificationsApi.js';

function formatDate(value) {
  if (!value) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function NotificationsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
  });
  const [feedback, setFeedback] = useState(null);

  const queryParams = useMemo(() => ({ ...filters }), [filters]);

  const { data, isLoading, isError, error } = useGetNotificationsQuery(queryParams);
  const [markNotificationAsRead, { isLoading: isMarkingSingle }] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data?.items || [];
  const pagination = data?.data?.pagination;
  const summary = data?.data?.summary;

  async function handleMarkOne(notificationId) {
    setFeedback(null);

    try {
      await markNotificationAsRead(notificationId).unwrap();
      setFeedback({
        type: 'success',
        message: 'Notification marked as read.',
      });
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not update the notification.',
      });
    }
  }

  async function handleMarkAll() {
    setFeedback(null);

    try {
      await markAllNotificationsAsRead().unwrap();
      setFeedback({
        type: 'success',
        message: 'All notifications were marked as read.',
      });
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: mutationError?.data?.message || 'Could not mark all notifications as read.',
      });
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Notifications</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Order and account activity</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Notification visibility is now part of the authenticated experience so shoppers can review
          checkout outcomes and other account messages in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Unread notifications</p>
          <p className="mt-3 text-2xl font-semibold text-white">{summary?.unreadCount ?? '—'}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5 md:col-span-2 xl:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Actions</p>
              <p className="mt-2 text-sm text-slate-300">
                Mark individual notifications or clear the unread backlog once you have reviewed recent
                activity.
              </p>
            </div>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={isMarkingAll || !summary?.unreadCount}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-100 transition hover:border-violet-400/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingAll ? 'Updating...' : 'Mark all as read'}
            </button>
          </div>
        </article>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
        <label className="text-sm text-slate-200">
          Read status
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({ ...current, page: 1, status: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="all">All notifications</option>
            <option value="unread">Unread only</option>
            <option value="read">Read only</option>
          </select>
        </label>
      </div>

      {feedback ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
              : 'border border-rose-400/20 bg-rose-500/10 text-rose-200'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
          Loading notifications...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error?.data?.message || 'Could not load notifications.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        notifications.length ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-3xl border p-6 ${
                  notification.isRead
                    ? 'border-white/10 bg-slate-950/60'
                    : 'border-violet-400/20 bg-violet-500/10'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-violet-300">{notification.type}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{notification.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{notification.message}</p>
                    <p className="mt-3 text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        notification.isRead
                          ? 'border border-white/10 bg-white/5 text-slate-300'
                          : 'border border-amber-400/20 bg-amber-500/10 text-amber-100'
                      }`}
                    >
                      {notification.isRead ? 'Read' : 'Unread'}
                    </span>
                    {!notification.isRead ? (
                      <button
                        type="button"
                        onClick={() => handleMarkOne(notification.id)}
                        disabled={isMarkingSingle}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-violet-400/30 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Mark as read
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-300">
            No notifications match the current filter.
          </div>
        )
      ) : null}

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} notification
            {pagination.totalItems === 1 ? '' : 's'}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
              className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
              className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default NotificationsPage;
