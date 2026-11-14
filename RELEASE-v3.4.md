# FlowForge Revenue Diagnostic v3.4 — deterministic integrity release

## Changes
- Reconciles annual opportunity from monthly qualified visitors with exactly one 12x annualization.
- Removes invented default ACV. Requires valid ACV, qualified volume and source-linked evidence before monetary quantification.
- Rejects out-of-range close rates, inconsistent demo/visitor counts, and unqualified traffic declarations.
- Preserves explicit source provenance and labels friction as a severity-derived sensitivity assumption, not measured recoverable loss.
- Adds forecast plausibility flag when modeled annual opportunity exceeds declared annual revenue. Does not silently cap or alter user figures.
- Uses annualized observed historical revenue growth only when at least two dated periods are present; otherwise discloses the 5% illustration.
- Adds deterministic model reconciliation and input warnings.
- CFO, enterprise buyer and investor challenge actual model conditions, with HOLD / TEST / MEASURE outcomes.
- Removes duplicate persona section and shows review in Decision Room.
- Adds optional currency selectors, warning banners and retains existing PDF/Excel exports and paid audit CTA.

## Important limitations
- Severity-derived recoverability is an assumption, not a statistically established causal effect.
- Scenario realization multipliers are sensitivities, not validated probabilities.
- Browser and Excel/PDF rendering require preview deployment testing.
- Currency is not converted; no FX rates are called.
- Existing report exporters are retained; they have not been comprehensively redesigned in this release.
- Public website crawl evidence may be incomplete, especially on JavaScript-heavy sites.

## Deployment
Upload ZIP contents at repository root. Deploy to Vercel Preview first. Preserve Cloudflare Worker routes. Run `npm test` and manually test both audit and document forecast and both exports before production.
