/* Home page: build the nav + sections dynamically from data.js.
   - Order comes from window.SECTIONS.
   - A section is skipped entirely if it has no content (auto-hide). */
(function () {
  const sectionsRoot = document.getElementById("sections");
  const navRoot = document.getElementById("navLinks");
  if (!sectionsRoot) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function buildAbout() {
    const text = (window.ABOUT || "").trim();
    if (!text) return null;
    return { title: "About", cls: "about", html: `<p class="about-text reveal">${window.ABOUT}</p>` };
  }

  function buildExperience() {
    const list = window.EXPERIENCE || [];
    if (!list.length) return null;
    const items = list
      .map((e, i) => {
        const points = (e.points || []).map((p) => `<li>${p}</li>`).join("");
        const logo = e.logo
          ? `<img class="tl-logo" src="${e.logo}" alt="${e.company || "company"} logo">`
          : "";
        const tech = (e.tech || []).map((t) => `<span class="tag">${t}</span>`).join("");
        return `
          <div class="tl-left">
            <span class="tl-date">${e.date || ""}</span>
            ${e.location ? `<span class="tl-loc">${e.location}</span>` : ""}
          </div>
          <div class="tl-card reveal" style="--reveal-delay:${i * 70}ms">
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
        return `
          <a class="card reveal" style="--reveal-delay:${i * 70}ms" href="project.html?id=${encodeURIComponent(p.id)}">
            <div class="card-img" style="background-image:url('${p.image}')"></div>
            <div class="card-body">
              <div class="card-main">
                <h3 class="card-title">${p.title}</h3>
                ${p.date ? `<p class="card-date">${p.date}</p>` : ""}
                <p class="card-tagline">${p.tagline || ""}</p>
              </div>
              <div class="card-foot">
                ${tech ? `<div class="tags">${tech}</div>` : ""}
                <span class="card-cta">View details &rarr;</span>
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
        const delay = `--reveal-delay:${i * 70}ms`;
        const meta = [c.issuer, c.date].filter(Boolean).join(" · ");
        const logo = c.logo
          ? `<img class="cert-logo" src="${c.logo}" alt="${c.issuer || c.name || "logo"}">`
          : `<div class="cert-logo" aria-hidden="true"></div>`;
        const inner = `
          ${logo}
          <div class="cert-text">
            <span class="cert-name">${c.name || ""}</span>
            <div class="cert-foot">
              ${meta ? `<span class="cert-meta">${meta}</span>` : ""}
              ${c.url ? `<span class="cert-cta">View Credential &rarr;</span>` : ""}
            </div>
          </div>`;
        const embed = toEmbed(c.url);
        const pdfAttr = embed ? ` data-pdf="${embed}"` : "";
        return c.url
          ? `<a class="cert-card reveal" style="${delay}" href="${c.url}"${pdfAttr} target="_blank" rel="noopener">${inner}</a>`
          : `<div class="cert-card reveal" style="${delay}">${inner}</div>`;
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
          ? `<img class="edu-logo" src="${e.logo}" alt="${e.school || "university"} logo">`
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
          <div class="edu-card reveal" style="--reveal-delay:${i * 70}ms">
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
    about: buildAbout,
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

  setupReveal();
  setupTilt();
  setupSectionFlash();
  setupEqualize();
  setupPdfModal();
  setupSharedTransition();

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
      { threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Shared-element page transition (card image <-> detail hero) ---------- */
  function setupSharedTransition() {
    const projSec = document.getElementById("projects");
    if (!projSec) return;
    const cardFor = (id) => projSec.querySelector(`a.card[href$="id=${id}"]`);

    // Returning from a project (from any depth): tag the card so the hero morphs back
    // into it, and restore the exact scroll position instead of jumping to the top.
    try {
      const last = sessionStorage.getItem("lastProject");
      if (last) {
        const img = cardFor(last) && cardFor(last).querySelector(".card-img");
        if (img) img.style.viewTransitionName = "project-hero";
      }
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
     Falls back to a plain iframe if the pdf.js CDN can't be reached. */
  function setupPdfModal() {
    const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174";
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
      modal.innerHTML =
        '<div class="pdf-backdrop"></div>' +
        '<div class="pdf-box">' +
        '<div class="pdf-toolbar">' +
        '<span class="pdf-title"></span>' +
        '<div class="pdf-tools">' +
        '<button class="pdf-tool-btn pdf-zoom-out" aria-label="Zoom out">&minus;</button>' +
        '<span class="pdf-zoom-label">100%</span>' +
        '<button class="pdf-tool-btn pdf-zoom-in" aria-label="Zoom in">+</button>' +
        '<a class="pdf-tool-btn pdf-download" aria-label="Download" download>' + icoDownload + "</a>" +
        '<a class="pdf-tool-btn pdf-newtab" aria-label="Open in new tab" target="_blank" rel="noopener">' + icoNewTab + "</a>" +
        '<button class="pdf-tool-btn pdf-close" aria-label="Close">&times;</button>' +
        "</div></div>" +
        '<div class="pdf-pages"></div></div>';
      document.body.appendChild(modal);
      modal.querySelector(".pdf-backdrop").addEventListener("click", close);
      modal.querySelector(".pdf-close").addEventListener("click", close);
      modal.querySelector(".pdf-zoom-in").addEventListener("click", () => setZoom(zoom + 0.25));
      modal.querySelector(".pdf-zoom-out").addEventListener("click", () => setZoom(zoom - 0.25));
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    async function open(src, title) {
      if (!modal) build();
      modal.querySelector(".pdf-title").textContent = title || "Certificate";
      modal.querySelector(".pdf-download").href = src;
      modal.querySelector(".pdf-newtab").href = src;
      modal.classList.add("open");
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
      if (!modal) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
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
      const name = link.querySelector(".cert-name");
      open(link.getAttribute("data-pdf"), name ? name.textContent.trim() : "");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Equal-height cert cards so "View Credential" lines up everywhere ---------- */
  function setupEqualize() {
    // For each group, stretch the measured block to the tallest one so the content
    // below it (View Credential / View details) lines up across every card. A fixed
    // CSS gap keeps that content clear of the text even on the tallest card.
    const groups = [
      { id: "certifications", sel: ".cert-name" },
      { id: "projects", sel: ".card-main" },
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
    window.addEventListener("resize", runAll);
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
    document.querySelectorAll(".card, .cert-card").forEach((card) => {
      card.addEventListener("pointerenter", () => {
        card.classList.add("tilting");
        card.style.transition = "transform 0.08s linear, box-shadow 0.25s ease";
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
        card.style.transition = "transform 0.4s ease, box-shadow 0.3s ease";
        card.style.transform = "";
      });
    });
  }
})();
