# Discovr (Rebuilt)

A fully redesigned static social media frontend using modern glassmorphism UI and Airtable as the backend.

## What changed

- Complete UI + UX rewrite for all pages.
- New clean JavaScript architecture with shared core helpers.
- Removed hardcoded secrets from source logic.
- Added a dedicated credentials/config file: `airtable-config.js`.
- All links are GitHub Pages-friendly (relative paths).

---

## 1) Airtable setup (exact fields)

Create one Airtable **Base** and add these two tables.

### Table A: `users`

Create these fields exactly:

1. `username` → **Single line text** (unique usernames)
2. `password` → **Single line text**
3. `avatar` → **URL**
4. `about` → **Long text**
5. `dob` → **Date**
6. `gender` → **Single select** (`male`, `female`, `other`)
7. `isAdmin` → **Checkbox** (optional but recommended)
8. `postCount` → **Number** (optional; admin table displays it if present)

### Table B: `posts`

Create these fields exactly:

1. `userRecordId` → **Single line text** (store the Airtable record id of the user, e.g. `recxxxx`)
2. `imageUrl` → **URL**
3. `caption` → **Long text**
4. `likes` → **Number**
5. `createdAt` → **Date time**

---

## 2) Generate Airtable credentials

1. Open Airtable Developer Hub and create a **Personal Access Token**.
2. Give the token read/write permissions for records on this base.
3. Copy your **Base ID** from Airtable API docs.

---

## 3) Configure the app

Open `airtable-config.js` and replace:

- `REPLACE_WITH_YOUR_BASE_ID`
- `REPLACE_WITH_YOUR_PERSONAL_ACCESS_TOKEN`

You may also customize:

- `adminUsernames` (who can use admin login)
- table names if you used different names

---

## 4) Run locally

```bash
python3 -m http.server 4173
```

Open:

- `http://127.0.0.1:4173/index.html`

---

## 5) Deploy to GitHub Pages

Because all assets use relative paths, this repo works under:

- `https://<username>.github.io/<repo-name>/`

No additional path rewrites required.

---

## Security note

This is a static frontend app. Any token used client-side is visible in browser dev tools.
For production-grade security, move Airtable writes to a server/API proxy and keep tokens server-side.
