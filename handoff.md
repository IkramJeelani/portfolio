# Portfolio — Handoff Doc

Last updated: 2026-08-23. This document exists so a future session (or future you)
can pick this project back up cold, with zero re-discovery cost.

## 1. What this is

A static personal portfolio site for Ikram Jeelani (mechatronics engineering
student). No framework, no build step, no `node_modules`, no bundler — just
plain HTML/CSS/JS deployed straight from the `main` branch via GitHub Pages
at `https://ikramjeelani.github.io/portfolio/`.

Everything a visitor sees is generated at page-load time in the browser from
one data file. There is no CMS, no backend, no database.

## 2. File map

```
index.html          Home page shell — header/nav, hero (name+about+photo), empty
                     <section> containers that main.js fills in, footer.
project.html         Project detail page shell — filled in by project.js.
404.html             Branded not-found page (GitHub Pages serves this on 404).
data.js              THE content file. Everything editable lives here. See §3.
main.js              Home-page logic only (guarded by `if (!sectionsRoot) return`).
                     Builds every section from SECTIONS + fills the hero.
project.js           Project-detail-page logic. Resolves ?id=, renders the
                     project, builds the floating "other projects" dock,
                     prev/next pager, meta tags, JSON-LD.
branding.js          Shared across both pages: theme toggle (light/dark with
                     view-transition circle reveal), scroll-progress bar,
                     hamburger menu, favicon/theme-color sync.
styles.css           All styling. Design tokens in :root / :root[data-theme=light].
sitemap.xml          Manually maintained — MUST be updated by hand if you add,
                     remove, or rename (title-change) a project. See §7.
robots.txt           Standard, points at sitemap.xml.
assets/              Images, PDFs, logos — see §6 for what's actually used.
```

There is no `package.json`, no build tooling, no test suite. "Deploying" is
just `git push` to `main`.

## 3. `data.js` — the content model

This is the only file meant to be hand-edited for day-to-day content changes.
It's organized into numbered sections, each with a doc-comment above it
explaining every field. Read `data.js` itself first — this section only
covers things that aren't obvious from those comments, or that changed
recently.

- **`SETTINGS.theme`** — `"light"` or `"dark"`, the default a first-time
  visitor sees (they can still toggle it).
- **`PROFILE.photo`** — hero photo. `""`/falsy centers the About text instead
  of splitting it into text+photo. Currently `assets/my_image.jpeg`.
- **`RESUME.show`** — currently `false`. `assets/Resume.pdf` **does not exist
  on disk**. If you flip `show` to `true` without adding the file, the nav
  button will 404. This has been a known gap the whole session — never
  resolved because no resume file was ever supplied.
- **`SECTIONS`** — controls both order and visibility of home-page sections.
  `"experience"` is currently **commented out** (`SECTIONS` is
  `["projects", "skills", "certifications", "education", "contact"]`), so the
  Experience section is hidden on the live site right now. It was briefly
  uncommented by a manual user edit earlier in the session, then commented
  back out — check the live file before assuming either state.
- **`EXPERIENCE`** — ⚠️ **still contains placeholder content**, never
  replaced with real data: company names "Acme Robotics" / "University Lab",
  and a literal copy-paste bug in the first bullet point (the sentence
  "Built automated test fixtures that cut QA time by ~30%." is duplicated
  back-to-back verbatim). Currently hidden (see `SECTIONS` above), but will
  go live as-is the moment `"experience"` is uncommented — fix the content
  before doing that.
- **`PROJECTS[].id`** — as of this session, **optional**. If omitted, it's
  auto-derived from `title` at load time via a `slugify()` IIFE at the
  bottom of `data.js` (lowercase, non-alphanumeric runs collapsed to a
  single `-`, trimmed). This is also the project's URL
  (`project.html?id=...`), so:
  - Renaming a project's `title` **changes its URL** unless you pin an
    explicit `id`.
  - If you care about a stable/bookmarkable URL, set `id` explicitly instead
    of relying on the auto-derivation.
  - The current single project has no explicit `id`; it resolves to
    `dc-fan-speed-controller-using-8051`. This exact string is hardcoded in
    `sitemap.xml` (see §7) — if the title ever changes, that file needs a
    manual update too, since it doesn't run the slugify logic.
- **`PROJECTS[].share`** — a plain `true`/`false` boolean field, **not wired
  to any UI**. This was explicitly requested as just a per-project flag for
  future reference — nothing reads it yet. Don't be surprised it does
  nothing.
- **`PROJECTS`** currently has exactly **one entry** — the DC Fan Speed
  Controller project (real coursework, MSE 352, Simon Fraser University).
  Three earlier placeholder entries (smart-thermostat, bridge-sensor-net,
  robotic-arm) were deleted by the user directly. Their orphaned SVG
  assets are still on disk — see §6.

## 4. Design system (current, final state)

Palette is **black & white + one purple accent** — this was a deliberate,
explicit, final decision after a long back-and-forth exploration (including
one revert-then-un-revert cycle). Do not reintroduce multi-color gradients
without being asked again.

- Color tokens live in `:root` (dark, default) and `:root[data-theme="light"]`
  in `styles.css`: `--bg`, `--bg-soft`, `--card`, `--border`, `--text`,
  `--text-body`, `--muted`, `--accent`, `--accent-hover`, `--accent-rgb`.
- `--grad` / `--grad-btn` are **flat solid colors now**, not real gradients —
  the names are legacy from when they were gradients; don't assume
  multi-stop CSS gradients exist anywhere in the current stylesheet.
- Radius scale: `--radius-xs:6px`, `--radius-sm:8px`, `--radius:12px`,
  `--radius-pill:999px`. Use these tokens, not magic numbers, for any new
  rounded element.
- `--max:1100px` is the default `.section` content width. The
  certifications section overrides this to `1150px` (see §5) — if you add
  another section that needs 3-wide cards at a similar card width, you may
  hit the same overflow issue.
- When changing anything that affects contrast, the established technique
  this session was to compute WCAG relative-luminance contrast ratios with a
  quick Python script rather than eyeballing it — worth doing again for any
  future palette tweak.

## 5. Features built this session (current state)

### Hero: About + photo
- No more robot arm. It was fully built (SETTINGS.heroArm toggle, ~600
  lines of canvas/IK-solver code in main.js) and then **fully removed** per
  explicit instruction. There is zero trace of it left — confirmed via
  repeated greps for `hero-arm`, `hero-visual`, `setupHeroArm`, `heroArm`.
- `.hero` is a simple centered flex column now. `.hero-right` is a card
  (same visual language as `.card`/`.project-page`) containing the name,
  About text, and — if `PROFILE.photo` is set — the photo, laid out as a row
  (`.hero-right.has-photo`) on desktop and stacked on mobile (≤700px).
- Mobile-specific fixes applied: photo `align-self:center` (was defaulting
  to `flex-start` because a fixed-size image can't actually `stretch`), and
  reduced hero/card padding + photo size to cut mobile viewport-height
  overflow.

### Certifications
- Each card now shows a **preview image** of the actual certificate (top
  strip, `object-fit:contain` — never crops, always shows the whole
  document, letterboxed with a white background) above the existing
  logo/name/date row.
- Preview images (`assets/Certifications/previews/*.jpg`) were generated
  from the real credential PDFs via PyMuPDF (`fitz`), rendering each PDF's
  first page to a JPG at 1200px-long-edge/quality-90.
- Card width is `340px` (final value after several iterations), and the
  certifications `.section` has its own `max-width:1150px` override — the
  default `1100px` only leaves enough room for 2 cards per row at this
  width, not 3.
- An earlier "cert dock" feature (a side panel inside the PDF-viewer modal
  listing every other cert) was built, then **fully removed** per explicit
  correction — don't confuse this with the still-present, unrelated
  `.project-dock` on the project detail page (§ below), which the user did
  **not** ask to remove.

### Project detail page
- `.project-hero` (the big image at the top of a project page) is
  `aspect-ratio: 5/4` — deliberately matched to the project **card's**
  crop (300×240 = 5:4) so the same image looks consistent in both places.
- Layout order: title → tagline → date → tags → hero image → body → links →
  pager. (Image was explicitly moved to sit right under the tags.)
- A floating `.project-dock` (quick-jump panel listing other projects,
  collapsible, persists collapsed/expanded state in `localStorage` under
  `dockHidden`) is still present and untouched. **Not explicitly
  re-verified visually**, but by code inspection: with only one project in
  `PROJECTS`, this dock still renders — it lists all projects including the
  current one (marked "Now viewing"), so it degrades to a single-row panel
  rather than breaking or disappearing. The prev/next pager at the bottom
  (`pagerHtml`) correctly renders empty when there's nothing to page to
  (`prevP`/`nextP` both null with one project).
- A "Share" feature was requested, misread as a UI feature (Web Share API +
  clipboard button), built, then explicitly corrected to just be the plain
  `share: true/false` data field described in §3. No share UI exists
  anywhere in the codebase — confirmed via grep for `shareBtn`, `shareHtml`,
  `shareUrl`, `navigator.share`.

## 6. Assets — what's real vs. orphaned

- `assets/my_image.jpeg` — hero photo, resized to 900px-long-edge/~141KB
  (was 2.4MB/2308×3024 originally).
- `assets/Projects/fan-speed-controller/` — the one real project's assets:
  `display.jpg` (card/hero image, resized to 1400px/~323KB),
  `breadboard-1.jpg`, `breadboard-2.jpg`, `circuit-diagram.jpg` (all
  extracted from the actual PDF report via PyMuPDF), `fan-speed-controller.c`
  (the real firmware, linked as "View Code"), `report.pdf` (the real
  academic report, linked as "View Report"). This folder was renamed
  mid-session from `motor-speed-controller` — if you ever see a stale
  reference to that old name anywhere, it's a leftover bug, not intentional.
- `assets/Certifications/previews/*.jpg` — 10 real PyMuPDF-rendered
  thumbnails, one per certification PDF.
- ⚠️ **`assets/project1.svg`, `project2.svg`, `project3.svg` are orphaned.**
  These were placeholder gradient images for the three now-deleted
  placeholder projects. Confirmed via grep across every HTML/CSS/JS file —
  zero references anywhere. Safe to delete whenever you want to tidy up;
  never got around to it this session.
- `assets/og-image-light.png` / `og-image-dark.png` — social-preview
  images, generated via headless-Edge screenshot of the hero at 1200×630 in
  each theme. **Regenerate these any time a change visibly affects the
  hero's rendered appearance** (not for changes elsewhere on the page). Do
  this by toggling `SETTINGS.theme` light↔dark, capturing each, then
  reverting `data.js` back and confirming `git diff data.js` is empty before
  committing the two PNGs.

## 7. `sitemap.xml` — manual, not generated

There is no build step, so this file must be hand-maintained. It currently
lists exactly two URLs: the homepage and
`project.html?id=dc-fan-speed-controller-using-8051`. If you add a project,
remove one, or change a title (which changes its auto-derived `id` — see
§3), update this file by hand to match. Nothing will warn you if it drifts.

## 8. Environment quirks worth knowing about

These aren't bugs in the site — they're artifacts of how this dev
environment previews the site, and they will keep coming up if you do more
work here.

- **No cache-busting on `<script>`/`<link>` tags.** All three scripts
  (`data.js`, `main.js`/`project.js`, `branding.js`) and the stylesheet are
  loaded with plain `src`/`href`, no `?v=` query param. The browser's
  per-origin HTTP cache means a reloaded tab can serve a stale script even
  after a real file change, and even `navigate({force:true})` doesn't
  reliably bypass it. If a change "isn't showing up" in a live check, don't
  assume it's a real bug — confirm the served file is actually up to date
  with a cache-busted `fetch()`, or inject a fresh `<script>`/`<link>`
  element with a cache-busted URL via `document.createElement`. This
  happened repeatedly this session and was a false alarm every time.
- **Headless/background browser tabs throttle timers.** `setTimeout`,
  `requestAnimationFrame`, and CSS transitions are throttled in a hidden or
  backgrounded automation tab, so `.reveal`/`.intro-item` animated elements
  can appear "stuck" mid-transition when you inspect DOM state — not an
  actual bug, just a measurement artifact of the automation tab not being
  foregrounded.
- **`mcp__Claude_Browser__computer` screenshot action is unreliable** in
  this environment (frequently fails with "pane not displayed"). The
  reliable fallback is a headless Edge CLI screenshot:
  ```
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --window-size=W,H --screenshot="path" "url"
  ```
  Because `.hero{min-height:100vh}` makes the hero's height equal to the
  viewport height by definition, capturing anything *below* the hero
  requires temporarily patching `.hero{min-height:0}` in `styles.css`,
  capturing, then reverting the edit before committing anything else.

## 9. Working conventions established this session

- **Auto-commit/push**: push directly after changes without asking first
  (standing user preference).
- **Undo a pushed change** with `git revert --no-edit <sha>`, never
  `reset --hard` + force-push. To "undo the undo," just revert the revert
  commit the same way — this exact cycle happened once this session for a
  palette change the user reconsidered.
- **Be token-efficient.** The user explicitly and firmly asked to cut down
  on exhaustive live-browser verification loops (multi-tab screenshot
  cycles, repeated re-checks) for small changes — trust code review, act
  directly, don't over-verify. This is a standing directive, not a one-off.
- For contrast-sensitive color changes, compute WCAG ratios with a quick
  script rather than eyeballing — this caught real AA failures earlier in
  the project's history.

## 10. Known issues / not yet fixed (backlog, nobody has asked for these yet)

1. `assets/Resume.pdf` doesn't exist; `RESUME.show` is `false` so the gap is
   currently invisible, but flipping it on will 404.
2. `EXPERIENCE` array has placeholder company names and a duplicated
   sentence in its first bullet — live on-site if `"experience"` is enabled
   in `SECTIONS`.
3. `assets/project1.svg`, `project2.svg`, `project3.svg` are dead/orphaned
   files, safe to delete.
4. `project.js`'s `.project-dock` renders a 1-row panel when there's only
   one project (verified by code reading, not a live check) — functionally
   fine, just a slightly odd UX for a portfolio with a single project. Only
   matters until a second project is added.
