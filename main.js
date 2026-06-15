/* Home page: render contacts + the project carousel. */
(function () {
  const projects = window.PROJECTS || [];

  /* ---------- Contact links ---------- */
  const contactWrap = document.getElementById("contactLinks");
  if (contactWrap) {
    (window.CONTACTS || []).forEach((c) => {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = c.url;
      a.textContent = c.label;
      if (/^https?:/i.test(c.url)) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      contactWrap.appendChild(a);
    });
  }

  /* ---------- About ---------- */
  const aboutEl = document.getElementById("aboutText");
  if (aboutEl && window.ABOUT) aboutEl.innerHTML = window.ABOUT;

  /* ---------- Experience ---------- */
  const expWrap = document.getElementById("experienceList");
  if (expWrap) {
    (window.EXPERIENCE || []).forEach((e) => {
      const item = document.createElement("div");
      item.className = "exp-item";
      const points = (e.points || []).map((p) => `<li>${p}</li>`).join("");
      item.innerHTML = `
        <div class="exp-head">
          <span class="exp-role">${e.role || ""}${
        e.company ? ` &middot; <span class="exp-company">${e.company}</span>` : ""
      }</span>
          <span class="exp-date">${e.date || ""}</span>
        </div>
        ${points ? `<ul class="exp-points">${points}</ul>` : ""}`;
      expWrap.appendChild(item);
    });
  }

  /* ---------- Skills ---------- */
  const skillsWrap = document.getElementById("skillsList");
  if (skillsWrap) {
    (window.SKILLS || []).forEach((g) => {
      const group = document.createElement("div");
      group.className = "skill-group";
      const tags = (g.items || []).map((i) => `<span class="tag">${i}</span>`).join("");
      group.innerHTML = `<h3 class="skill-category">${g.category}</h3><div class="tags">${tags}</div>`;
      skillsWrap.appendChild(group);
    });
  }

  /* ---------- Certifications ---------- */
  const certWrap = document.getElementById("certList");
  if (certWrap) {
    (window.CERTIFICATIONS || []).forEach((c) => {
      const item = document.createElement("div");
      item.className = "cert-item";
      const meta = [c.issuer, c.date].filter(Boolean).join(" · ");
      const link = c.url
        ? `<a class="cert-link" href="${c.url}" target="_blank" rel="noopener">View &rarr;</a>`
        : "";
      item.innerHTML = `
        <div class="cert-main">
          <span class="cert-name">${c.name || ""}</span>
          <span class="cert-meta">${meta}</span>
        </div>
        ${link}`;
      certWrap.appendChild(item);
    });
  }

  /* ---------- Projects carousel ---------- */
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

  // 3+ projects: seamless, centered, infinite carousel.
  // Clone the last card before the first and the first card after the last,
  // so wrapping around never shows an empty edge.
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

  // One dot per real project.
  const dots = projects.map((p, i) => {
    const d = document.createElement("button");
    d.className = "dot";
    d.setAttribute("aria-label", `Go to ${p.title}`);
    d.addEventListener("click", () => goTo(i + 1));
    dotsWrap.appendChild(d);
    return d;
  });

  let pos = 1; // index into `cards`; 1 = first real project (centered, neighbors on both sides)
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

  // After a move lands on a clone, instantly snap to the matching real card.
  track.addEventListener("transitionend", (e) => {
    // Ignore bubbled transitions from cards (e.g. hover); only react to the track's own move.
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

  // Touch swipe.
  let startX = null;
  viewport.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  viewport.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    startX = null;
  });

  window.addEventListener("resize", () => apply(false));

  apply(false); // initial position, no animation
})();
