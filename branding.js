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
    const g1 = light ? "#7c3aed" : "#a855f7";
    const g2 = light ? "#be185d" : "#ec4899";
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

  // Cursor spotlight that follows the mouse across the nav bar.
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

    // Light/dark toggle (dark is the default).
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
    toggle.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      const apply = () => {
        document.documentElement.setAttribute("data-theme", next);
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
      controls.appendChild(resumeBtn);
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
  }
})();
