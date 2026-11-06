const { cors, json, bodySize } = require('../utils/http');
const { runAudit } = require('../engine/auditEngine');

module.exports = async function auditHandler(req, res) {
  cors(res, req);
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method !== 'POST') return json(res, 405, { success: false, error: 'Method not allowed' });
  if (bodySize(req) > 1500000) return json(res, 413, { success: false, error: 'Request too large' });
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    if (!body.url || !body.company || !body.stage) {
      return json(res, 400, { success: false, error: 'Company, website and funding stage are required.' });
    }
    const result = await runAudit(body);
    if (!result || !result.audit || !Array.isArray(result.audit.pages) || !Array.isArray(result.audit.leaks)) {
      throw new Error('The diagnostic engine returned an incomplete report structure.');
    }
    return json(res, 200, {
      success: true,
      version: '3.1.0',
      full_report: result.audit,
      preview: result.preview,
      framework: 'FlowForge Revenue Quantification Framework v3.1'
    });
  } catch (error) {
    console.error('[FFR_AUDIT_ERROR]', error);
    return json(res, 500, {
      success: false,
      code: 'AUDIT_EXECUTION_FAILED',
      error: error && error.message ? error.message : 'The diagnostic could not be completed.'
    });
  }
};
