# FlowForge Revenue Diagnostic — Final Stabilization (v3.4.1)

Deterministic B2B fintech website diagnostics and financial-document revenue sensitivity tool. This is a complete Vercel-ready project; copy its files into the **repository root**, not an extra enclosing directory.

**No Groq, OpenAI, LLM calls, AI keys or paid inference APIs.** The CFO, enterprise buyer and investor discussion is rule-based, generated from the same input/evidence/financial objects as the report.

## What the product does

- Reviews public website HTML for source-linked surface observations and separately identifies unverified hypotheses. A missing phrase, crawler limitation or public-site observation **does not establish lost revenue**.
- Calculates explicitly *illustrative* sensitivity from qualified audience, stage benchmarks, a severity-derived friction scenario, actual user-entered ACV, and a user-entered/benchmark close rate. This is not audited revenue loss or a prediction.
- Models a five-year **comparison baseline** from compatible, dated historical annual revenue rows; without usable history it uses 0% flat comparison rather than invented growth.
- Withholds unsupported upside scenarios when run-rate and recognized-revenue bases differ, when opportunity cannot be reconciled with current reported run-rate, or when inputs are insufficient.
- Produces a deterministic CFO/buyer/investor challenge-and-response analysis and integrated HOLD/TEST/MEASURE decision.
- Provides browser reports, full-data PDF and Excel exports (native line chart, narrative appendix), and a CTA for the full professional audit.

## Run tests

`npm test`

Tests cover quantification, API contracts, HTML evidence, financial document/CSV parsing, currency incompatibilities, baseline reconciliation, unusable inputs and implausible opportunity withholding. Additional synthetic fixtures are in `test-fixtures/`.

## Architecture

- Vercel entry points: `api/audit.js`, `api/simulate.js`, `api/health.js`.
- Engines: `engine/`; evidence taxonomy in `rules/` and benchmarks in `data/`.
- Static client: `index.html`; logo `ffr-logo.png`; admin `admin.html`.
- `vercel.json` retains `/admin` rewrite. Existing Cloudflare Worker path mappings `/audit-tool*` and `/api/*` are expected to remain unchanged.
- Client report export uses JavaScript libraries loaded from third-party CDNs (SheetJS, JSZip, jsPDF, PDF.js, Chart.js). They are ordinary client libraries, **not AI services**. Internet connectivity is required to load them.

## Financial interpretation

A hypothetical monthly conversion of visitors into annual-contract buyers multiplied by 12 generates a **new-contract annualized run-rate sensitivity**. It must **not** be called recognized accounting revenue. The audit has a user-selected revenue basis: recognized annual revenue (default) or comparable annualized recurring run rate. Recognized revenue automatically withholds additive recovery forecasts; a recurring run-rate basis only allows distinct sensitivities when scale checks also pass. Do not infer any specific company's revenue or profitability from illustrative input data.

## Deployment and verification

See `DEPLOY.md` and `FINAL-RELEASE-v3.4.1.md`.
