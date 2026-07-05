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
    <a class="back-link" href="index.html#projects">&larr; Back to projects</a>
    <div class="project-hero" style="background-image:url('${project.image}')"></div>
    <h1>${project.title}</h1>
    <p class="project-tagline">${project.tagline || ""}</p>
    ${project.date ? `<p class="project-date">${project.date}</p>` : ""}
    <div class="tags">${techHtml}</div>
    <div class="project-content">${bodyHtml}</div>
    <div class="project-links">${linksHtml}</div>
    ${pagerHtml}`;

  // Any project→project hop records the dock's reel position first, so the
  // next page can pick the list up exactly where it was (assigned below,
  // once the dock exists).
  let saveDock = () => {};

  // ←/→ step through projects (ignored while typing or with modifiers held).
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.key === "ArrowLeft" && prevP) {
      saveDock();
      location.href = "project.html?id=" + encodeURIComponent(prevP.id);
    } else if (e.key === "ArrowRight" && nextP) {
      saveDock();
      location.href = "project.html?id=" + encodeURIComponent(nextP.id);
    }
  });
  page.querySelectorAll(".pager-card").forEach((a) =>
    a.addEventListener("click", () => saveDock())
  );

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
  // Each row leads with the project's own image as a thumbnail (the clearest
  // at-a-glance identifier) and a position number, so it's obvious which
  // project you're on and what else is in the list.
  const cardsHTML = projects
    .map((p, i) => {
      const active = p.id === project.id ? " active" : "";
      const num = String(i + 1).padStart(2, "0");
      return `
        <a class="dock-card${active}" data-id="${encodeURIComponent(p.id)}" href="project.html?id=${encodeURIComponent(p.id)}">
          <span class="dock-thumb" style="background-image:url('${p.image}')">
            <span class="dock-num">${num}</span>
          </span>
          <span class="dock-body">
            ${active ? '<span class="dock-flag">Now viewing</span>' : ""}
            <span class="dock-name">${p.title}</span>
            ${p.date ? `<span class="dock-date">${p.date}</span>` : ""}
          </span>
        </a>`;
    })
    .join("");

  const dock = document.createElement("aside");
  dock.className = "project-dock dock-no-anim";
  dock.setAttribute("aria-label", "Other projects");
  dock.innerHTML = `
    <div class="dock-head">
      <span class="dock-title">Projects</span>
      <button class="dock-collapse" type="button" aria-label="Hide projects panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
      </button>
    </div>
    <div class="dock-viewport"><div class="dock-reel">${cardsHTML}</div></div>`;
  // First visit: show the dock so people discover it. After that, respect
  // whatever the visitor chose (collapse state persists in localStorage).
  let dockHidden = false;
  try {
    const stored = localStorage.getItem("dockHidden");
    if (stored !== null) dockHidden = stored !== "0";
  } catch (e) {}
  if (dockHidden) dock.classList.add("collapsed");
  document.body.appendChild(dock);
  requestAnimationFrame(() => dock.classList.remove("dock-no-anim")); // avoid initial slide

  const viewport = dock.querySelector(".dock-viewport");
  const reel = dock.querySelector(".dock-reel");
  const reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  saveDock = () => {
    try {
      sessionStorage.setItem("dockScroll", String(Math.round(viewport.scrollTop)));
      sessionStorage.setItem("dockNav", "1");
    } catch (e) {}
  };
  reel.addEventListener("click", (e) => {
    if (e.target.closest(".dock-card")) saveDock();
  });

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
  // Arriving from another project (dock / pager / arrow keys): start the reel
  // exactly where it was on the previous page, then GLIDE the new selection
  // into the centre — you see the list move to the new spot instead of an
  // instant, disorienting reshuffle.
  let cameFromProject = false;
  let savedReel = null;
  try {
    cameFromProject = sessionStorage.getItem("dockNav") === "1";
    savedReel = sessionStorage.getItem("dockScroll");
    sessionStorage.removeItem("dockNav");
  } catch (e) {}
  if (dockCards.length > 1) equalizeDock();
  if (cameFromProject && savedReel !== null) {
    viewport.scrollTop = +savedReel;
    updateRail();
    setTimeout(() => centerActive(!reducedMotion), 450); // after the page transition settles
  } else {
    centerActive(false);
    updateRail();
  }
  window.addEventListener("resize", layoutDock);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      if (dockCards.length > 1) equalizeDock();
      updateRail();
    });

  // Genie image preview beside the dock on hover (delegated; skip the current project).
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
    const dr = dock.getBoundingClientRect();
    let top = r.top + r.height / 2 - PREVIEW_H / 2;
    top = Math.max(8, Math.min(top, window.innerHeight - PREVIEW_H - 8));
    preview.style.top = top + "px";
    preview.style.left = dr.right + 28 + "px"; // clear of the scroll line
    preview.classList.add("show");
  });
  dock.addEventListener("mouseleave", () => preview.classList.remove("show"));

  // Scrolling: fully native. The browser's own momentum/inertia (mouse,
  // trackpad, touch) is smoother than anything reimplemented in JS, CSS
  // scroll-snap settles cards neatly, and `overscroll-behavior: contain`
  // keeps the scroll inside the dock without a preventDefault handler.

  // Show / hide the floating dock (collapse button in it + a reveal tab on the edge).
  const collapseBtn = dock.querySelector(".dock-collapse");
  const reveal = document.createElement("button");
  // "pulse" nudges attention at the tab a couple of times, then stops (CSS).
  reveal.className = "dock-reveal" + (dockHidden ? " show pulse" : "");
  reveal.type = "button";
  reveal.setAttribute("aria-label", "Show projects panel");
  reveal.textContent = "Projects ›";
  document.body.appendChild(reveal);
  const setCollapsed = (c) => {
    dock.classList.toggle("collapsed", c);
    reveal.classList.toggle("show", c);
    try {
      localStorage.setItem("dockHidden", c ? "1" : "0");
    } catch (e) {}
  };
  collapseBtn.addEventListener("click", () => setCollapsed(true));
  reveal.addEventListener("click", () => setCollapsed(false));

  // Back link goes to the home page; main.js restores scroll + morph on arrival.
  if (backLink) backLink.setAttribute("href", "index.html");
})();
