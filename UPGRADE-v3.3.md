# FlowForge Revenue Diagnostic v3.3 — Deterministic refinement

## Changes
- Three role-based deterministic personas: CFO, enterprise buyer, investor. Structured challenges and replies; no AI/LLM calls.
- PDF report: executive decision, evidence provenance, concise sources, assumptions, debate and commercial CTA.
- Financial parser rejects numeric extraction from previously generated external audit/opportunity reports; never labels narrative numbers as observed revenue.
- Declared revenue is separately recorded; missing dated historical data is flagged.
- When all forecast scenarios overlap, the chart shows only the baseline series. This is a data limitation, not a graph bug.
- Excel retains detailed report worksheets, scenario values, and native chart; when scenarios coincide, only the baseline series is plotted.
- Existing API endpoints, branded asset logic, Cloudflare proxy, and deterministic simulation formulas preserved.

## Important limitations
- The forecast uses an explicitly disclosed illustrative 5% annual growth baseline without dated history. It is not an evidence-based prediction.
- The uploaded Pomelo Revenue Opportunity Report is a prior external diagnostic, **not** financial statements. Its benchmark/opportunity figures cannot be treated as historical revenue.
- PDFs and Excel are generated client-side via jsPDF/SheetJS/JSZip. Test the CDN scripts and downloaded documents in the deployed browser.
- Native Excel charts should be opened in Microsoft Excel for a compatibility check.
- No external AI API or key is required. Standard client-side chart/export CDN libraries remain.

## Deployment
Replace GitHub repo root files with the contents of this ZIP. Preserve Vercel settings and Cloudflare Worker. Test `/api/health`, audit, document forecast, PDF/Excel exports, CTA and responsive layouts.
