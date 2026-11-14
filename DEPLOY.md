# FFR Diagnostic v3.4.1 — Deployment

1. Preserve your existing v3.3/v3.4 production deployment until staging passes.
2. Extract the release ZIP. Commit **all files at the GitHub repository root**, including `api/`, `engine/`, `rules/`, `data/`, `utils/`, `index.html`, `package.json`, `ffr-logo.png` and `vercel.json`.
3. Push a new branch and let Vercel generate a **Preview** deployment. Keep the project Root Directory set to the repo root; use the included `package.json` (Node 24.x as configured). Do not add generative AI API keys.
4. On the Preview domain: open `/api/health`, run a synthetic or authorized website audit, then upload `test-fixtures/fictional-fintech-annual-revenue.csv` or the matching PDF. Choose USD and declared annual revenue 1,250,000 to reconcile the fixture.
5. Verify the Decision Room is populated; download both PDF and Excel reports, open Excel in Microsoft Excel or another OOXML spreadsheet application, and inspect the four-series/one-series chart behavior. Click the professional-audit CTA and ensure it opens `https://flowforgerevenue.solutions/services.html`.
6. Check phone (320–390px), tablet (768px) and desktop (1440px) layouts, download behavior, and direct `/ffr-logo.png`.
7. If the preview passes, promote to production. The existing Cloudflare `ffr-audit-tool-proxy` and its routes should remain unchanged. Check `https://flowforgerevenue.solutions/audit-tool` and the `/audit-tool/ffr-logo.png` asset through the Worker.

**Important:** A user-uploaded narrative marketing report (including an older FFR Pomelo opportunity report) is not a company financial statement. The parser rejects unsupported revenue claims. The sample fixtures are **synthetic, not Pomelo financial information**.
