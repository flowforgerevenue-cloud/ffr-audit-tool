# Deployment — FlowForge Revenue Diagnostic v3.1.0

1. Create a clean GitHub repository and upload the contents of this project root (the files inside `ffr-audit-tool/`, not the enclosing folder).
2. Import that repository into Vercel.
3. Set the project Root Directory to `./` unless the repository contains this project inside a subfolder.
4. Deploy using the included `vercel.json`. The project serves the static frontend, logo asset and Node API routes.
5. Attach the existing diagnostic domain/path routing as already configured. The public entry path should remain `https://flowforgerevenue.solutions/audit-tool` through your current Cloudflare/Vercel routing.
6. Optional: set `FFR_ADMIN_PASSWORD` in Vercel for the operations page. Do not add payment credentials; the payment layer has been removed.
7. After deployment, verify `/api/health` reports version `3.1.0`, then test one website diagnostic and one financial-document forecast. Download both PDF and Excel outputs.

Never upload `.env`, API secrets, or `.git` history. This package intentionally excludes them.
