/* Home page: build the nav + sections dynamically from data.js.
   - Order comes from window.SECTIONS.
   - A section is skipped entirely if it has no content (auto-hide). */
(function () {
  const sectionsRoot = document.getElementById("sections");
  const navRoot = document.getElementById("navLinks");
  if (!sectionsRoot) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Crisp, perfectly-centered arrow icons for the slideshows.
  const CHEVRON = {
    left: '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg>',
    right: '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>',
  };

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
    const html = `
      <div class="carousel" id="carousel">
        <button class="carousel-btn prev" id="prevBtn" aria-label="Previous project">${CHEVRON.left}</button>
        <div class="carousel-viewport">
          <div class="carousel-track" id="carouselTrack"></div>
        </div>
        <button class="carousel-btn next" id="nextBtn" aria-label="Next project">${CHEVRON.right}</button>
      </div>
      <div class="carousel-dots" id="carouselDots"></div>`;
    return { title: "Projects", cls: "projects", html, mount: initCarousel };
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
    const slides = list
      .map((c) => {
        // Mirrors the project card, with certification fields.
        const inner = `
          <div class="cert-card-img" style="background-image:url('${c.image || ""}')"></div>
          <div class="card-body">
            <h3 class="card-title">${c.name || ""}</h3>
            ${c.date ? `<p class="card-date">${c.date}</p>` : ""}
            ${c.issuer ? `<p class="card-tagline">${c.issuer}</p>` : ""}
            ${c.url ? `<span class="card-cta">View Credential &rarr;</span>` : ""}
          </div>`;
        const card = c.url
          ? `<a class="cert-card" href="${c.url}" target="_blank" rel="noopener">${inner}</a>`
          : `<div class="cert-card">${inner}</div>`;
        return `<div class="cert-slide">${card}</div>`;
      })
      .join("");
    const html = `
      <div class="cert-slider reveal" id="certSlider">
        <button class="carousel-btn prev" id="certPrev" aria-label="Previous certification">${CHEVRON.left}</button>
        <div class="cert-stack" id="certStack">${slides}</div>
        <button class="carousel-btn next" id="certNext" aria-label="Next certification">${CHEVRON.right}</button>
      </div>
      <div class="carousel-dots" id="certDots"></div>`;
    return { title: "Certifications", cls: "certifications", html, mount: initCertSlider };
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
  const mounts = [];

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

    if (sec.mount) mounts.push(sec.mount);
  });

  mounts.forEach((fn) => fn());
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

  /* ---------- Certifications slideshow (one at a time, fade) ---------- */
  function initCertSlider() {
    const stack = document.getElementById("certStack");
    const slides = Array.from(stack.children);
    const dotsWrap = document.getElementById("certDots");
    const prev = document.getElementById("certPrev");
    const next = document.getElementById("certNext");
    const n = slides.length;
    let index = 0;
    let dots = [];

    function setActive(i) {
      index = (i + n) % n;
      slides.forEach((s, j) => s.classList.toggle("active", j === index));
      dots.forEach((d, j) => d.classList.toggle("active", j === index));
    }

    // A single certification needs no controls.
    if (n <= 1) {
      prev.style.display = "none";
      next.style.display = "none";
      dotsWrap.style.display = "none";
      if (slides[0]) slides[0].classList.add("active");
      return;
    }

    dots = slides.map((s, i) => {
      const d = document.createElement("button");
      d.className = "dot";
      d.setAttribute("aria-label", `Go to certification ${i + 1}`);
      d.addEventListener("click", () => setActive(i));
      dotsWrap.appendChild(d);
      return d;
    });

    prev.addEventListener("click", () => setActive(index - 1));
    next.addEventListener("click", () => setActive(index + 1));

    // Touch swipe.
    let startX = null;
    stack.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    stack.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) setActive(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    setActive(0);
  }

  /* ---------- Projects carousel (seamless, centered, infinite) ---------- */
  function initCarousel() {
    const projects = window.PROJECTS || [];
    const carousel = document.getElementById("carousel");
    const viewport = carousel.querySelector(".carousel-viewport");
    const track = document.getElementById("carouselTrack");
    const dotsWrap = document.getElementById("carouselDots");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function cardEl(p) {
      const a = document.createElement("a");
      a.className = "card";
      a.href = `project.html?id=${encodeURIComponent(p.id)}`;
      a.innerHTML = `
        <div class="card-img" style="background-image:url('${p.image}')"></div>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          ${p.date ? `<p class="card-date">${p.date}</p>` : ""}
          <p class="card-tagline">${p.tagline || ""}</p>
          <span class="card-cta">View details &rarr;</span>
        </div>`;
      return a;
    }

    const n = projects.length;

    // Fewer than 3 projects: show them statically, no navigation.
    if (n < 3) {
      carousel.classList.add("static");
      projects.forEach((p) => track.appendChild(cardEl(p)));
      return;
    }

    // 3+ projects: clone last/first so wrapping is seamless.
    const cloneLast = cardEl(projects[n - 1]);
    const cloneFirst = cardEl(projects[0]);
    [cloneLast, cloneFirst].forEach((c) => {
      c.setAttribute("aria-hidden", "true");
      c.tabIndex = -1;
    });

    track.appendChild(cloneLast);
    projects.forEach((p) => track.appendChild(cardEl(p)));
    track.appendChild(cloneFirst);

    const cards = Array.from(track.children); // [cloneLast, ...real, cloneFirst]

    const dots = projects.map((p, i) => {
      const d = document.createElement("button");
      d.className = "dot";
      d.setAttribute("aria-label", `Go to ${p.title}`);
      d.addEventListener("click", () => goTo(i + 1));
      dotsWrap.appendChild(d);
      return d;
    });

    let pos = 1;
    let animating = false;

    function metrics() {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return { cardWidth, slot: cardWidth + gap };
    }

    function apply(animate) {
      const { cardWidth, slot } = metrics();
      const tx = viewport.clientWidth / 2 - (pos * slot + cardWidth / 2);
      track.style.transition = animate ? "" : "none";
      track.style.transform = `translateX(${tx}px)`;
      updateDots();
    }

    function updateDots() {
      const real = (((pos - 1) % n) + n) % n;
      dots.forEach((d, i) => d.classList.toggle("active", i === real));
    }

    function go(delta) {
      if (animating) return;
      animating = true;
      pos += delta;
      apply(true);
    }

    function goTo(targetPos) {
      if (animating || targetPos === pos) return;
      animating = true;
      pos = targetPos;
      apply(true);
    }

    track.addEventListener("transitionend", (e) => {
      if (e.target !== track || e.propertyName !== "transform") return;
      animating = false;
      if (pos === n + 1) {
        pos = 1;
        apply(false);
      } else if (pos === 0) {
        pos = n;
        apply(false);
      }
    });

    prevBtn.addEventListener("click", () => go(-1));
    nextBtn.addEventListener("click", () => go(1));

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    let startX = null;
    viewport.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      startX = null;
    });

    window.addEventListener("resize", () => apply(false));
    apply(false);
  }
})();
