import { successResponse } from '../utils/apiResponse.js';
import { getAuditLogs } from '../services/audit.service.js';

export async function listAuditLogs(req, res) {
  const data = await getAuditLogs(req.query);

  res.status(200).json(
    successResponse({
      message: 'Audit logs loaded successfully',
      data,
    }),
  );
}
