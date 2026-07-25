# Caledonia Technical Partners CRM — Fixed v3

This build uses versioned asset filenames to prevent GitHub Pages or the browser
from combining the new HTML with an older cached CSS or JavaScript file.

## Upload these files to the repository root

- index.html
- ctp-crm-v3.css
- ctp-crm-v3.js
- manifest.webmanifest
- assets/favicon.svg
- README.md

## Remove these old files

Delete these from the repository before or after uploading:

- styles.css
- app.js
- manifest.json

Keeping manifest.webmanifest is correct.

## Deployment

1. Delete the old files listed above.
2. Upload all files and the assets folder from this package.
3. Commit the changes.
4. Wait about 1–3 minutes for GitHub Pages.
5. Open the live website in a private/incognito window.
6. If needed, use Ctrl+Shift+R for a hard refresh.

Your existing CRM data may still exist in localStorage under the previous build.
Use the previous version's Export Data feature first if you need to preserve it.
