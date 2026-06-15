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
        return `
          <div class="tl-item reveal">
            <div class="tl-card">
              <div class="tl-role">${e.role || ""}${
          e.company ? ` &middot; <span class="tl-company">${e.company}</span>` : ""
        }</div>
              ${e.date ? `<div class="tl-date">${e.date}</div>` : ""}
              ${points ? `<ul class="tl-points">${points}</ul>` : ""}
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
      .map(
        (p) => `
          <a class="card reveal" href="project.html?id=${encodeURIComponent(p.id)}">
            <div class="card-img" style="background-image:url('${p.image}')"></div>
            <div class="card-body">
              <h3 class="card-title">${p.title}</h3>
              ${p.date ? `<p class="card-date">${p.date}</p>` : ""}
              <p class="card-tagline">${p.tagline || ""}</p>
              <span class="card-cta">View details &rarr;</span>
            </div>
          </a>`
      )
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
      .map((c) => {
        // Same card as the projects, with certification fields.
        const inner = `
          <div class="cert-card-img" style="background-image:url('${c.image || ""}')"></div>
          <div class="card-body">
            <h3 class="card-title">${c.name || ""}</h3>
            ${c.date ? `<p class="card-date">${c.date}</p>` : ""}
            ${c.issuer ? `<p class="card-tagline">${c.issuer}</p>` : ""}
            ${c.url ? `<span class="card-cta">View Credential &rarr;</span>` : ""}
          </div>`;
        return c.url
          ? `<a class="cert-card reveal" href="${c.url}" target="_blank" rel="noopener">${inner}</a>`
          : `<div class="cert-card reveal">${inner}</div>`;
      })
      .join("");
    return { title: "Certifications", cls: "certifications", html: `<div class="card-grid">${cards}</div>` };
  }

  function buildEducation() {
    const list = window.EDUCATION || [];
    if (!list.length) return null;
    const items = list
      .map((e) => {
        const meta = [e.school, e.date].filter(Boolean).join(" · ");
        return `
          <div class="edu-item reveal">
            <div class="edu-degree">${e.degree || ""}</div>
            <div class="edu-meta">${meta}</div>
            ${e.details ? `<p class="edu-details">${e.details}</p>` : ""}
          </div>`;
      })
      .join("");
    return { title: "Education", cls: "education", html: `<div class="edu-list">${items}</div>` };
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
})();
