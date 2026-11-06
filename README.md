# FlowForge Revenue Diagnostic v3.1.0

A deterministic, self-service diagnostic for B2B fintech companies.

## Product behaviour
- Website funnel diagnostic with observable evidence, ranked friction signals, recommendations and transparent opportunity assumptions.
- Financial-document analysis and five-year scenario modelling.
- Full reports and PDF/Excel exports are available without payment, mandatory registration or an account.
- No checkout, payment verification, payment webhook, entitlement or paywall API is included.
- Deterministic calculations; no AI dependency.

## Local development
Requires Node.js 20+ (Vercel deployment is configured for Node.js 24).

```bash
npm test
```

For local API testing, run the project with Vercel CLI (`vercel dev`) so `/api/*` routes are available.

## Deployment
See `DEPLOY.md`. Do not commit `.env`; configure only the optional administrator secret in Vercel environment variables.
