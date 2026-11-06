const { cors, json } = require('../utils/http');

module.exports = async function health(req, res) {
  cors(res, req);
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method !== 'GET') return json(res, 405, { success: false, error: 'Method not allowed' });
  return json(res, 200, {
    success: true,
    service: 'FlowForge Revenue Diagnostic',
    version: '3.1.0',
    engine: 'deterministic',
    payments: false,
    registration_required: false,
    ai_dependencies: false
  });
};
