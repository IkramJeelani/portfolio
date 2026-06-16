/* Detail page: look up the project by ?id= and render the in-depth view. */
(function () {
  const page = document.getElementById("projectPage");
  const projects = window.PROJECTS || [];
  const id = new URLSearchParams(window.location.search).get("id");
  const project = projects.find((p) => p.id === id);

  if (!project) {
    page.innerHTML = `
      <a class="back-link" href="index.html#projects">&larr; Back to projects</a>
      <h1>Project not found</h1>
      <p>Sorry, we couldn't find that project. It may have been renamed or removed.</p>`;
    return;
  }

  document.title = `${project.title} — ${(window.PROFILE || {}).name || ""}`;
  // Remember which project, so going back morphs the hero into the right card.
  try {
    sessionStorage.setItem("lastProject", encodeURIComponent(project.id));
  } catch (e) {}

  const techHtml = (project.tech || []).map((t) => `<span class="tag">${t}</span>`).join("");
  const linksHtml = (project.links || [])
    .map(
      (l) =>
        `<a class="btn btn-primary" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`
    )
    .join("");

  // Free-form body if provided; otherwise fall back to the older overview/details fields.
  let bodyHtml = project.body;
  if (!bodyHtml) {
    bodyHtml =
      (project.overview ? `<p class="project-overview">${project.overview}</p>` : "") +
      (project.details || []).map((d) => `<p>${d}</p>`).join("");
  }

  page.innerHTML = `
    <a class="back-link" href="index.html#projects">&larr; Back to projects</a>
    <div class="project-hero" style="background-image:url('${project.image}')"></div>
    <h1>${project.title}</h1>
    <p class="project-tagline">${project.tagline || ""}</p>
    ${project.date ? `<p class="project-date">${project.date}</p>` : ""}
    <div class="tags">${techHtml}</div>
    <div class="project-content">${bodyHtml}</div>
    <div class="project-links">${linksHtml}</div>`;

  // "Back to projects" — flag a return so the home page restores scroll + morphs the hero.
  const backLink = page.querySelector(".back-link");
  if (backLink) {
    backLink.addEventListener("click", () => {
      try {
        sessionStorage.setItem("returnToProjects", "1");
      } catch (e) {}
    });
  }

  // Floating quick-access dock: an infinite vertical reel + position dots (no scrollbar).
  const n = projects.length;
  const cardsHTML = projects
    .map((p) => {
      const active = p.id === project.id ? " active" : "";
      const tags = (p.tech || [])
        .slice(0, 4)
        .map((t) => `<span class="tag">${t}</span>`)
        .join("");
      return `
        <a class="dock-card${active}" data-id="${encodeURIComponent(p.id)}" href="project.html?id=${encodeURIComponent(p.id)}">
          <div class="dock-name">${p.title}</div>
          ${p.date ? `<div class="dock-date">${p.date}</div>` : ""}
          ${p.tagline ? `<div class="dock-tagline">${p.tagline}</div>` : ""}
          ${tags ? `<div class="tags dock-tags">${tags}</div>` : ""}
        </a>`;
    })
    .join("");

  const dock = document.createElement("aside");
  dock.className = "project-dock";
  dock.setAttribute("aria-label", "Other projects");
  dock.innerHTML = `
    <div class="dock-title">Projects</div>
    <div class="dock-viewport"><div class="dock-reel">${cardsHTML}</div></div>
    <div class="dock-nav" aria-hidden="true"></div>`;
  document.body.appendChild(dock);

  const viewport = dock.querySelector(".dock-viewport");
  const reel = dock.querySelector(".dock-reel");
  const nav = dock.querySelector(".dock-nav");
  let cards = Array.from(reel.children);

  // Position dots (one per project); click jumps straight to that project.
  const dots = projects.map((p) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "dock-dot" + (p.id === project.id ? " active" : "");
    d.title = p.title;
    nav.appendChild(d);
    return d;
  });

  // Genie image preview beside the dock on hover (delegated so clones work too).
  const preview = document.createElement("div");
  preview.className = "dock-preview";
  preview.setAttribute("aria-hidden", "true");
  document.body.appendChild(preview);
  const PREVIEW_H = 170;
  reel.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".dock-card");
    if (!card) return;
    const p = projects.find((x) => x.id === decodeURIComponent(card.dataset.id || ""));
    if (!p) return;
    preview.style.backgroundImage = `url('${p.image}')`;
    const r = card.getBoundingClientRect();
    const dr = dock.getBoundingClientRect();
    let top = r.top + r.height / 2 - PREVIEW_H / 2;
    top = Math.max(8, Math.min(top, window.innerHeight - PREVIEW_H - 8));
    preview.style.top = top + "px";
    preview.style.left = dr.right + 14 + "px";
    preview.classList.add("show");
  });
  dock.addEventListener("mouseleave", () => preview.classList.remove("show"));

  // Manual scroll (scrollbar hidden). Dots show position and jump to a card.
  const scrollToCard = (i, smooth) => {
    const c = cards[i];
    if (!c) return;
    const target = c.offsetTop + c.offsetHeight / 2 - viewport.clientHeight / 2;
    viewport.scrollTo({ top: Math.max(0, target), behavior: smooth ? "smooth" : "auto" });
  };
  const highlight = () => {
    const vr = viewport.getBoundingClientRect();
    const cy = vr.top + vr.height / 2;
    let best = Infinity;
    let bi = 0;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - cy);
      if (d < best) {
        best = d;
        bi = i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === bi));
  };
  dots.forEach((d, i) => d.addEventListener("click", () => scrollToCard(i, true)));
  viewport.addEventListener("scroll", highlight, { passive: true });
  // Open with the current project centred.
  const curIdx = projects.findIndex((p) => p.id === project.id);
  if (curIdx >= 0) scrollToCard(curIdx, false);
  highlight();

  // Back link goes to the home page; main.js restores scroll + morph on arrival.
  if (backLink) backLink.setAttribute("href", "index.html");
})();
