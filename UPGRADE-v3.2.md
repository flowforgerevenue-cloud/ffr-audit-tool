# FlowForge Revenue Diagnostic v3.2 — Deterministic Upgrade

No generative AI, Groq, OpenAI, or API keys are used. Three evidence-grounded analytical perspectives are computed by `engine/perspectivesEngine.js` from existing rule-based evidence, financial calculations, and scenario outputs.

## Deploy

Upload the files in this ZIP to the **repository root**, not an enclosing folder. Keep existing Vercel project settings, Cloudflare Worker reverse-proxy routes, and `/audit-tool/` asset path logic unchanged. Do not add Vercel redirects to the branded Cloudflare path.

## Changes

- Complete audit and forecast content, including three analytical perspectives and integrated diagnosis.
- PDF export from the full server report, with a chart image when the report chart is available.
- Excel export with separate data sheets and a native OOXML line chart using SheetJS and JSZip.
- Download controls at the bottom of each report; only New Audit in result headers.
- Paid audit CTA links to https://flowforgerevenue.solutions/services.html.
- Mobile and tablet layout adjustments.
- Corrected `baselineGrowth` property serialization to return the computed numeric growth rate, not the helper function.

## Validation / limitations

`node api/test.js`, `node api/test-perspectives.js`, Node syntax checks and ZIP integrity checks are run locally. Browser-based exports require CDN availability for jsPDF, SheetJS, JSZip and Chart.js; these are **libraries**, not AI services or API keys. Native Excel chart embedding has not been tested in desktop Microsoft Excel, and must be verified after deployment. Cross-device layout has not been verified on physical devices. Keep the current deployment until you test both workflows.
