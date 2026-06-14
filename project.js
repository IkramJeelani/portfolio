/* Detail page: look up the project by ?id= and render the in-depth view. */
(function () {
  const page = document.getElementById("projectPage");
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const projects = window.PROJECTS || [];
  const project = projects.find((p) => p.id === id);

  if (!project) {
    page.innerHTML = `
      <a class="back-link" href="index.html#projects">&larr; Back to projects</a>
      <h1>Project not found</h1>
      <p>Sorry, we couldn't find that project. It may have been renamed or removed.</p>
    `;
    return;
  }

  document.title = `${project.title} — Ikram Jeelani`;

  const techHtml = (project.tech || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  const detailsHtml = (project.details || [])
    .map((d) => `<p>${d}</p>`)
    .join("");

  const linksHtml = (project.links || [])
    .map(
      (l) =>
        `<a class="btn btn-primary" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`
    )
    .join("");

  page.innerHTML = `
    <a class="back-link" href="index.html#projects">&larr; Back to projects</a>
    <div class="project-hero" style="background-image:url('${project.image}')"></div>
    <h1>${project.title}</h1>
    <p class="project-tagline">${project.tagline || ""}</p>
    <div class="tags">${techHtml}</div>
    <p class="project-overview">${project.overview || ""}</p>
    <div class="project-details">${detailsHtml}</div>
    <div class="project-links">${linksHtml}</div>
  `;
})();
