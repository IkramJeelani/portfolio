# Ikram Jeelani — Engineering Portfolio

A simple, fast portfolio site built with plain HTML, CSS, and JavaScript — no build
step required, so it deploys to GitHub Pages instantly.

## Structure

| File | What it does |
|------|--------------|
| **`data.js`** | **Everything you edit:** your name/initials, projects, and contacts |
| `index.html` | Home page: name/hero, project carousel, contact |
| `project.html` | Reusable detail page (loads a project via `?id=` in the URL) |
| `branding.js` | Keeps the top-left logo and the browser-tab icon in sync from your initials |
| `main.js` | Builds the cards + runs the infinite carousel (next/prev, dots, swipe) |
| `project.js` | Renders the detail page for the selected project |
| `styles.css` | All styling (responsive, dark theme) |
| `assets/` | Project images |

## Customize it — just edit `data.js`

Open **`data.js`**. Everything lives there:

1. **You** — set `name`, `initials` (shown top-left *and* as the tab icon, automatically
   matched), `role`, and `bio`.
2. **Projects** — in the `PROJECTS` array, copy a `{ ... }` block to add one, or delete a
   block to remove one. Each project needs a unique `id`.
   - 3+ projects → looping carousel (one card centered, neighbors peeking).
   - 1–2 projects → shown side by side with no navigation.
   - **The detail page is free-form:** each project's `body` field is your own
     mini-page. Add headings, images, full-width images, captions, image galleries,
     video embeds, callouts, quotes, two-column layouts, etc. The full list of
     ready-made building blocks (with copy-paste snippets) is in the big comment
     above the `PROJECTS` array in `data.js`.
3. **Contacts** — in the `CONTACTS` array, add/remove `{ label, url }` lines. Use a
   `mailto:` URL for email; `https://` links open in a new tab.
4. **Images** — drop pictures into `assets/` (e.g. `project1.jpg`) and point the `image:`
   field at them.
5. **Colors** — tweak the variables at the top of `styles.css` (`:root { ... }`).

## Preview locally

Just open `index.html` in a browser. (For everything to behave exactly like the live
site, you can also run a tiny local server:)

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub.
   - For a site at `https://<username>.github.io`, name the repo **`<username>.github.io`**.
   - Otherwise any name works; the site will live at `https://<username>.github.io/<repo>`.
2. Push these files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick branch `main` and folder `/ (root)`, then **Save**.
4. Wait a minute, then visit the URL GitHub shows on that page. Done.

> Tip: every time you `git push`, GitHub Pages redeploys automatically.
