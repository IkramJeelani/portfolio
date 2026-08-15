# Ikram Jeelani — Engineering Portfolio

My personal portfolio: **[ikramjeelani.github.io/portfolio](https://ikramjeelani.github.io/portfolio/)**

Mechatronics engineering student — projects, experience, skills, certifications,
and education, with an interactive canvas robotic arm on the landing page
(3-link IK solver with servo-style PD control, joint limits, and an autonomous
pick-and-place demo).

Built with plain HTML, CSS, and JavaScript — no framework, no build step —
deployed straight to GitHub Pages.

## How it's put together

| File | Role |
|------|------|
| `data.js` | All site content (profile, sections, projects, certifications, …) as plain JS objects |
| `index.html` | Home page shell; `main.js` renders the sections from `data.js` in the configured order |
| `project.html` + `project.js` | Reusable project detail page (`?id=` selects the project) |
| `branding.js` | Shared chrome: favicon generation, theme toggle, header behaviour |
| `styles.css` | All styling — light/dark themes, responsive layout, animations |
| `scripts/sync-og-image.py` | Pre-commit hook (via `.githooks/`) that keeps the social-share image in sync with the default theme |

Notable details:

- **Theme-aware everything** — light/dark toggle with a circular view-transition
  reveal; the favicon, share image, and browser `theme-color` all follow the theme.
- **Custom PDF viewer** — certificates open in an in-page pdf.js modal
  (self-hosted, with an iframe fallback) instead of leaving the site.
- **Motion-safe** — every animation, including smooth scrolling, is disabled
  for visitors with reduced motion enabled.
- **No dependencies at runtime** except self-hosted pdf.js and Google Fonts.

## Run locally

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

(Opening `index.html` directly also works for a quick look.)
