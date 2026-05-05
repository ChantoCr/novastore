import { countAuditLogs, listAuditLogs } from '../repositories/audit.repository.js';

export async function getAuditLogs(query) {
  const page = query.page || 1;
  const limit = query.limit || 12;
  const action = query.action || 'all';
  const entityType = query.entityType || 'all';
  const search = query.search?.trim() || '';

  const [items, totalItems] = await Promise.all([
    listAuditLogs({ page, limit, action, entityType, search }),
    countAuditLogs({ action, entityType, search }),
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
      action,
      entityType,
      search,
    },
  };
}
