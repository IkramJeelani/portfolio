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
    if (navEl && navEl.children.length) {
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

    // Shining particles that drift down the sides now and then, and dodge the cursor.
    const canvas = document.createElement("canvas");
    canvas.className = "particles";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let W = 0;
    let H = 0;
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap for mobile GPU/perf
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = ["#c084fc", "#f472b6", "#a78bfa", "#e9d5ff"];
    const particles = [];
    const mouse = { x: -9999, y: -9999 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    const small = () => W < 700; // phones / narrow: lighter + tighter to the edge

    // Persist particles across navigation so they continue from where they were
    // (smooth when opening a project's detail page) instead of restarting.
    const SAVE_KEY = "ij_particles";
    try {
      const saved = JSON.parse(sessionStorage.getItem(SAVE_KEY) || "null");
      if (saved && Array.isArray(saved.p) && Date.now() - saved.t < 4000) {
        saved.p.forEach((o) => particles.push(o));
      }
    } catch (e) {}
    window.addEventListener("pagehide", () => {
      try {
        sessionStorage.setItem(SAVE_KEY, JSON.stringify({ t: Date.now(), p: particles }));
      } catch (e) {}
    });

    // The side band = the empty margin outside the ~1180px content column,
    // so particles stay clear of the main body.
    const bandFor = (side) => {
      const margin = Math.max(small() ? 22 : 40, (W - 1180) / 2);
      return side === 0 ? [0, margin] : [W - margin, W];
    };

    function spawn() {
      [0, 1].forEach((side) => {
        // both sides together, one particle each
        const [minX, maxX] = bandFor(side);
        particles.push({
          side,
          x: minX + Math.random() * (maxX - minX),
          y: -10 - Math.random() * 40,
          vx: (Math.random() - 0.5) * 0.15,
          vy: 1.0 + Math.random() * 0.9,
          r: 1.2 + Math.random() * 1.6,
          tw: Math.random() * Math.PI * 2,
          color: colors[(Math.random() * colors.length) | 0],
        });
      });
      const cap = small() ? 8 : 16;
      if (particles.length > cap) particles.splice(0, particles.length - cap);
    }

    let nextSpawn = 0;
    let last = performance.now();
    function frame(now) {
      const dt = Math.min(48, now - last);
      last = now;
      if (now >= nextSpawn) {
        spawn();
        nextSpawn = now + (small() ? 2400 + Math.random() * 2200 : 1500 + Math.random() * 1300); // steady, never stops
      }
      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const R = 100;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = ((R - d) / R) * 2.6; // push away from the cursor
          p.vx += (dx / d) * f * (dt / 16);
          p.vy += (dy / d) * f * (dt / 16);
        }
        p.vx *= 0.95;
        p.vy *= 0.98;
        p.vy += 0.03 * (dt / 16); // gentle gravity so they keep falling
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        // keep within the side band so they never drift onto the body
        const [minX, maxX] = bandFor(p.side);
        if (p.x < minX) {
          p.x = minX;
          p.vx = Math.abs(p.vx) * 0.4;
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -Math.abs(p.vx) * 0.4;
        }
        if (p.y > H + 30) {
          particles.splice(i, 1);
          continue;
        }
        const tw = 0.45 + 0.55 * Math.sin(now * 0.005 + p.tw); // twinkle
        ctx.globalAlpha = tw;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = small() ? 6 : 12;
        ctx.shadowColor = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
