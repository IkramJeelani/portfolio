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

  // Floating quick-access dock: a manually-scrollable list of projects.
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
    <div class="dock-viewport"><div class="dock-reel">${cardsHTML}</div></div>`;
  document.body.appendChild(dock);

  const viewport = dock.querySelector(".dock-viewport");
  const reel = dock.querySelector(".dock-reel");

  // Vertical location line beside the dock (custom scroll-position indicator).
  const rail = document.createElement("div");
  rail.className = "dock-rail";
  const thumb = document.createElement("div");
  thumb.className = "dock-rail-thumb";
  rail.appendChild(thumb);
  dock.appendChild(rail);
  const updateRail = () => {
    const sh = viewport.scrollHeight;
    const ch = viewport.clientHeight;
    if (sh <= ch + 2) {
      rail.style.display = "none";
      return;
    }
    rail.style.display = "block";
    rail.style.top = viewport.offsetTop + "px";
    rail.style.height = ch + "px";
    const thumbH = Math.max(24, (ch / sh) * ch);
    thumb.style.height = thumbH + "px";
    const denom = sh - ch;
    thumb.style.transform = `translateY(${denom > 0 ? (viewport.scrollTop / denom) * (ch - thumbH) : 0}px)`;
  };
  viewport.addEventListener("scroll", updateRail, { passive: true });

  // Make the line behave like a scrollbar: drag the thumb, click the track to jump.
  let dragging = false;
  let dragStartY = 0;
  let dragStartScroll = 0;
  thumb.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragStartY = e.clientY;
    dragStartScroll = viewport.scrollTop;
    rail.classList.add("dragging");
    try { thumb.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  thumb.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const maxThumb = viewport.clientHeight - thumb.offsetHeight;
    if (maxThumb <= 0) return;
    const dy = e.clientY - dragStartY;
    viewport.scrollTop = dragStartScroll + (dy / maxThumb) * (viewport.scrollHeight - viewport.clientHeight);
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove("dragging");
    try { thumb.releasePointerCapture(e.pointerId); } catch (err) {}
  };
  thumb.addEventListener("pointerup", endDrag);
  thumb.addEventListener("pointercancel", endDrag);
  rail.addEventListener("pointerdown", (e) => {
    if (e.target === thumb) return; // clicking the track jumps there
    const rect = rail.getBoundingClientRect();
    const frac = (e.clientY - rect.top) / rect.height;
    viewport.scrollTo({
      top: frac * (viewport.scrollHeight - viewport.clientHeight),
      behavior: "smooth",
    });
  });

  // All dock cards share the same height (tallest wins).
  const dockCards = Array.from(reel.children);
  const equalizeDock = () => {
    dockCards.forEach((c) => (c.style.height = ""));
    let max = 0;
    dockCards.forEach((c) => (max = Math.max(max, c.offsetHeight)));
    dockCards.forEach((c) => (c.style.height = max + "px"));
  };
  // Centre the current project in the dock (clamped — as close to the middle as it can get).
  const centerActive = (smooth) => {
    const cur = reel.querySelector(".dock-card.active");
    if (!cur) return;
    const max = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const target = cur.offsetTop + cur.offsetHeight / 2 - viewport.clientHeight / 2;
    viewport.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: smooth ? "smooth" : "auto" });
  };
  const layoutDock = () => {
    if (dockCards.length > 1) equalizeDock();
    centerActive(false);
    updateRail();
  };
  layoutDock();
  window.addEventListener("resize", layoutDock);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutDock);

  // Genie image preview beside the dock on hover (delegated; skip the current project).
  const preview = document.createElement("div");
  preview.className = "dock-preview";
  preview.setAttribute("aria-hidden", "true");
  document.body.appendChild(preview);
  const PREVIEW_H = 170;
  reel.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".dock-card");
    if (!card || card.classList.contains("active")) return; // no preview for the current project
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

  // Scrolling over the dock scrolls only the dock — never the whole page.
  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      viewport.scrollTop += e.deltaY;
    },
    { passive: false }
  );

  // Back link goes to the home page; main.js restores scroll + morph on arrival.
  if (backLink) backLink.setAttribute("href", "index.html");
})();
