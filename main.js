/* Home page: build the nav + sections dynamically from data.js.
   - Order comes from window.SECTIONS.
   - A section is skipped entirely if it has no content (auto-hide). */
(function () {
  const sectionsRoot = document.getElementById("sections");
  const navRoot = document.getElementById("navLinks");
  if (!sectionsRoot) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // PROFILE.photo (data.js) decides the hero's layout: set -> name/about on
  // the left, photo on the right; unset -> everything centered by default
  // (the about paragraph itself still stays left-justified within that
  // block — see .hero-about-text in styles.css).
  const photo = ((window.PROFILE || {}).photo || "").trim();
  const hero = document.querySelector(".hero");

  // About text under the name — auto-hides (stays "hidden") if ABOUT is empty.
  const aboutText = (window.ABOUT || "").trim();
  const aboutEl = document.getElementById("heroAboutText");
  if (aboutEl && aboutText) {
    aboutEl.innerHTML = window.ABOUT;
    aboutEl.hidden = false;
  }

  // Photo beside the name/about — auto-hides if PROFILE.photo is unset.
  const photoEl = document.getElementById("heroAboutPhoto");
  if (photoEl && photo) {
    photoEl.src = photo;
    photoEl.alt = (window.PROFILE || {}).name ? `${window.PROFILE.name} — photo` : "";
    photoEl.hidden = false;
    const heroRight = hero && hero.querySelector(".hero-right");
    if (heroRight) heroRight.classList.add("has-photo");
  }

  /* Run `cb` whenever the display's pixel density changes — e.g. the window is
     dragged to a second monitor with a different scale factor. HTML/CSS/SVG
     re-rasterize themselves; <canvas> does not, so anything canvas-backed has
     to rebuild its buffer. The query is pinned to the DPR it was built with,
     so it has to be re-armed after each change. */
  function onDprChange(cb) {
    if (!window.matchMedia) return;
    const arm = () => {
      const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      if (!mq.addEventListener) return; // very old browser: skip, no re-render
      mq.addEventListener(
        "change",
        () => {
          cb();
          arm();
        },
        { once: true }
      );
    };
    arm();
  }

  // Turn a GitHub "blob" PDF link into a same-origin path we can embed in a popup.
  function toEmbed(url) {
    if (!url) return "";
    const m = url.match(/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+\.pdf)$/i);
    if (m) return m[1]; // e.g. "assets/Certifications/CSWA.pdf"
    if (/\.pdf($|\?)/i.test(url)) return url;
    return "";
  }

  /* ---------- Section builders ----------
     Each returns null when empty (so the section is hidden), or an object:
     { title, html, cls?, mount? }. */

  function buildExperience() {
    const list = window.EXPERIENCE || [];
    if (!list.length) return null;
    const items = list
      .map((e, i) => {
        const points = (e.points || []).map((p) => `<li>${p}</li>`).join("");
        const logo = e.logo
          ? `<img class="tl-logo" src="${e.logo}" alt="${e.company || "company"} logo" width="48" height="48" loading="lazy">`
          : "";
        const tech = (e.tech || []).map((t) => `<span class="tag">${t}</span>`).join("");
        return `
          <div class="tl-left">
            <span class="tl-date">${e.date || ""}</span>
            ${e.location ? `<span class="tl-loc">${e.location}</span>` : ""}
          </div>
          <div class="tl-card reveal" style="--reveal-delay:${Math.min(i * 60, 240)}ms">
            ${logo}
            <div class="tl-role">${e.role || ""}</div>
            ${e.company ? `<div class="tl-company">${e.company}</div>` : ""}
            ${points ? `<ul class="tl-points">${points}</ul>` : ""}
            ${tech ? `<div class="tags tl-tags">${tech}</div>` : ""}
          </div>`;
      })
      .join("");
    return { title: "Experience", cls: "experience", html: `<div class="timeline">${items}</div>` };
  }

  function buildProjects() {
    const list = window.PROJECTS || [];
    if (!list.length) return null;
    const cards = list
      .map((p, i) => {
        const tech = (p.tech || []).map((t) => `<span class="tag">${t}</span>`).join("");
        // Top-right open-in icon (external-link), same affordance as the cert
        // cards — the whole card is the link, so it's aria-hidden. A circular
        // chip keeps it legible over any project image behind it.
        const openIcon = `<span class="card-open" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></span>`;
        return `
          <a class="card reveal" style="--reveal-delay:${Math.min(i * 60, 240)}ms" href="project.html?id=${encodeURIComponent(p.id)}" aria-label="View details — ${p.title || ""}">
            <div class="card-img" style="background-image:url('${p.image}')"></div>
            ${openIcon}
            <div class="card-body">
              <div class="card-main">
                <h3 class="card-title">${p.title}</h3>
                ${p.date ? `<p class="card-date">${p.date}</p>` : ""}
              </div>
              <div class="card-foot">
                ${tech ? `<div class="tags">${tech}</div>` : ""}
              </div>
            </div>
          </a>`;
      })
      .join("");
    return { title: "Projects", cls: "projects", html: `<div class="card-grid">${cards}</div>` };
  }

  function buildSkills() {
    const list = window.SKILLS || [];
    if (!list.length) return null;
    const groups = list
      .map((g) => {
        const tags = (g.items || []).map((i) => `<span class="tag">${i}</span>`).join("");
        return `<div class="skill-group reveal"><h3 class="skill-category">${g.category}</h3><div class="tags">${tags}</div></div>`;
      })
      .join("");
    return { title: "Skills", cls: "skills", html: `<div class="skills-list">${groups}</div>` };
  }

  function buildCertifications() {
    const list = window.CERTIFICATIONS || [];
    if (!list.length) return null;
    const cards = list
      .map((c, i) => {
        const delay = `--reveal-delay:${Math.min(i * 60, 240)}ms`;
        // Issuer and date as separate elements rather than one joined string,
        // so CSS can rank them: the date becomes the scan anchor (accent,
        // uppercase — same treatment as the project cards) while the issuer
        // stays quiet. The separator dot is drawn in CSS.
        const meta =
          (c.issuer ? `<span class="cert-issuer">${c.issuer}</span>` : "") +
          (c.date ? `<span class="cert-date">${c.date}</span>` : "");
        // hasPdf is the single gate: a real credential PDF is available, so the
        // card becomes a clickable link, shows the open-in icon, and tilts on
        // hover. Without it (cert earned but no PDF yet) the card is a static tile.
        const hasCred = c.hasPdf === true && !!c.url;
        const logo = c.logo
          ? `<img class="cert-logo" src="${c.logo}" alt="${c.issuer || c.name || "logo"}" width="42" height="42" loading="lazy">`
          : `<div class="cert-logo" aria-hidden="true"></div>`;
        // Top-right "open credential" affordance (external-link icon), only when
        // there's a PDF to open. aria-hidden: the card's own aria-label names it.
        const openIcon = hasCred
          ? `<span class="cert-open" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></span>`
          : "";
        // Preview image of the certificate itself across the top of the card,
        // same idea as a project card's thumbnail — optional, same as logo.
        const preview = c.preview
          ? `<div class="cert-preview" style="background-image:url('${c.preview}')"></div>`
          : "";
        const inner = `
          ${preview}
          <div class="cert-body">
            ${logo}
            ${openIcon}
            <div class="cert-text">
              <span class="cert-name">${c.name || ""}</span>
              ${meta ? `<span class="cert-meta">${meta}</span>` : ""}
            </div>
          </div>`;
        const embed = toEmbed(c.url);
        const pdfAttr = embed ? ` data-pdf="${embed}"` : "";
        // aria-label gives screen readers one clean, purposeful name for the
        // whole card ("View credential — X") instead of reading every piece
        // of visible text (logo alt, name, issuer, date) concatenated together
        // as the link's accessible name.
        return hasCred
          ? `<a class="cert-card reveal" style="${delay}" href="${c.url}"${pdfAttr} target="_blank" rel="noopener" aria-label="View credential — ${c.name || ""}">${inner}</a>`
          : `<div class="cert-card reveal cert-static" style="${delay}">${inner}</div>`;
      })
      .join("");
    return { title: "Certifications", cls: "certifications", html: `<div class="card-grid">${cards}</div>` };
  }

  function buildEducation() {
    const list = window.EDUCATION || [];
    if (!list.length) return null;
    const items = list
      .map((e, i) => {
        const logo = e.logo
          ? `<img class="edu-logo" src="${e.logo}" alt="${e.school || "university"} logo" width="56" height="56" loading="lazy">`
          : `<div class="edu-logo" aria-hidden="true"></div>`;
        const degreeLine = e.degree ? `<div class="edu-degree">${e.degree}</div>` : "";
        const majorLine = e.major ? `<div class="edu-major">${e.major}</div>` : "";
        let details = "";
        if (Array.isArray(e.details)) {
          const li = e.details.filter(Boolean).map((d) => `<li>${d}</li>`).join("");
          if (li) details = `<ul class="edu-points">${li}</ul>`;
        } else if (e.details) {
          details = `<p class="edu-details">${e.details}</p>`;
        }
        return `
          <div class="edu-left">
            <span class="edu-date">${e.date || ""}</span>
            ${e.location ? `<span class="edu-loc">${e.location}</span>` : ""}
          </div>
          <div class="edu-card reveal" style="--reveal-delay:${Math.min(i * 60, 240)}ms">
            ${logo}
            <div class="edu-school">${e.school || ""}</div>
            ${degreeLine}
            ${majorLine}
            ${details}
          </div>`;
      })
      .join("");
    return { title: "Education", cls: "education", html: `<div class="edu-timeline">${items}</div>` };
  }

  function buildContact() {
    const list = window.CONTACTS || [];
    if (!list.length) return null;
    const links = list
      .map((c) => {
        const ext = /^https?:/i.test(c.url) ? ` target="_blank" rel="noopener"` : "";
        return `<a class="btn" href="${c.url}"${ext}>${c.label}</a>`;
      })
      .join("");
    return {
      title: "Contact",
      cls: "contact",
      html: `<p class="contact-intro reveal">Interested in working together or want to know more? Get in touch.</p>
             <div class="contact-links reveal">${links}</div>`,
    };
  }

  const BUILDERS = {
    experience: buildExperience,
    projects: buildProjects,
    skills: buildSkills,
    certifications: buildCertifications,
    education: buildEducation,
    contact: buildContact,
  };

  /* ---------- Render in the configured order, skipping empty sections ---------- */
  const order = window.SECTIONS || Object.keys(BUILDERS);

  order.forEach((key) => {
    const builder = BUILDERS[key];
    if (!builder) return;
    const sec = builder();
    if (!sec) return; // no content -> auto-hidden

    const el = document.createElement("section");
    el.id = key;
    el.className = "section" + (sec.cls ? " " + sec.cls : "");
    el.innerHTML = `<h2 class="section-title reveal">${sec.title}</h2>${sec.html}`;
    sectionsRoot.appendChild(el);

    const link = document.createElement("a");
    link.href = "#" + key;
    link.textContent = sec.title;
    navRoot.appendChild(link);
  });

  setupHeroIntro();
  setupReveal();
  setupTilt();
  setupSectionFlash();
  setupEqualize();
  setupTimelineWidth();
  setupPdfModal();
  setupScrollSpy();
  setupSharedTransition();
  setupSkillsMasonry();

  /* ---------- Experience + Education: one shared card width ----------
     Each timeline is its own grid, so their card columns size independently
     (Experience might be wider than Education, or vice-versa). Measure the
     widest card across BOTH sections and pin every card to that width so the
     two sections line up. Cleared below the mobile breakpoint, where cards
     are meant to fill the row fluidly. */
  function setupTimelineWidth() {
    const cards = Array.from(document.querySelectorAll(".tl-card, .edu-card"));
    if (cards.length < 2) return;
    const apply = () => {
      cards.forEach((c) => (c.style.width = ""));
      // 600 matches the CSS breakpoint where both timelines reflow to fluid
      // 1fr columns — a different number here would leave a band of widths
      // where the shared-width guarantee is silently off.
      if (window.innerWidth <= 600) return;
      let max = 0;
      cards.forEach((c) => (max = Math.max(max, c.offsetWidth)));
      cards.forEach((c) => (c.style.width = max + "px"));
    };
    apply();
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(apply, 150); // debounced: full measure/write cycle is not per-frame cheap
    });
    window.addEventListener("load", apply);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);
  }

  /* ---------- Skills: balanced masonry ----------
     CSS columns can only split between categories in source order, which
     leaves one column hanging long (e.g. a short "Tools" dangling at the
     bottom). Instead, measure each category and deal them into flex columns
     shortest-first — the columns always end nearly level, whatever the
     content in data.js grows into. */
  function setupSkillsMasonry() {
    const wrap = document.querySelector(".skills-list");
    if (!wrap) return;
    const groups = Array.from(wrap.querySelectorAll(".skill-group"));
    if (!groups.length) return;
    const GAP = 36; // keep in sync with the CSS column gap
    const COLW = 190;

    const layout = () => {
      const w = wrap.clientWidth || 640;
      const n = Math.max(1, Math.floor((w + GAP) / (COLW + GAP)));
      wrap.innerHTML = "";
      const cols = [];
      for (let i = 0; i < n; i++) {
        const c = document.createElement("div");
        c.className = "skill-col";
        wrap.appendChild(c);
        cols.push(c);
      }
      // Park everything in the first column to measure at real column width…
      groups.forEach((g) => cols[0].appendChild(g));
      if (n === 1) return;
      const hs = groups.map((g) => g.offsetHeight);
      // …then deal each category (in order) onto the currently shortest column.
      const tot = cols.map(() => 0);
      groups.forEach((g, i) => {
        let k = 0;
        for (let j = 1; j < n; j++) if (tot[j] < tot[k] - 1) k = j;
        cols[k].appendChild(g);
        tot[k] += hs[i];
      });
    };

    layout();
    window.addEventListener("load", layout);
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(layout, 150);
    });
  }

  /* ---------- First-load hero intro (name shows alone, then everything
     else fades in in stages) ---------- */
  function setupHeroIntro() {
    const heroName = document.querySelector(".hero-name");
    const items = document.querySelectorAll(".intro-item");
    if (!heroName && !items.length) return;
    // Skipped when arriving from elsewhere on the site (branding.js sets
    // this before navigating, e.g. clicking the IJ logo from a project
    // page) — the intro should only play on an actual fresh site load.
    let skip = false;
    try {
      skip = sessionStorage.getItem("skipHeroIntro") === "1";
      if (skip) sessionStorage.removeItem("skipHeroIntro");
    } catch (e) {}
    if (reduced || skip) {
      // Suppress the transition itself, not just the staged delay — adding
      // .in alone would still animate opacity/transform over their full
      // duration instantly-triggered, just without the cascade timing.
      const skipAnim = (el) => {
        el.style.transition = "none";
        el.classList.add("in");
      };
      if (heroName) skipAnim(heroName);
      items.forEach(skipAnim);
      return;
    }
    // Double rAF: lets the browser commit the initial opacity:0 state to a
    // paint before adding .in, so the CSS transition actually plays instead
    // of the change landing in the same frame as the hidden state and
    // getting skipped.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (heroName) heroName.classList.add("in");
        items.forEach((e) => e.classList.add("in"));
      });
    });
  }

  /* ---------- Scroll-reveal (subtle fade/slide-up) ---------- */
  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      // A small negative bottom margin triggers the reveal a little before
      // an element is fully in view, so fast scrolling doesn't visibly catch
      // items mid-transition — the previous 0.12 threshold with no margin
      // meant items in the same grid crossed the trigger point at noticeably
      // different scroll offsets depending on row/column position.
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Shared-element page transition (card image <-> detail hero) ---------- */
  function setupSharedTransition() {
    const projSec = document.getElementById("projects");
    if (!projSec) return;
    const cardFor = (id) => projSec.querySelector(`a.card[href$="id=${id}"]`);

    // Returning via "Back to projects" ONLY: restore the exact scroll position
    // and tag the card so the hero morphs back into it. Every other way of
    // arriving (brand link, fresh visit, browser back) gets the plain
    // crossfade — previously the card was tagged on EVERY index load, so e.g.
    // clicking the brand logo sent the hero flying to an off-screen card:
    // a different animation depending on how you left. One path, one animation.
    try {
      if (sessionStorage.getItem("returnToProjects")) {
        sessionStorage.removeItem("returnToProjects");
        const y = parseInt(sessionStorage.getItem("indexScroll") || "", 10);
        if (!isNaN(y)) {
          const root = document.documentElement;
          const prev = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto"; // instant, no slide
          window.scrollTo(0, y);
          root.style.scrollBehavior = prev;
        }
        const last = sessionStorage.getItem("lastProject");
        const card = last && cardFor(last);
        const img = card && card.querySelector(".card-img");
        if (img) img.style.viewTransitionName = "project-hero";
        // The morph target must be VISIBLE at first paint. .reveal elements
        // start at opacity:0 until IntersectionObserver fires — but IO is
        // async and lands AFTER the view-transition snapshot, so the hero
        // would morph into an empty slot and the grid would then replay its
        // entrance stagger. The visitor has already seen this page: mark
        // everything revealed up front (pre-paint, so nothing animates).
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      }
    } catch (e) {}

    // Opening a project: remember scroll + tag the clicked card's image before navigating.
    projSec.addEventListener("click", (e) => {
      const card = e.target.closest("a.card");
      if (!card) return;
      const m = (card.getAttribute("href") || "").match(/id=([^&]+)/);
      try {
        if (m) sessionStorage.setItem("lastProject", m[1]);
        sessionStorage.setItem("indexScroll", String(window.scrollY));
      } catch (e2) {}
      projSec.querySelectorAll(".card-img").forEach((im) => (im.style.viewTransitionName = ""));
      const img = card.querySelector(".card-img");
      if (img) img.style.viewTransitionName = "project-hero";
    });
  }

  /* ---------- PDF popup (View Credential opens the certificate in a modal) ----------
     Renders the PDF with pdf.js into theme-styled canvases (custom toolbar with
     zoom / download / open-in-tab) instead of the browser's grey default viewer.
     Falls back to a plain iframe if pdf.js can't load. pdf.js is self-hosted
     (assets/vendor/) rather than pulled from a CDN: a third-party script tag
     without an integrity hash lets that CDN run arbitrary JS on the page, and
     SRI can't cover the worker file (loaded by the library, not a <script>). */
  function setupPdfModal() {
    const PDFJS_CDN = "assets/vendor/pdfjs";
    let modal, pdfDoc, libPromise;
    let zoom = 1;
    let curSrc = "";

    const loadLib = () => {
      if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
      if (!libPromise) {
        libPromise = new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = PDFJS_CDN + "/pdf.min.js";
          s.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDN + "/pdf.worker.min.js";
            resolve(window.pdfjsLib);
          };
          s.onerror = () => reject(new Error("pdf.js failed to load"));
          document.head.appendChild(s);
        });
      }
      return libPromise;
    };

    const icoDownload =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>';
    const icoNewTab =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M14 4h6v6M20 4L10 14M9 5H5v14h14v-4"/></svg>';

    const build = () => {
      modal = document.createElement("div");
      modal.className = "pdf-modal";
      const chevronUp =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
      const chevronDown =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      modal.innerHTML =
        '<div class="pdf-backdrop"></div>' +
        // The chevrons are SIBLINGS of the scrolling <nav>, not children of
        // it — the nav has a mask-image fade at its own edges (see
        // updateDockFade), and a mask fades EVERYTHING it paints, including
        // its descendants. A chevron placed exactly at the edge it needs to
        // mark would be faded to near-invisible by that same mask. As normal
        // flex-column siblings (DOM order: up, nav, down) they get their OWN
        // reserved strip of space above/below the list instead of floating
        // on top of the end cards — no overlap, and the dock's own scrollable
        // area shrinks by exactly the room the chevrons take, which is also
        // why the dock now shows a bit less at once than before.
        '<div class="cert-dock-wrap" hidden>' +
        '<div class="cert-dock-nav cert-dock-nav-up" aria-hidden="true">' + chevronUp + "</div>" +
        '<nav class="cert-dock" aria-label="All certifications"></nav>' +
        '<div class="cert-dock-nav cert-dock-nav-down" aria-hidden="true">' + chevronDown + "</div>" +
        "</div>" +
        '<div class="pdf-box" role="dialog" aria-modal="true" aria-label="Certificate viewer">' +
        '<div class="pdf-toolbar">' +
        '<span class="pdf-title"></span>' +
        '<div class="pdf-tools">' +
        '<button type="button" class="pdf-tool-btn pdf-zoom-out" aria-label="Zoom out">&minus;</button>' +
        '<span class="pdf-zoom-label">100%</span>' +
        '<button type="button" class="pdf-tool-btn pdf-zoom-in" aria-label="Zoom in">+</button>' +
        '<a class="pdf-tool-btn pdf-download" aria-label="Download" download>' + icoDownload + "</a>" +
        '<a class="pdf-tool-btn pdf-newtab" aria-label="Open in new tab" target="_blank" rel="noopener">' + icoNewTab + "</a>" +
        '<button type="button" class="pdf-tool-btn pdf-close" aria-label="Close">&times;</button>' +
        "</div></div>" +
        '<div class="pdf-pages"></div></div>';
      document.body.appendChild(modal);
      modal.querySelector(".cert-dock").addEventListener("scroll", scheduleDockFade, { passive: true });
      window.addEventListener("resize", scheduleDockFade);
      modal.querySelector(".pdf-backdrop").addEventListener("click", close);
      modal.querySelector(".pdf-close").addEventListener("click", close);
      modal.querySelector(".pdf-zoom-in").addEventListener("click", () => setZoom(zoom + 0.25));
      modal.querySelector(".pdf-zoom-out").addEventListener("click", () => setZoom(zoom - 0.25));
      // Keep Tab inside the dialog while it's open — without this, keyboard
      // focus wanders into the page hidden behind the backdrop.
      modal.addEventListener("keydown", (e) => {
        if (e.key !== "Tab") return;
        const items = Array.from(
          modal.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")
        ).filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    };

    const setZoom = (z) => {
      zoom = Math.min(3, Math.max(0.5, z));
      modal.querySelector(".pdf-zoom-label").textContent = Math.round(zoom * 100) + "%";
      if (pdfDoc) renderPages();
    };

    async function renderPages() {
      const box = modal.querySelector(".pdf-pages");
      const doc = pdfDoc;
      box.classList.remove("fallback");
      box.innerHTML = "";
      // Capped at 3, not 2: this is document TEXT — softness here is far more
      // noticeable (and more annoying to actually read) than on decorative
      // canvases, so it's worth the extra render cost on high-density screens.
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      for (let n = 1; n <= doc.numPages; n++) {
        if (doc !== pdfDoc) return; // a newer document replaced this one mid-render
        const page = await doc.getPage(n);
        const vp1 = page.getViewport({ scale: 1 });
        const fit = (box.clientWidth - 44) / vp1.width; // fit page to the modal width
        const vp = page.getViewport({ scale: fit * zoom * dpr });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        canvas.style.width = vp.width / dpr + "px";
        canvas.style.height = vp.height / dpr + "px";
        box.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      }
    }

    // Same reason as the hero canvas: the rendered pages are bitmaps sized for
    // one display density. Re-render them if the window moves to a monitor with
    // a different one, otherwise an open certificate stays soft until reopened.
    onDprChange(() => {
      if (pdfDoc) renderPages();
    });

    /* The dock has no visible scrollbar (by request), so two cues stand in
       for it: a soft edge fade (mask, so it reveals the blurred backdrop
       instead of painting a colour patch that would need to match it) AND a
       chevron at whichever edge(s) currently have hidden content — the fade
       alone read as too subtle to notice at a glance. Both recomputed on
       scroll/resize, since which edges are active changes as you scroll. */
    let dockFadeRaf = null;
    const updateDockFade = () => {
      const wrap = modal.querySelector(".cert-dock-wrap");
      const dock = modal.querySelector(".cert-dock");
      if (!dock || wrap.hidden) return;
      const F = "28px";
      const canUp = dock.scrollTop > 2;
      const canDown = dock.scrollTop < dock.scrollHeight - dock.clientHeight - 2;
      let mask = "none";
      if (canUp && canDown) mask = `linear-gradient(to bottom, transparent, black ${F}, black calc(100% - ${F}), transparent)`;
      else if (canUp) mask = `linear-gradient(to bottom, transparent, black ${F})`;
      else if (canDown) mask = `linear-gradient(to bottom, black calc(100% - ${F}), transparent)`;
      dock.style.maskImage = mask;
      dock.style.webkitMaskImage = mask;
      modal.querySelector(".cert-dock-nav-up").classList.toggle("show", canUp);
      modal.querySelector(".cert-dock-nav-down").classList.toggle("show", canDown);
    };
    const scheduleDockFade = () => {
      if (dockFadeRaf) return;
      dockFadeRaf = requestAnimationFrame(() => {
        dockFadeRaf = null;
        updateDockFade();
      });
    };

    /* Side dock listing every certification, so you can move between them
       without closing the viewer. The cards are CLONES of the real ones in the
       grid rather than re-built markup — that way the design can never drift
       apart from the main page. Clones keep their data-pdf, so the delegated
       handler below already makes them work; nothing extra to wire up. */
    const fillDock = (activeSrc) => {
      const wrap = modal.querySelector(".cert-dock-wrap");
      const dock = modal.querySelector(".cert-dock");
      const originals = Array.from(document.querySelectorAll("#certifications .cert-card"));
      if (originals.length < 2) {
        wrap.hidden = true; // nothing to move between
        return;
      }
      const firstBuild = !dock.childElementCount;
      if (firstBuild) {
        originals.forEach((card) => {
          const clone = card.cloneNode(true);
          // .reveal leaves an element at opacity:0 until its observer fires,
          // and that observer only ever watches the original — a cloned card
          // would sit invisible forever. It's on screen immediately, so drop
          // the scroll-reveal state entirely.
          clone.classList.remove("reveal", "in", "tilting");
          clone.style.removeProperty("--reveal-delay");
          // cloneNode(true) also copies the inline style ATTRIBUTE — so if the
          // cursor happened to be hovering (tilting) the original the instant
          // you clicked it, the clone inherits a frozen rotateX/rotateY/scale
          // transform. Nothing ever clears it (the clone has no pointer
          // events of its own to trigger setupTilt's pointerleave reset), so
          // it sits permanently skewed — which is what was clipping an edge
          // of the highlighted card's border. Strip everything setupTilt writes.
          clone.style.removeProperty("transform");
          clone.style.removeProperty("transition");
          clone.style.removeProperty("--mx");
          clone.style.removeProperty("--my");
          dock.appendChild(clone);
        });
      }
      Array.from(dock.children).forEach((clone, i) => {
        // Copy the original's ACTUAL rendered width, not the CSS basis: the
        // grid flexes its cards a few px narrower than 275, and at this size a
        // few px is the difference between a 3- and 4-line title.
        // minHeight is NOT copied (unlike width) — the grid's equalized
        // height includes the .cert-preview strip, which the dock hides
        // (.cert-dock .cert-preview), so reusing it here would leave a dead
        // gap under each row's text instead. The clone sizes to its own
        // (preview-less) content instead.
        if (originals[i]) {
          clone.style.width = originals[i].getBoundingClientRect().width + "px";
        }
        const isCurrent = clone.getAttribute("data-pdf") === activeSrc;
        clone.classList.toggle("cert-dock-current", isCurrent);
        if (isCurrent) clone.setAttribute("aria-current", "true");
        else clone.removeAttribute("aria-current");
      });
      wrap.hidden = false;
      // Clicking a card should not move the list — the card you just clicked
      // is already visible, and re-centring it displaces every OTHER card
      // you were just looking at. The one exception is the very first time
      // the dock appears: nothing has been scrolled yet, so if the opened
      // certificate starts off-screen (near the end of a long list), bring
      // it into view with the smallest possible scroll (a no-op if it's
      // already visible) rather than leaving the dock stuck at the top.
      if (firstBuild) {
        const cur = dock.querySelector(".cert-dock-current");
        if (cur) cur.scrollIntoView({ block: "nearest" });
      }
      updateDockFade();
    };

    let opener = null; // element to hand focus back to when the dialog closes

    async function open(src, title, isCert) {
      if (!modal) build();
      // Only capture the opener on the FIRST open. Hopping between certs via
      // the dock would otherwise point focus-restore at a dock card, and on
      // close the dock is hidden — focus would land nowhere.
      if (!modal.classList.contains("open")) opener = document.activeElement;
      if (isCert) fillDock(src);
      else modal.querySelector(".cert-dock-wrap").hidden = true; // résumé: no dock
      modal.querySelector(".pdf-title").textContent = title || "Certificate";
      modal.querySelector(".pdf-box").setAttribute("aria-label", title || "Certificate viewer");
      modal.querySelector(".pdf-download").href = src;
      modal.querySelector(".pdf-newtab").href = src;
      modal.classList.add("open");
      modal.querySelector(".pdf-close").focus();
      document.body.style.overflow = "hidden";
      const box = modal.querySelector(".pdf-pages");
      box.classList.remove("fallback");
      box.innerHTML = '<div class="pdf-spinner" aria-label="Loading"></div>';
      zoom = 1;
      modal.querySelector(".pdf-zoom-label").textContent = "100%";
      try {
        const lib = await loadLib();
        if (curSrc !== src || !pdfDoc) {
          if (pdfDoc) pdfDoc.destroy();
          pdfDoc = await lib.getDocument(src).promise;
          curSrc = src;
        }
        await renderPages();
      } catch (err) {
        // CDN blocked or the PDF failed to parse — browser's viewer still works.
        box.classList.add("fallback");
        box.innerHTML = '<iframe title="Certificate" src="' + src + '"></iframe>';
      }
    }

    function close() {
      if (!modal || !modal.classList.contains("open")) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
      if (opener && opener.focus) opener.focus(); // hand focus back to the triggering link
      opener = null;
      setTimeout(() => {
        if (pdfDoc) pdfDoc.destroy();
        pdfDoc = null;
        curSrc = "";
        modal.querySelector(".pdf-pages").innerHTML = "";
      }, 250);
    }

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-pdf]");
      if (!link) return;
      e.preventDefault();
      // Explicit data-pdf-title (used by the résumé button) wins; certification
      // cards fall back to their own .cert-name text.
      const name = link.querySelector(".cert-name");
      const title = link.getAttribute("data-pdf-title") || (name ? name.textContent.trim() : "");
      // .cert-card covers both the grid and the dock's clones; the résumé
      // button is the only other data-pdf link and isn't a certification.
      open(link.getAttribute("data-pdf"), title, link.classList.contains("cert-card"));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Scroll spy: mark the section you're reading in the nav ----------
     With 7 links on a long one-pager, the nav otherwise never tells you where
     you are. aria-current carries the state for assistive tech; CSS styles it.

     An earlier version used IntersectionObserver with a thin "band" and
     picked the entry with the smallest boundingClientRect.top among those
     currently intersecting. That's backwards when two sections' enter/exit
     events land in the same callback batch (common — one section's bottom
     and the next one's top can cross the band together): the section
     scrolled MOSTLY OFF-SCREEN above has the most negative (smallest) top,
     so it kept winning over the section actually on screen, and stayed
     stuck highlighted indefinitely. Simpler and correct: walk the sections
     in document order and take the LAST one whose top has crossed a single
     fixed line just below the header — i.e. "the last section we scrolled
     into" — with no batching/ordering ambiguity possible. */
  function setupScrollSpy() {
    const links = new Map(); // section id -> nav link, in document order
    navRoot.querySelectorAll("a[href^='#']").forEach((a) => links.set(a.getAttribute("href").slice(1), a));
    if (!links.size) return;
    const sections = [];
    links.forEach((_, id) => {
      const sec = document.getElementById(id);
      if (sec) sections.push(sec);
    });
    if (!sections.length) return;

    const setCurrent = (id) => {
      links.forEach((a, key) => {
        if (key === id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };

    const LINE = 120; // px from the viewport top — just clears the sticky header
    let ticking = false;
    const check = () => {
      ticking = false;
      // No default: while still above the first section (e.g. in the hero,
      // which has no nav link of its own), nothing should be highlighted.
      let current = null;
      for (const sec of sections) {
        if (sec.getBoundingClientRect().top - LINE <= 0) current = sec;
      }
      // Near the bottom of the page the last section may never reach the
      // line (its own height can be shorter than the remaining scroll room),
      // so force it active once there's nowhere further to scroll.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1];
      if (current) setCurrent(current.id);
      else links.forEach((a) => a.removeAttribute("aria-current"));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  /* ---------- Equal-height cert cards so every card is the same size ---------- */
  function setupEqualize() {
    // For each group, stretch the measured block to the tallest one so the content
    // below it (View Credential / View details) lines up across every card. A fixed
    // CSS gap keeps that content clear of the text even on the tallest card.
    // Equalize each row separately (not the whole block) so the date, the
    // description, the tags and "View details" all line up at the same
    // position across every project card, whatever the title/description length.
    const groups = [
      // Equalize the whole cert card height (not just the title) so every card
      // is the same size; the CTA is pinned to the bottom in CSS, so it lines
      // up across cards without stretching the title and leaving a gap under
      // short one-line names.
      { id: "certifications", sel: ".cert-card" },
      { id: "projects", sel: ".card-title" },
      { id: "projects", sel: ".card-foot .tags" },
    ];
    const runners = [];
    groups.forEach(({ id, sel }) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const els = Array.from(sec.querySelectorAll(sel));
      if (els.length < 2) return;
      runners.push(() => {
        els.forEach((e) => (e.style.minHeight = ""));
        let max = 0;
        els.forEach((e) => (max = Math.max(max, e.offsetHeight)));
        els.forEach((e) => (e.style.minHeight = max + "px"));
      });
    });
    if (!runners.length) return;
    const runAll = () => runners.forEach((r) => r());
    runAll();
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(runAll, 150); // debounced: avoids layout thrash during drag-resize
    });
    window.addEventListener("load", runAll);
    // Re-measure once the web fonts have loaded (they change text height).
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(runAll);
  }

  /* ---------- "Arrival" flash on the heading when navigating to a section ---------- */
  function setupSectionFlash() {
    function flash(id) {
      const el = document.getElementById(id);
      if (!el || reduced) return;
      el.classList.remove("flash");
      void el.offsetWidth; // restart the animation if re-triggered
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 1000);
    }
    navRoot.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) setTimeout(() => flash(href.slice(1)), 360);
    });
    // Arriving from another page with a hash (e.g. project page -> #projects).
    if (location.hash.length > 1) {
      setTimeout(() => flash(location.hash.slice(1)), 450);
    }
  }

  /* ---------- 3D tilt on cards (pointer-following, with glare) ---------- */
  function setupTilt() {
    const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    if (reduced || !canHover) return;

    const MAX = 8; // degrees
    document.querySelectorAll(".card, .cert-card:not(.cert-static)").forEach((card) => {
      // Both handlers list ALL THREE properties the base .card/.cert-card
      // rule transitions (transform, box-shadow, border-color) — not just
      // the two this effect animates. Setting style.transition replaces the
      // property wholesale, not just the parts named; a shorthand missing
      // border-color means border-color stops transitioning AT ALL once this
      // has run once (inline always beats the base rule), so every hover
      // border-colour change after the FIRST tilt would snap instead of
      // ease — a real bug, not just a timing nit, since it made the card
      // feel a little more "broken" each time you interacted with it.
      // Leave also matches transform's and box-shadow's DURATIONS (both
      // 0.4s) — they previously ran 0.4s/0.3s, so the glow finished fading
      // a beat before the tilt settled, reading as two separate motions
      // instead of one cohesive return.
      card.addEventListener("pointerenter", () => {
        card.classList.add("tilting");
        card.style.transition = "transform 0.08s linear, box-shadow 0.25s ease, border-color 0.2s ease";
      });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -2 * MAX;
        const ry = (px - 0.5) * 2 * MAX;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("tilting");
        card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease";
        card.style.transform = "";
      });
    });
  }
})();
