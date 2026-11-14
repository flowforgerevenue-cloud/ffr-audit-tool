# FlowForge Revenue Diagnostic — v3.4.1 report-clarity patch

This is a presentation/export-only update on top of v3.4.1. No financial formulas, API routes, model assumptions, payment integrations or server behavior are changed.

## Corrected
- Website audit and document-upload reports show only the comparison baseline when recovery sensitivities are withheld.
- A visible explanation replaces three identical Conservative/Base/Upside figures; withheld is distinguished from zero recovery.
- A suppressed conditional scenario no longer appears as a numerical forecast in exported PDF or Excel.
- Excel contains one baseline series and a 'NOT CALCULATED' scenario-status column when recovery is withheld. The chart injector continues to make one native chart series in that case.
- PDF avoids a full chart page for a flat, non-historical baseline; it retains the comprehensive text report and engagement CTA.
- The browser report uses 'Comparison baseline' rather than 'Status Quo (No Fix)' for non-observed growth.

## Scope and acceptance
- The validated sample previously declared USD 6,530,000 as annual revenue. A flat five-year comparison of USD 32,650,000 is mathematically correct (not an observed forecast).
- Re-test one withheld case and one admissible case where scenario accounting bases are comparable; ensure both PDF and Excel export successfully.
- The synthetic scenarios and deterministic methodology remain conditional, not empirically validated.
