/* Shared branding: keeps the top-left logo and the browser-tab icon identical,
   and fills in name/role/bio/year from PROFILE. Runs on every page. */
(function () {
  const p = window.PROFILE || {};
  const initials = (p.initials || "").trim();

  const settings = window.SETTINGS || {};

  // Petals: default from data.js, overridden by the visitor's choice.
  let petalsEnabled = settings.particles !== false;
  try {
    const sp = localStorage.getItem("particles");
    if (sp !== null) petalsEnabled = sp !== "off";
  } catch (e) {}
  const petalsEl = document.querySelector(".petals");
  if (petalsEl && !petalsEnabled) petalsEl.classList.add("hidden");

  // Keep the browser-chrome colour (Android address bar etc.) in sync with
  // the active theme — a hardcoded dark value on a light page renders a
  // mismatched dark bar around light content.
  const syncThemeColor = () => {
    const light = document.documentElement.getAttribute("data-theme") !== "dark";
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
    const light = document.documentElement.getAttribute("data-theme") !== "dark";
    const bg = light ? "#f6f3ec" : "#14161c";
    const g1 = light ? "#d0453a" : "#e2695c";
    const g2 = light ? "#b93c30" : "#eda6b4";
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
      "<defs><linearGradient id='g' x1='0%' y1='100%' x2='100%' y2='0%'>" +
      "<stop offset='0%' stop-color='" + g1 + "'/>" +
      "<stop offset='100%' stop-color='" + g2 + "'/>" +
      "</linearGradient></defs>" +
      "<rect width='64' height='64' rx='14' fill='" + bg + "'/>" +
      // dominant-baseline="central" true-centers on font metrics instead of a
      // guessed y-offset — the old fixed baseline made the letters sit low
      // and look vertically squeezed at favicon size.
      "<text x='32' y='33' dominant-baseline='central' font-family='Segoe UI, Arial, sans-serif' font-size='" +
      fontSize +
      "' font-weight='800' fill='url(#g)' text-anchor='middle'>" +
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

  fill("data-name", p.name || "");
  fill("data-role", p.role || "");
  fill("data-bio", p.bio || "");
  fill("data-year", new Date().getFullYear());

  // Sidebar brand: compact "IJ" on the Home view specifically, the full
  // name everywhere else (every other section, and every non-index page —
  // project.html never has a "home" state, so it's always the full name
  // there). The favicon above always stays `initials`, regardless — a 64px
  // icon needs the compact form no matter which view is showing.
  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const brandEls = document.querySelectorAll("[data-brand]");
  let brandText = null; // last text actually applied, so a no-op switch doesn't fade for nothing
  const setBrandText = (text, animate) => {
    if (text === brandText) return; // e.g. About -> Skills: both "Ikram Jeelani", nothing to show
    brandText = text;
    if (!animate || reduced) {
      brandEls.forEach((el) => (el.textContent = text));
      return;
    }
    brandEls.forEach((el) => el.classList.add("swap"));
    setTimeout(() => {
      brandEls.forEach((el) => {
        el.textContent = text;
        el.classList.remove("swap");
      });
    }, 150);
  };
  const isHome = () =>
    document.body.hasAttribute("data-home") &&
    (location.hash || "#home").slice(1) === "home";
  setBrandText(isHome() ? initials : p.name || "", false);
  // main.js's section router dispatches this on every switch (see its
  // applyCurrent) — only index.html ever fires it, so this is a no-op on
  // project.html, which is exactly right: nothing there ever toggles.
  window.addEventListener("viewchange", () => setBrandText(isHome() ? initials : p.name || "", true));

  if (document.body.hasAttribute("data-home")) {
    // Fixed "Portfolio" suffix for the browser tab — independent of
    // PROFILE.role, which still drives the hero eyebrow text separately.
    document.title = (p.name || "") + " - Portfolio";
  }

  // Cursor spotlight that follows the mouse across the nav bar.
  const header = document.querySelector(".site-header");
  if (header) {
    // Publish the header's real height as --header-h. On mobile the sidebar
    // collapses into an in-flow sticky top bar, and styles.css's
    // max-width:900px block uses this to offset the topbar below it and
    // size the Home hero to the space actually visible beneath both.
    const setHeaderH = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        header.getBoundingClientRect().height + "px"
      );
    setHeaderH();
    // rAF-coalesced: a window drag-resize can fire many "resize" events per
    // frame, and each call forces a synchronous layout read (getBoundingClientRect).
    let headerResizeRaf = null;
    window.addEventListener("resize", () => {
      if (headerResizeRaf) return;
      headerResizeRaf = requestAnimationFrame(() => {
        headerResizeRaf = null;
        setHeaderH();
      });
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setHeaderH);

    header.addEventListener("pointermove", (e) => {
      const r = header.getBoundingClientRect();
      header.style.setProperty("--x", e.clientX - r.left + "px");
      header.style.setProperty("--y", e.clientY - r.top + "px");
    });

    // On index.html the brand's href is "#home" (an in-page hash), so this
    // intercepts the click to go through main.js's router instead of a raw
    // hash jump. On project.html/certificate.html the brand's href is a
    // real "index.html" page link — intercepting THAT with the same
    // #home-only logic just rewrote the current page's hash to #home
    // (project.html#home / certificate.html#home, neither of which mean
    // anything) instead of letting the actual navigation to index.html
    // happen, so the logo silently did nothing on those pages.
    const brand = header.querySelector(".brand");
    if (brand && brand.getAttribute("href") === "#home") {
      brand.addEventListener("click", (e) => {
        e.preventDefault();
        location.hash = "#home";
      });
    }

    // Sidebar bottom cluster: résumé button (primary CTA), then a compact
    // row containing the theme + particles toggles. The résumé button is
    // appended later (needs RESUME) — inserted before the toggle row so it
    // sits at the top of the cluster.
    const controls = document.createElement("div");
    controls.className = "header-controls";
    header.appendChild(controls);
    const toggleRow = document.createElement("div");
    toggleRow.className = "toggle-row";

    // Light/dark toggle (dark is the default).
    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    // The label names the ACTION (what pressing it does), so assistive tech
    // hears the state implicitly — clearer than a static "toggle" label.
    const syncThemeLabel = () => {
      const isLight = document.documentElement.getAttribute("data-theme") !== "dark";
      toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    };
    syncThemeLabel();
    toggle.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/></svg>';
    toggleRow.appendChild(toggle);
    toggle.addEventListener("click", () => {
      // Light is the default (no attribute). Dark is opt-in via data-theme="dark".
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      const apply = () => {
        if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
        else document.documentElement.removeAttribute("data-theme");
        buildFavicon(); // keep the tab icon's gradient in sync with the theme
        syncThemeColor();
        syncThemeLabel();
        try {
          localStorage.setItem("theme", next);
        } catch (e) {}
      };

      // Circular reveal from the toggle button. Falls back to an instant
      // switch when the View Transitions API is missing or motion is reduced.
      const noMotion =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || noMotion) {
        apply();
        return;
      }

      const r = toggle.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Radius to the farthest viewport corner so the circle always covers everything.
      const radius = Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy)
      );

      // .theme-vt scopes the CSS that mutes the default cross-fade / page-nav
      // animations so they don't fight the clip-path circle.
      document.documentElement.classList.add("theme-vt");
      const vt = document.startViewTransition(apply);
      vt.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${cx}px ${cy}px)`,
                `circle(${radius}px at ${cx}px ${cy}px)`,
              ],
            },
            {
              duration: 420,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {});
      vt.finished.finally(() => document.documentElement.classList.remove("theme-vt"));
    });

    // Résumé button — top of the sidebar's bottom cluster (primary CTA).
    // Created here (not main.js) so it exists on EVERY page's sidebar,
    // including project detail pages, where the site's one real CTA used to
    // silently disappear. On the home page main.js's PDF modal intercepts
    // the data-pdf click; on project pages (no main.js) the link simply
    // opens the PDF in a new tab.
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
      controls.appendChild(resumeBtn);
    }

    // Start/stop the falling petals.
    const fxBtn = document.createElement("button");
    fxBtn.className = "fx-toggle";
    fxBtn.type = "button";
    fxBtn.setAttribute("aria-label", "Toggle sakura petals");
    // Five-petal sakura blossom (petals as overlapping circles around a
    // centre) — reads clearly as a flower at icon size, unlike the previous
    // mirrored-leaf shape which looked more like a feather.
    fxBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<circle cx="12" cy="6.8" r="4"/>' +
      '<circle cx="16.8" cy="10.3" r="4"/>' +
      '<circle cx="15" cy="15.9" r="4"/>' +
      '<circle cx="9" cy="15.9" r="4"/>' +
      '<circle cx="7.2" cy="10.3" r="4"/>' +
      '<circle cx="12" cy="12" r="2.1" opacity=".55"/></svg>';
    toggleRow.appendChild(fxBtn);
    controls.appendChild(toggleRow);

    // Contact links in sidebar
    const contacts = window.CONTACTS || [];
    if (contacts.length) {
      const CONTACT_ICONS = {
        email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6 12 13 2 6"/>',
        linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
        github: '<path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 22 12c0-5.5-4.5-10-10-10z"/>',
      };
      const contactWrap = document.createElement("div");
      contactWrap.className = "sidebar-contact";
      contacts.forEach((c) => {
        const a = document.createElement("a");
        a.href = c.url;
        if (/^https?:/i.test(c.url)) { a.target = "_blank"; a.rel = "noopener"; }
        let iconKey = "";
        if (/mailto:/i.test(c.url)) iconKey = "email";
        else if (/linkedin/i.test(c.url)) iconKey = "linkedin";
        else if (/github/i.test(c.url)) iconKey = "github";
        const iconPath = CONTACT_ICONS[iconKey];
        a.innerHTML = (iconPath
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + iconPath + '</svg>'
          : '') + '<span>' + c.label + '</span>';
        contactWrap.appendChild(a);
      });
      controls.appendChild(contactWrap);
    }

    const syncFx = () => {
      fxBtn.classList.toggle("off", !petalsEnabled);
      fxBtn.setAttribute("aria-pressed", petalsEnabled ? "true" : "false");
    };
    syncFx();
    fxBtn.addEventListener("click", () => {
      petalsEnabled = !petalsEnabled;
      try {
        localStorage.setItem("particles", petalsEnabled ? "on" : "off");
      } catch (e) {}
      syncFx();
      if (petalsEl) petalsEl.classList.toggle("hidden", !petalsEnabled);
    });

  }

  /* Particle canvas + scroll-progress bar removed — petals replace particles,
     and view routing makes a scroll-progress bar irrelevant. */
})();
