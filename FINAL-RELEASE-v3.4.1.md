# Final stabilization release — v3.4.1

## Completed and test-backed

1. **Determinism:** No AI services, no model APIs, no hallucinated personas. CFO, Buyer and Investor objections derive from the validated model conditions.
2. **Financial accounting safeguards:** Contracts/ACV acquisition sensitivity is separated from recognized revenue. Only comparable recurring run-rate basis can support conditional additive sensitivities; ratios exceeding opening run-rate trigger a HOLD and withheld speculative trajectories. Flat baseline when historical growth is unknown; observed growth is disclosed and limited to a -10% to +35% sensitivity band.
3. **Evidence quality:** Website facts observed in retrieved HTML versus unverified absence-of-language findings have different labels. Quantification requires source-linked observed evidence; claims of verified loss are prohibited.
4. **Data integrity:** ACV must be entered numerically, visitor volume must be qualified and monthly, selected currency must match document data, and contradictory/missing dates are not used to fabricate annual financial results. Old external opportunity/marketing reports are rejected as financial history.
5. **Audit and forecast:** Existing Vercel API contracts preserved, with disclosed provenance, calculation limits, reconciliation warnings and a single integrated CFO/Buyer/Investor decision room.
6. **Exports:** Full narrative PDF with clear page sections and financial hold notes; structured multi-sheet Excel including native line-chart XML, scenario and provenance sheets, evidence, assumptions, and decision review; fixed duplicate OOXML namespace in chart injection. Download controls remain below reports alongside paid-audit CTA.
7. **Responsive UI:** Checked 320, 390, 768, and 1440 px viewport widths; no page horizontal overflow detected in the test browser. Header retains only New Audit.

## Tests actually executed

- `npm test`: base audit integration/API smoke tests and v3.4/v3.4.1 financial integrity suites **passed**.
- All `.js` modules and extracted inline JavaScript passed `node --check`.
- Browser rendering checks with headless Chromium (320/390/768/1440 px) passed; audit Decision Room visible, header controls correct, console/page errors absent. Synthetic financial-document upload browser check passed.
- PDF download functions executed with a **mock jsPDF** implementation for both audit and forecast, including hyperlink and page-content assertions. This does **not** prove that jsPDF rendered an actual production PDF on every browser.
- Native OOXML chart injection tested against generated sample workbooks. All XML parts parsed; four-series and one-series chart packages imported with artifact_tool.
- ZIP package integrity checked.

## Boundaries and operational review

This system cannot assert observed revenue losses, statistically validated friction effects, audited financial accounts or credible investment forecasts from publicly available website content alone. Its severity-to-recovery parameters and scenario realization factors remain **disclosed illustration/sensitivity assumptions**. No external evidence validates their predictive accuracy.

The export libraries load over CDNs. Browsers need network access and may be affected by blocked third-party scripts. Actual rendering of exported PDFs in Acrobat, Excel native charts in Microsoft Excel on Windows/macOS, Safari/iOS and hosted Worker Vercel routes require a final staging acceptance check. The project cannot directly alter Vercel or Cloudflare deployments in this environment.

The included CSV/PDF fixture financial numbers describe a fictitious company only. Do not attribute them to Pomelo or another real business.
