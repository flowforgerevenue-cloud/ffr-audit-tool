# SYNTHETIC TEST DATA — NOT A REAL FINTECH COMPANY

The data in this folder is entirely fictional. It must not be presented as evidence of any real company's financial performance.

* `fictional-fintech-annual-revenue.csv`: Three annual data rows with growth of 25% from 2024 to 2025; use annual declared revenue 1,250,000 and currency USD when testing upload.
* `fictional-fintech-conflicting-data.csv`: Duplicated conflicting 2025 row, designed to test rejection of ambiguous financial periods.
* `fictional-fintech-statement.pdf`: Synthetic text PDF containing the same annual revenue rows, also deliberately identified as fictional; browser PDF text extraction depends on the PDF.js CDN being reachable.

Expected: the engine labels the data as unaudited document content, does not infer missing customer metrics or recovery opportunities, and does not pretend there are four divergent forecasts without measured funnel evidence.
