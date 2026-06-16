# Ikram Jeelani — Engineering Portfolio

A simple, fast portfolio site built with plain HTML, CSS, and JavaScript — no build
step required, so it deploys to GitHub Pages instantly.

## Structure

| File | What it does |
|------|--------------|
| **`data.js`** | **Everything you edit:** your name/initials, projects, and contacts |
| `index.html` | Home page: name/hero, sections, contact |
| `project.html` | Reusable detail page (loads a project via `?id=` in the URL) |
| `branding.js` | Keeps the top-left logo and the browser-tab icon in sync from your initials |
| `main.js` | Builds the nav + sections (projects & certifications card grids) |
| `project.js` | Renders the detail page for the selected project |
| `styles.css` | All styling (responsive, dark theme) |
| `assets/` | Project images |

## Customize it — just edit `data.js`

Open **`data.js`**. Everything lives there:

1. **You** — set `name`, `initials` (shown top-left *and* as the tab icon, automatically
   matched), `role`, and `bio`.
2. **Page layout (order + visibility)** — the `SECTIONS` list at the top controls the
   order sections appear in. **Reorder** the page by reordering those lines; **hide** a
   section by deleting its line. A section also **hides itself automatically** when it
   has no content yet, so you can leave the line and it appears once you fill it in.
3. **Projects** — in the `PROJECTS` array, copy a `{ ... }` block to add one, or delete a
   block to remove one. Each project needs a unique `id`.
   - Projects show as a responsive card grid (2–3 columns).
   - **The detail page is free-form:** each project's `body` field is your own
     mini-page. Add headings, images, full-width images, captions, image galleries,
     video embeds, callouts, quotes, two-column layouts, etc. The full list of
     ready-made building blocks (with copy-paste snippets) is in the big comment
     above the `PROJECTS` array in `data.js`.
4. **About / Experience / Skills / Certifications / Education** — each has its own
   clearly-labelled block in `data.js` (`ABOUT`, `EXPERIENCE`, `SKILLS`,
   `CERTIFICATIONS`, `EDUCATION`). Edit the text or copy/delete entries to add or remove
   items. Experience renders as a centered timeline.
5. **Contacts** — in the `CONTACTS` array, add/remove `{ label, url }` lines. Use a
   `mailto:` URL for email; `https://` links open in a new tab.
6. **Images / logos** — drop pictures into `assets/` and point the relevant field at
   them: projects use `image:`, while **certifications, experience, and education each
   take an optional `logo:`** (issuer logo / company logo / university logo).
7. **Colors** — tweak the variables at the top of `styles.css` (`:root { ... }`).

### Extras
- **Animations** — sections gently fade/slide in as you scroll. Everything is disabled
  automatically for visitors who have "reduce motion" turned on.

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

## Search engines (SEO)

The site ships with: meta description/keywords/author, Open Graph + Twitter preview
tags, a `Person` JSON-LD block (rich results), a social banner (`assets/og.svg`),
`robots.txt`, and `sitemap.xml`.

These use the live URL **`https://ikramjeelani.github.io/portfolio/`**. If your site
lives somewhere else, update that URL in: `index.html` (canonical + `og:`/`twitter:`
tags + JSON-LD), `robots.txt`, and `sitemap.xml`.

After it's live, you can submit the site to
[Google Search Console](https://search.google.com/search-console) to speed up indexing.
For the richest social previews, export `assets/og.svg` to a 1200×630 PNG (some
platforms don't render SVG) and point the `og:image`/`twitter:image` tags at it.
