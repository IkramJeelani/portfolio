/* Shared branding: keeps the top-left logo and the browser-tab icon identical,
   and fills in name/role/bio/year from PROFILE. Runs on every page. */
(function () {
  const p = window.PROFILE || {};
  const initials = (p.initials || "").trim();

  // Build the tab icon from the SAME initials as the on-page logo, so they always match.
  const fontSize = initials.length > 2 ? 22 : 32;
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
    "<rect width='64' height='64' rx='14' fill='#0b0a12'/>" +
    "<text x='32' y='40' font-family='Segoe UI, Arial, sans-serif' font-size='" +
    fontSize +
    "' font-weight='800' fill='#a855f7' text-anchor='middle'>" +
    initials +
    "</text></svg>";

  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = "data:image/svg+xml," + encodeURIComponent(svg);

  // Fill placeholders found on the page.
  const fill = (attr, value) =>
    document.querySelectorAll("[" + attr + "]").forEach((el) => (el.textContent = value));

  fill("data-brand", initials);
  fill("data-name", p.name || "");
  fill("data-role", p.role || "");
  fill("data-bio", p.bio || "");
  fill("data-year", new Date().getFullYear());

  if (document.body.hasAttribute("data-home")) {
    document.title = (p.name || "") + (p.role ? " — " + p.role : "");
  }

  // Background glow layer — corners "breathe" via CSS.
  const bg = document.createElement("div");
  bg.className = "bg-fx";
  bg.setAttribute("aria-hidden", "true");
  bg.innerHTML =
    '<span class="glow g1"></span><span class="glow g2"></span>' +
    '<span class="glow g3"></span><span class="glow g4"></span>';
  document.body.prepend(bg);

  // Cursor spotlight that follows the mouse across the nav bar.
  const header = document.querySelector(".site-header");
  if (header) {
    // Transparent at the very top; frosted background once scrolled.
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    header.addEventListener("pointermove", (e) => {
      const r = header.getBoundingClientRect();
      header.style.setProperty("--x", e.clientX - r.left + "px");
      header.style.setProperty("--y", e.clientY - r.top + "px");
    });

    // Clicking the IJ logo scrolls all the way to the top (nav goes transparent).
    const brand = header.querySelector(".brand");
    if (brand && document.body.hasAttribute("data-home")) {
      brand.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Light/dark toggle, centred in the nav bar (dark is the default).
    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle light and dark theme");
    toggle.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></svg>';
    header.appendChild(toggle);

    toggle.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });

    // Hamburger menu — collapses the nav links into a dropdown on narrow screens.
    const navEl = header.querySelector("nav");
    if (navEl) {
      const menuBtn = document.createElement("button");
      menuBtn.className = "nav-toggle";
      menuBtn.type = "button";
      menuBtn.setAttribute("aria-label", "Open menu");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.innerHTML =
        '<svg class="icon-bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
        '<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      header.appendChild(menuBtn);

      const setOpen = (open) => {
        navEl.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      };
      menuBtn.addEventListener("click", () => setOpen(!navEl.classList.contains("open")));
      // Close after picking a link, or when clicking outside the header.
      navEl.addEventListener("click", (e) => {
        if (e.target.closest("a")) setOpen(false);
      });
      document.addEventListener("click", (e) => {
        if (!header.contains(e.target)) setOpen(false);
      });
    }
  }

  // Gradient scroll-progress bar at the top of every page.
  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    // One-time light sweep across the whole page on load.
    const sweep = document.createElement("div");
    sweep.className = "page-sweep";
    document.body.appendChild(sweep);
    sweep.addEventListener("animationend", () => sweep.remove());
  }
})();
