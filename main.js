/* Home page: build the nav + sections dynamically from data.js.
   - Order comes from window.SECTIONS.
   - A section is skipped entirely if it has no content (auto-hide). */
(function () {
  const sectionsRoot = document.getElementById("sections");
  const navRoot = document.getElementById("navLinks");
  if (!sectionsRoot) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      .map((e) => {
        const points = (e.points || []).map((p) => `<li>${p}</li>`).join("");
        const logo = e.logo
          ? `<img class="tl-logo" src="${e.logo}" alt="${e.company || "company"} logo">`
          : "";
        const tech = (e.tech || []).map((t) => `<span class="tag">${t}</span>`).join("");
        return `
          <div class="tl-item reveal">
            <div class="tl-card">
              ${logo}
              <div class="tl-role">${e.role || ""}</div>
              ${e.company ? `<div class="tl-company">${e.company}</div>` : ""}
              ${e.date ? `<div class="tl-date">${e.date}</div>` : ""}
              ${points ? `<ul class="tl-points">${points}</ul>` : ""}
              ${tech ? `<div class="tags tl-tags">${tech}</div>` : ""}
            </div>
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
        return c.url
          ? `<a class="cert-card reveal" style="${delay}" href="${c.url}" target="_blank" rel="noopener">${inner}</a>`
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
