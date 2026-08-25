/* Detail page: look up the project by ?id= and render the in-depth view. */
(function () {
  const page = document.getElementById("projectPage");
  // Each project's data self-registers into window.PROJECT_DATA (see its
  // project-data.js); assemble the final ordered list from data.js's
  // PROJECT_ORDER, dropping any id with no matching registered data.
  const projectData = window.PROJECT_DATA || {};
  const projects = (window.PROJECT_ORDER || []).map((id) => projectData[id]).filter(Boolean);
  const id = new URLSearchParams(window.location.search).get("id");
  const project = projects.find((p) => p.id === id);

  // project.html ships with no static <link rel="canonical"> — a shared
  // template can't know a real project's URL ahead of time, and asserting
  // the site ROOT as every project's canonical (the previous static value)
  // actively told crawlers "the real version of this page is the homepage,"
  // which can suppress a project page from being indexed as its own content.
  // This always ensures one exists and points at the current, real URL.
  const setCanonical = (href) => {
    let canon = document.head.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = href;
  };

  if (!project) {
    // No per-project data to show — give this state its own honest metadata
    // instead of leaving the generic template values in place (which
    // otherwise still claim, via title/OG tags, to be a real project page).
    document.title = `Project Not Found - ${(window.PROFILE || {}).name || ""}`;
    const notFoundDesc = "The project you're looking for doesn't exist. It may have been renamed or removed.";
    const set = (sel, val) => {
      const el = document.head.querySelector(sel);
      if (el) el.setAttribute("content", val);
    };
    set('meta[name="description"]', notFoundDesc);
    set('meta[property="og:title"]', document.title);
    set('meta[property="og:description"]', notFoundDesc);
    set('meta[property="og:url"]', location.href);
    set('meta[name="twitter:title"]', document.title);
    set('meta[name="twitter:description"]', notFoundDesc);
    set('meta[name="robots"]', "noindex, follow"); // nothing here worth indexing
    setCanonical(location.href); // self-referencing: no better URL exists for this state
    page.innerHTML = `
      <h1>Project not found</h1>
      <p>Sorry, we couldn't find that project. It may have been renamed or removed.</p>
      <a class="btn btn-primary" href="index.html#projects">&larr; Back to projects</a>`;
    return;
  }

  // Hyphen separator to match the home page's "Ikram Jeelani - Portfolio".
  document.title = `${project.title} - ${(window.PROFILE || {}).name || ""}`;

  // Refine the sharing/SEO tags for this specific project so a shared project
  // link shows its own title, description and URL.
  (function updateMeta() {
    const url = "https://ikramjeelani.github.io/portfolio/project.html?id=" + encodeURIComponent(project.id);
    const desc = `An in-depth look at ${project.title} by ${(window.PROFILE || {}).name || ""}.`;
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
    setCanonical(url);
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
      <img class="pager-thumb" src="${p.image}" alt="" loading="lazy">
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
    <h1>${project.title}</h1>
    ${project.date ? `<p class="project-date">${project.date}</p>` : ""}
    <div class="tags">${techHtml}</div>
    <div class="project-hero" style="background-image:url('${project.image}')"></div>
    <div class="project-content">${bodyHtml}</div>
    <div class="project-links">${linksHtml}</div>
    ${pagerHtml}`;

  // Free-form project bodies (data.js `body` strings) can contain hand-written
  // <img> tags with no way to know their dimensions ahead of time, so they
  // can't get explicit width/height like the fixed-size logo images — but
  // every one of them is below the fold, so they can all still be deferred.
  page.querySelectorAll(".project-content img").forEach((img) => {
    if (!img.hasAttribute("loading")) img.loading = "lazy";
  });

  // Table of contents: built from the body's own h2/h3 headings, fixed to
  // the left edge of the viewport on wide screens. Replaces the old
  // floating project-dock (which listed OTHER projects) with something
  // that actually helps navigate THIS page's numbered sections.
  (function buildTOC() {
    const contentEl = page.querySelector(".project-content");
    const headings = contentEl ? Array.from(contentEl.querySelectorAll("h2, h3")) : [];
    if (headings.length < 2) return; // not worth a TOC for a short page

    const used = new Set();
    const slugify = (s) => {
      const base =
        String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
      let slug = base,
        n = 2;
      while (used.has(slug)) slug = `${base}-${n++}`;
      used.add(slug);
      return slug;
    };

    const toc = document.createElement("nav");
    toc.className = "project-toc";
    toc.setAttribute("aria-label", "Table of contents");
    const list = document.createElement("div");
    list.className = "toc-list";
    toc.innerHTML = '<div class="toc-title">Contents</div>';
    toc.appendChild(list);

    // Track each h3's parent h2 link too, so scrolling into a subsection
    // (e.g. "5.1 Shafts") can keep its parent ("5. Manufacturing") visibly
    // active alongside it, instead of the parent looking un-highlighted
    // while you're clearly still inside its section.
    const links = [];
    let lastH2Link = null;
    headings.forEach((h) => {
      if (!h.id) h.id = slugify(h.textContent);
      const a = document.createElement("a");
      const isSub = h.tagName === "H3";
      a.className = "toc-link" + (isSub ? " toc-sub" : "");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      list.appendChild(a);
      const entry = { heading: h, link: a, parentLink: isSub ? lastH2Link : null };
      links.push(entry);
      if (!isSub) lastH2Link = a;
    });
    document.body.appendChild(toc);

    // A deep link loaded fresh (e.g. a bookmarked/shared #section URL) has
    // its target heading added to the DOM by this same script — too late
    // for the browser's own native "jump to fragment on load" step, which
    // already ran and found nothing there. Re-trigger it manually once the
    // heading actually exists.
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }

    // Highlight whichever section is currently in view — and, if that's a
    // subsection, its parent too (a lighter "toc-parent-active" indicator),
    // so the hierarchy stays visually consistent instead of only ever one
    // isolated link lighting up.
    const LINE = 140;
    let ticking = false;
    const check = () => {
      ticking = false;
      let current = null;
      links.forEach((entry) => {
        if (entry.heading.getBoundingClientRect().top - LINE <= 0) current = entry;
      });
      const activeParent = current && current.parentLink;
      links.forEach(({ link }) => {
        link.removeAttribute("aria-current");
        link.classList.remove("toc-parent-active");
      });
      if (current) current.link.setAttribute("aria-current", "true");
      if (activeParent) activeParent.classList.add("toc-parent-active");
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  })();

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
  const backLink = document.getElementById("topBackLink");
  if (backLink) {
    backLink.addEventListener("click", () => {
      try {
        sessionStorage.setItem("returnToProjects", "1");
      } catch (e) {}
    });
  }

  // Back link goes to the home page; main.js restores scroll + morph on arrival.
  if (backLink) backLink.setAttribute("href", "index.html");
})();
