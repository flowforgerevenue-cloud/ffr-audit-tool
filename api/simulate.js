const { cors, json, bodySize } = require('../utils/http');
const { buildSimulation } = require('../engine/simulationEngine');
const { normalize } = require('../engine/financialEngine');

module.exports = async function simulateHandler(req, res) {
  cors(res, req);
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  if (req.method !== 'POST') return json(res, 405, { success: false, error: 'Method not allowed' });
  if (bodySize(req) > 3000000) return json(res, 413, { success: false, error: 'Request too large' });
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const company = String(body.company || '').trim();
    const currentRevenue = Number(body.currentRevenue);
    if (!company) return json(res, 400, { success: false, error: 'Company name is required.' });
    if (!Number.isFinite(currentRevenue) || currentRevenue <= 0) {
      return json(res, 400, { success: false, error: 'Enter a valid positive current annual revenue figure.' });
    }
    let decoded = '';
    if (body.fileContent) {
      const raw = String(body.fileContent);
      if (raw.length > 2800000) return json(res, 413, { success: false, error: 'Uploaded document is too large.' });
      decoded = Buffer.from(raw, 'base64').toString('utf8');
    }
    const financial = normalize({ text: decoded, declaredRevenue: currentRevenue });
    const simulation = buildSimulation({
      currentRevenue,
      opportunity: { available: false, reason: 'Document forecast is based on historical revenue and declared revenue; no website funnel opportunity is assumed.' },
      financial,
      confidence: financial.dataQuality === 'High' ? 'High' : 'Medium'
    });
    const report = {
      version: '3.1.0', kind: 'ffr-document-report', company,
      stage: body.stage || 'Not specified', acv: Number(body.acv || 0),
      financial, simulation, sourceType: body.fileType || 'document',
      createdAt: new Date().toISOString(),
      framework: 'FlowForge Revenue Quantification Framework v3.1'
    };
    if (!Array.isArray(report.simulation.years) || report.simulation.years.length !== 5) {
      throw new Error('The forecast engine did not produce five annual scenarios.');
    }
    return json(res, 200, {
      success: true, version: '3.1.0', full_report: report,
      financialSummary: {
        latestRevenue: financial.latestRevenue,
        dataQuality: financial.dataQuality,
        metrics: financial.metrics
      }
    });
  } catch (error) {
    console.error('[FFR_FORECAST_ERROR]', error);
    return json(res, 500, {
      success: false, code: 'FORECAST_EXECUTION_FAILED',
      error: error && error.message ? error.message : 'The forecast could not be completed.'
    });
  }
};
