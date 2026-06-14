# Ikram Jeelani — Engineering Portfolio

A simple, fast portfolio site built with plain HTML, CSS, and JavaScript — no build
step required, so it deploys to GitHub Pages instantly.

## Structure

| File | What it does |
|------|--------------|
| `index.html` | Home page: name/hero, project carousel, contact |
| `project.html` | Reusable detail page (loads a project via `?id=` in the URL) |
| `projects.js` | **Your project data** — edit this to add/change projects |
| `main.js` | Builds the cards and runs the carousel (next/prev, dots, swipe) |
| `project.js` | Renders the detail page for the selected project |
| `styles.css` | All styling (responsive, dark theme) |
| `assets/` | Project images |

## Customize it

1. **Your name / bio / contact** — edit the text in `index.html` (hero and contact
   sections) and the email/GitHub/LinkedIn links.
2. **Projects** — open `projects.js` and edit the `PROJECTS` array. Copy a `{ ... }`
   block to add a new one. Each project needs a unique `id`.
3. **Images** — drop your own pictures into `assets/` (e.g. `project1.jpg`) and update
   the `image:` field in `projects.js`.
4. **Colors** — tweak the variables at the top of `styles.css` (`:root { ... }`).

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
