/* Shared branding: keeps the top-left logo and the browser-tab icon identical,
   and fills in name/role/bio/year from PROFILE. Runs on every page. */
(function () {
  const p = window.PROFILE || {};
  const initials = (p.initials || "").trim();

  // Keep the browser-chrome colour (Android address bar etc.) in sync with
  // the active theme — a hardcoded dark value on a light page renders a
  // mismatched dark bar around light content.
  const syncThemeColor = () => {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = light ? "#f6f3ec" : "#14161c";
  };
  syncThemeColor();

  // Build the tab icon from the SAME initials AND the same gradient as the
  // on-page logo (.brand), so the two actually match. Kept on a page
  // background-coloured backdrop (rather than transparent) so it stays
  // legible in both light- and dark-chrome browser tabs.
  const fontSize = initials.length > 2 ? 22 : 32;
  const buildFavicon = () => {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    const bg = light ? "#f6f3ec" : "#14161c";
    // B&W + one accent: solid fill (was a purple->pink gradient) to match
    // the on-page logo, which is now solid too. Read live off --accent
    // (not a hardcoded hex per theme) so the two can't silently drift out
    // of sync the next time the accent color changes — that's exactly what
    // happened here before this fix: the on-page .brand mark picks up
    // var(--accent) automatically, but this hex was a frozen duplicate.
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      (light ? "#c2410c" : "#f97316");
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
      "<rect width='64' height='64' rx='14' fill='" + bg + "'/>" +
      // dominant-baseline="central" true-centers on font metrics instead of a
      // guessed y-offset — the old fixed baseline made the letters sit low
      // and look vertically squeezed at favicon size.
      "<text x='32' y='33' dominant-baseline='central' font-family='Segoe UI, Arial, sans-serif' font-size='" +
      fontSize +
      "' font-weight='800' fill='" + fg + "' text-anchor='middle'>" +
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
  };
  buildFavicon();

  // Fill placeholders found on the page.
  const fill = (attr, value) =>
    document.querySelectorAll("[" + attr + "]").forEach((el) => (el.textContent = value));

  fill("data-brand", initials);
  fill("data-name", p.name || "");
  fill("data-role", p.role || "");
  fill("data-bio", p.bio || "");
  fill("data-year", new Date().getFullYear());

  if (document.body.hasAttribute("data-home")) {
    // Fixed "Portfolio" suffix for the browser tab — independent of
    // PROFILE.role, which still drives the hero eyebrow text separately.
    document.title = (p.name || "") + " - Portfolio";
  }

  // Non-home pages (project detail) don't run main.js, so they can't build
  // their own nav links from window.SECTIONS the way the home page does.
  // They used to hardcode a copy of the section list directly in the HTML,
  // which silently drifted out of sync the moment SECTIONS changed (e.g.
  // gained "experience") -- generating it here from the same single source
  // of truth keeps it correct with zero extra upkeep. Titles match main.js's
  // builder titles exactly because both simply capitalize the SECTIONS key.
  if (!document.body.hasAttribute("data-home")) {
    const navEl = document.querySelector(".site-header nav");
    if (navEl && !navEl.children.length) {
      (window.SECTIONS || []).forEach((key) => {
        const a = document.createElement("a");
        a.href = "index.html#" + key;
        a.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        navEl.appendChild(a);
      });
    }
  }

  const header = document.querySelector(".site-header");
  if (header) {
    // Publish the header's real height as --header-h. The header is transparent
    // over the hero, so the hero uses this to centre its content in the FULL
    // viewport (pulling up under the header) instead of the space below it.
    const setHeaderH = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        header.getBoundingClientRect().height + "px"
      );
    setHeaderH();
    window.addEventListener("resize", setHeaderH);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setHeaderH);

    // Clicking the IJ logo scrolls all the way to the top (nav goes transparent).
    const brand = header.querySelector(".brand");
    if (brand && document.body.hasAttribute("data-home")) {
      brand.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } else if (brand) {
      // Navigating to the home page from elsewhere (e.g. a project page) —
      // flag it so the hero's first-load intro (name-alone-then-cascade)
      // doesn't replay; it should only play on an actual fresh site load.
      brand.addEventListener("click", () => {
        try {
          sessionStorage.setItem("skipHeroIntro", "1");
        } catch (e) {}
      });
    }

    // Centred control group: theme toggle.
    const controls = document.createElement("div");
    controls.className = "header-controls";
    header.appendChild(controls);

    // Light/dark toggle (default theme comes from SETTINGS.theme in data.js).
    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    // The label names the ACTION (what pressing it does), so assistive tech
    // hears the state implicitly — clearer than a static "toggle" label.
    const syncThemeLabel = () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    };
    syncThemeLabel();
    toggle.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></svg>';
    controls.appendChild(toggle);
    // Used to just call apply() through document.startViewTransition() for a
    // circular-reveal effect. Removed: repeated/rapid clicks could overlap
    // two in-flight transitions, and the browser would get stuck rendering
    // a stale --bg value on <body> — a real, reproducible bug, not a
    // one-off. Plain CSS (the transition on body's background-color/color
    // in the base stylesheet) handles the fade reliably instead.
    toggle.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      buildFavicon(); // keep the tab icon's gradient in sync with the theme
      syncThemeColor();
      syncThemeLabel();
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });

    // Résumé button, between the two toggles — created here (not main.js) so
    // it exists on EVERY page's header, including project detail pages, where
    // the site's one real CTA used to silently disappear. On the home page
    // main.js's PDF modal intercepts the data-pdf click; on project pages
    // (no main.js) the link simply opens the PDF in a new tab.
    const RESUME = window.RESUME || {};
    if (RESUME.show && RESUME.url) {
      // Same GitHub-blob-to-local-path resolution main.js uses for certificates.
      const toEmbed = (url) => {
        const m = url.match(/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+\.pdf)$/i);
        if (m) return m[1];
        return /\.pdf($|\?)/i.test(url) ? url : "";
      };
      const label = RESUME.label || "Résumé";
      const resumeBtn = document.createElement("a");
      resumeBtn.className = "nav-resume-btn";
      resumeBtn.href = RESUME.url;
      resumeBtn.target = "_blank";
      resumeBtn.rel = "noopener";
      resumeBtn.setAttribute("data-pdf-title", (p.name || "") + " — Résumé");
      resumeBtn.setAttribute("aria-label", label);
      resumeBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>' +
        "<span>" + label + "</span>";
      const embed = toEmbed(RESUME.url);
      if (embed) resumeBtn.setAttribute("data-pdf", embed);
      // Résumé first, then the theme toggle -- inserted before it rather
      // than appended, since toggle is already in the DOM by this point.
      controls.insertBefore(resumeBtn, toggle);
    }

    // Hamburger menu — collapses the nav links into a dropdown on narrow screens.
    // Deferred to DOMContentLoaded because main.js fills in the nav links AFTER
    // this script runs — checking children now would always find an empty nav.
    const setupMenu = () => {
    const navEl = header.querySelector("nav");
    if (navEl && navEl.children.length) {
      const menuBtn = document.createElement("button");
      menuBtn.className = "nav-toggle";
      menuBtn.type = "button";
      menuBtn.setAttribute("aria-label", "Open menu");
      menuBtn.setAttribute("aria-expanded", "false");
      if (navEl.id) menuBtn.setAttribute("aria-controls", navEl.id);
      menuBtn.innerHTML =
        '<svg class="icon-bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
        '<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      // Inserted as the FIRST control (not appended) so the order reads
      // dropdown, résumé, theme toggle — grouped with the résumé/theme
      // buttons as one centered cluster on small screens, instead of
      // sitting off on its own at the right edge.
      controls.insertBefore(menuBtn, controls.firstChild);

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
      // Escape dismisses the open menu and hands focus back to the button —
      // standard disclosure-widget keyboard behaviour.
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navEl.classList.contains("open")) {
          setOpen(false);
          menuBtn.focus();
        }
      });
    }
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupMenu);
    } else {
      setupMenu();
    }
  }
})();
