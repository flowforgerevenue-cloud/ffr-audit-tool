# Deployment — FlowForge Revenue Diagnostic v3.1.0

1. Create a clean GitHub repository and upload the contents of this project root (the files inside `ffr-audit-tool/`, not the enclosing folder).
2. Import that repository into Vercel.
3. Set the project Root Directory to `./` unless the repository contains this project inside a subfolder.
4. Deploy using Vercel standard project detection. Keep the `api/` directory at the repository root so Vercel automatically registers `/api/audit`, `/api/simulate`, and `/api/health` as Node Functions. The included `vercel.json` only rewrites `/admin` to `/admin.html`; it deliberately does not override API routing with legacy `builds` or `routes` rules.
5. Attach the existing diagnostic domain/path routing as already configured. The public entry path should remain `https://flowforgerevenue.solutions/audit-tool` through your current Cloudflare/Vercel routing.
6. Optional: set `FFR_ADMIN_PASSWORD` in Vercel for the operations page. Do not add payment credentials; the payment layer has been removed.
7. After deployment, verify `/api/health` reports version `3.1.0` and test POST requests to `/api/audit` and `/api/simulate`, then test one website diagnostic and one financial-document forecast. Download both PDF and Excel outputs.

Never upload `.env`, API secrets, or `.git` history. This package intentionally excludes them.
