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

  // Floating quick-access dock listing every project (shown on wide screens).
  const dock = document.createElement("aside");
  dock.className = "project-dock";
  dock.setAttribute("aria-label", "Other projects");
  dock.innerHTML =
    '<div class="dock-title">Projects</div>' +
    projects
      .map((p) => {
        const active = p.id === project.id ? " active" : "";
        const tags = (p.tech || [])
          .slice(0, 4)
          .map((t) => `<span class="tag">${t}</span>`)
          .join("");
        return `
          <a class="dock-card${active}" href="project.html?id=${encodeURIComponent(p.id)}">
            <div class="dock-name">${p.title}</div>
            ${p.date ? `<div class="dock-date">${p.date}</div>` : ""}
            ${p.tagline ? `<div class="dock-tagline">${p.tagline}</div>` : ""}
            ${tags ? `<div class="tags dock-tags">${tags}</div>` : ""}
          </a>`;
      })
      .join("");
  document.body.appendChild(dock);

  // Equal height for all dock cards (the tallest sets the height).
  const dockCards = Array.from(dock.querySelectorAll(".dock-card"));
  const equalizeDock = () => {
    dockCards.forEach((c) => (c.style.height = ""));
    let max = 0;
    dockCards.forEach((c) => (max = Math.max(max, c.offsetHeight)));
    dockCards.forEach((c) => (c.style.height = max + "px"));
  };
  if (dockCards.length > 1) {
    equalizeDock();
    window.addEventListener("resize", equalizeDock);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalizeDock);
  }

  // Hover a dock card -> the project image pops out beside the dock (genie-style expand).
  const preview = document.createElement("div");
  preview.className = "dock-preview";
  preview.setAttribute("aria-hidden", "true");
  document.body.appendChild(preview);
  const PREVIEW_H = 170;
  dockCards.forEach((card, idx) => {
    const p = projects[idx];
    if (!p) return;
    card.addEventListener("mouseenter", () => {
      preview.style.backgroundImage = `url('${p.image}')`;
      const r = card.getBoundingClientRect();
      const dr = dock.getBoundingClientRect();
      let top = r.top + r.height / 2 - PREVIEW_H / 2;
      top = Math.max(8, Math.min(top, window.innerHeight - PREVIEW_H - 8));
      preview.style.top = top + "px";
      preview.style.left = dr.right + 12 + "px";
      preview.classList.add("show");
    });
    card.addEventListener("mouseleave", () => preview.classList.remove("show"));
  });

  // Back link goes to the home page; main.js restores scroll + morph on arrival.
  if (backLink) backLink.setAttribute("href", "index.html");
})();
