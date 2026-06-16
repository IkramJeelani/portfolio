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

  // "Back to projects" — return to the exact spot on the home page if we came from it.
  const backLink = page.querySelector(".back-link");
  if (backLink) {
    backLink.addEventListener("click", (e) => {
      let fromIndex = false;
      try {
        const ref = document.referrer;
        fromIndex = ref && new URL(ref).origin === location.origin && !/project\.html/i.test(ref);
      } catch (err) {}
      if (fromIndex && window.history.length > 1) {
        e.preventDefault();
        window.history.back();
      }
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
            <div class="dock-img" style="background-image:url('${p.image}')"></div>
            <div class="dock-body">
              <div class="dock-name">${p.title}</div>
              ${p.date ? `<div class="dock-date">${p.date}</div>` : ""}
              ${p.tagline ? `<div class="dock-tagline">${p.tagline}</div>` : ""}
              ${tags ? `<div class="tags dock-tags">${tags}</div>` : ""}
            </div>
          </a>`;
      })
      .join("");
  document.body.appendChild(dock);
})();
