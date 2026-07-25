# Caledonia Technical Partners CRM — Next Version

A static, GitHub Pages-ready manufacturer partnership CRM.

## What changed

This version removes the awkward manufacturer dropdown workflow.

The CRM is now centred around company records:

1. Open a company.
2. Add one or more contacts.
3. Mark one contact as primary.
4. Generate an email using that contact automatically.
5. Open the message as a pre-filled Gmail draft.
6. Mark the email as sent.
7. The CRM schedules a follow-up five days later.
8. Generate a branded proposal from the same company record.

## Features

- Company-centred workspace
- Multiple contacts per company
- Primary-contact selection
- Automatic recipient selection
- Personalised initial and follow-up emails
- One-click Gmail compose
- Bulk draft generation
- Follow-up queue
- Proposal generator
- Save proposal as PDF
- Proposal vault
- Pipeline dashboard
- Activity timeline
- JSON backup and restore
- Responsive design
- GitHub Pages compatible
- Local browser storage

## Deploy to GitHub Pages

### Replace the existing repository

1. Download and unzip this package.
2. Back up your current repository.
3. Copy these files into the repository root:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.webmanifest`
   - `assets/favicon.svg`
4. Commit and push.
5. Open GitHub repository **Settings → Pages**.
6. Select **Deploy from a branch**.
7. Choose the `main` branch and `/root`.
8. Save.

GitHub Pages will rebuild the site.

## Important data note

Records are stored in `localStorage`, which means they belong to the browser and device where the CRM is used.

Use **Export data** regularly. Import the JSON backup to move records to another browser or device.

## Email safety

The CRM does not send emails automatically. It opens a pre-filled Gmail compose window so every message can be reviewed before sending.

Automatic sending would require Gmail OAuth, a secure backend, account permissions and additional security controls.

## Editing templates

Edit the `emailDraft()` function in `app.js`.

## Editing the proposal

Edit the `proposalHtml()` function in `app.js`.
