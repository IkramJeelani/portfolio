/* Detail page: look up the project by ?id= and render the in-depth view. */
(function () {
  const page = document.getElementById("projectPage");
  const projects = window.PROJECTS || [];
  const id = new URLSearchParams(window.location.search).get("id");
  const project = projects.find((p) => p.id === id);

  if (!project) {
    // No second back link here — the topbar's is always present.
    page.innerHTML = `
      <h1>Project not found</h1>
      <p>Sorry, we couldn't find that project. It may have been renamed or removed.</p>`;
    return;
  }

  // Hyphen separator to match the home page's "Ikram Jeelani - Portfolio".
  document.title = `${project.title} - ${(window.PROFILE || {}).name || ""}`;

  // Refine the sharing/SEO tags for this specific project so a shared project
  // link shows its own title, description and URL.
  (function updateMeta() {
    const site = "https://ikramjeelani.github.io/portfolio/";
    const url = site + "project.html?id=" + encodeURIComponent(project.id);
    const desc =
      project.tagline || `An in-depth look at ${project.title} by ${(window.PROFILE || {}).name || ""}.`;
    // These tags all exist statically in project.html — just update them.
    const set = (sel, val) => {
      const el = document.head.querySelector(sel);
      if (el) el.setAttribute("content", val);
    };
    set('meta[name="description"]', desc);
    set('meta[property="og:title"]', document.title);
    set('meta[property="og:description"]', desc);
    set('meta[property="og:url"]', url);
    set('meta[name="twitter:title"]', document.title);
    set('meta[name="twitter:description"]', desc);
    const canon = document.head.querySelector('link[rel="canonical"]');
    if (canon) canon.href = url;
  })();

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

  // Previous / next projects (data.js order) — pager cards at the end of the
  // page so a reader is never left at a dead end, plus ←/→ keyboard nav.
  const idx = projects.indexOf(project);
  const prevP = idx > 0 ? projects[idx - 1] : null;
  const nextP = idx < projects.length - 1 ? projects[idx + 1] : null;
  const pagerCard = (p, dir) => `
    <a class="pager-card pager-${dir}" href="project.html?id=${encodeURIComponent(p.id)}">
      <span class="pager-thumb" style="background-image:url('${p.image}')"></span>
      <span class="pager-text">
        <span class="pager-dir">${dir === "prev" ? "&larr; Previous" : "Next &rarr;"}</span>
        <span class="pager-title">${p.title}</span>
      </span>
    </a>`;
  const pagerHtml =
    prevP || nextP
      ? `<nav class="project-pager" aria-label="More projects">
          ${prevP ? pagerCard(prevP, "prev") : "<span></span>"}
          ${nextP ? pagerCard(nextP, "next") : "<span></span>"}
        </nav>`
      : "";

  page.innerHTML = `
    <div class="project-hero" style="background-image:url('${project.image}')"></div>
    <h1>${project.title}</h1>
    <p class="project-tagline">${project.tagline || ""}</p>
    ${project.date ? `<p class="project-date">${project.date}</p>` : ""}
    <div class="tags">${techHtml}</div>
    <div class="project-content">${bodyHtml}</div>
    <div class="project-links">${linksHtml}</div>
    ${pagerHtml}`;

  // ←/→ step through projects (ignored while typing or with modifiers held).
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.key === "ArrowLeft" && prevP) {
      location.href = "project.html?id=" + encodeURIComponent(prevP.id);
    } else if (e.key === "ArrowRight" && nextP) {
      location.href = "project.html?id=" + encodeURIComponent(nextP.id);
    }
  });

  // "Back to projects" — flag a return so the home page restores scroll + morphs the hero.
  // This is the ONE back link on the page — it lives in the topbar (static
  // HTML in project.html), not duplicated here.
  const backLink = document.getElementById("topbarBack");
  if (backLink) {
    backLink.addEventListener("click", () => {
      try {
        sessionStorage.setItem("returnToProjects", "1");
      } catch (e) {}
    });
  }

  // Project list, living inside the sidebar itself now — not a separate
  // floating panel (that meant two side panels competing for the same
  // edge of the screen). Each row leads with a position number and the
  // title/date — used to lead with a 46px image thumbnail too, but at that
  // size it read as too small to actually help identify anything, just
  // visual noise next to text that already does the job.
  const cardsHTML = projects
    .map((p, i) => {
      const active = p.id === project.id ? " active" : "";
      const num = String(i + 1).padStart(2, "0");
      return `
        <a class="dock-card${active}" data-id="${encodeURIComponent(p.id)}" href="project.html?id=${encodeURIComponent(p.id)}">
          <span class="dock-num">${num}</span>
          <span class="dock-body">
            ${active ? '<span class="dock-flag">Now viewing</span>' : ""}
            <span class="dock-name">${p.title}</span>
            ${p.date ? `<span class="dock-date">${p.date}</span>` : ""}
          </span>
        </a>`;
    })
    .join("");

  const sidebar = document.querySelector(".site-header");
  // Nothing to list against if there's only one project.
  if (sidebar && projects.length > 1) {
    const dock = document.createElement("div");
    dock.className = "sidebar-dock";
    dock.setAttribute("aria-label", "Other projects");
    dock.innerHTML = `
      <span class="sidebar-dock-title">Projects</span>
      <div class="dock-reel">${cardsHTML}</div>`;
    // Between the brand and the footer controls — branding.js has already
    // appended .header-controls to the sidebar by the time this script
    // runs (branding.js loads first; see project.html's script order).
    const controls = sidebar.querySelector(".header-controls");
    if (controls) sidebar.insertBefore(dock, controls);
    else sidebar.appendChild(dock);

    const reel = dock.querySelector(".dock-reel");

    // Cards are a fixed height in CSS, so the active card's "Now viewing"
    // flag never resizes the row — the list stays exactly the same size on
    // every project. Centre the current one (clamped — as close to the
    // middle as it can get), immediately and pre-paint, so it looks right
    // however you arrive rather than settling into place after a delay.
    const centerActive = (smooth) => {
      const cur = reel.querySelector(".dock-card.active");
      if (!cur) return;
      const max = Math.max(0, reel.scrollHeight - reel.clientHeight);
      const target = cur.offsetTop + cur.offsetHeight / 2 - reel.clientHeight / 2;
      reel.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: smooth ? "smooth" : "auto" });
    };
    centerActive(false);
    // rAF-coalesced — a drag-resize firing many "resize" events shouldn't
    // force a scroll-layout recompute on every single one of them.
    let dockResizeRaf = null;
    window.addEventListener("resize", () => {
      if (dockResizeRaf) return;
      dockResizeRaf = requestAnimationFrame(() => {
        dockResizeRaf = null;
        centerActive(false);
      });
    });

    // Genie image preview beside the sidebar on hover (delegated; skip the
    // current project).
    const preview = document.createElement("div");
    preview.className = "dock-preview";
    preview.setAttribute("aria-hidden", "true");
    document.body.appendChild(preview);
    const PREVIEW_H = 170;
    reel.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".dock-card");
      // Moving onto the current project (or a gap) hides any lingering preview —
      // otherwise the last unselected card's image would stay stuck on screen.
      if (!card || card.classList.contains("active")) {
        preview.classList.remove("show");
        return;
      }
      const p = projects.find((x) => x.id === decodeURIComponent(card.dataset.id || ""));
      if (!p) {
        preview.classList.remove("show");
        return;
      }
      preview.style.backgroundImage = `url('${p.image}')`;
      const r = card.getBoundingClientRect();
      const sr = sidebar.getBoundingClientRect();
      let top = r.top + r.height / 2 - PREVIEW_H / 2;
      top = Math.max(8, Math.min(top, window.innerHeight - PREVIEW_H - 8));
      preview.style.top = top + "px";
      preview.style.left = sr.right + 16 + "px";
      preview.classList.add("show");
    });
    dock.addEventListener("mouseleave", () => preview.classList.remove("show"));

    // Scrolling: fully native. The browser's own momentum/inertia (mouse,
    // trackpad, touch) is smoother than anything reimplemented in JS, and
    // `overscroll-behavior: contain` (in CSS) keeps the scroll inside the
    // list without a preventDefault handler.
  }
})();
