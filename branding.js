/* Shared branding: keeps the top-left logo and the browser-tab icon identical,
   and fills in name/role/bio/year from PROFILE. Runs on every page. */
(function () {
  const p = window.PROFILE || {};
  const initials = (p.initials || "").trim();

  const settings = window.SETTINGS || {};

  // Default theme from data.js (only when the visitor hasn't chosen one).
  try {
    if (!localStorage.getItem("theme") && settings.theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch (e) {
    if (settings.theme === "light") document.documentElement.setAttribute("data-theme", "light");
  }

  // Falling particles: default from data.js, overridden by the visitor's choice.
  let particlesEnabled = settings.particles !== false;
  try {
    const sp = localStorage.getItem("particles");
    if (sp !== null) particlesEnabled = sp !== "off";
  } catch (e) {}
  // Set by the particle system below; lets the toggle button play the
  // explode-away / fade-back transition instead of an instant switch.
  let onParticlesToggle = null;

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

    // Centred control group: theme toggle + particles toggle.
    const controls = document.createElement("div");
    controls.className = "header-controls";
    header.appendChild(controls);

    // Light/dark toggle (dark is the default).
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
    controls.appendChild(toggle);
    toggle.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      const apply = () => {
        document.documentElement.setAttribute("data-theme", next);
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

    // Start/stop the falling particles.
    const fxBtn = document.createElement("button");
    fxBtn.className = "fx-toggle";
    fxBtn.type = "button";
    fxBtn.setAttribute("aria-label", "Start or stop the falling particles");
    fxBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6z"/>' +
      '<path d="M18 13l.8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8z"/></svg>';
    controls.appendChild(fxBtn);
    const syncFx = () => fxBtn.classList.toggle("off", !particlesEnabled);
    syncFx();
    fxBtn.addEventListener("click", () => {
      particlesEnabled = !particlesEnabled;
      try {
        localStorage.setItem("particles", particlesEnabled ? "on" : "off");
      } catch (e) {}
      syncFx();
      if (onParticlesToggle) onParticlesToggle(particlesEnabled);
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
      // Use the visible width (excludes the scrollbar) so both edges are symmetric.
      W = document.documentElement.clientWidth || window.innerWidth;
      H = document.documentElement.clientHeight || window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Lighter glow colours on dark mode; deeper, saturated colours so they read on white.
    const colorsDark = ["#c084fc", "#f472b6", "#a78bfa", "#e9d5ff"];
    const colorsLight = ["#7c3aed", "#db2777", "#6d28d9", "#c026d3"];
    const palette = () =>
      document.documentElement.getAttribute("data-theme") === "light" ? colorsLight : colorsDark;
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
          color: palette()[(Math.random() * 4) | 0],
        });
      });
      const cap = small() ? 8 : 16;
      if (particles.length > cap) particles.splice(0, particles.length - cap);
    }

    // Toggling off: spawning stops and each particle bursts into 3–5 tiny
    // fragments that drift apart, slow under drag, shrink and dissolve —
    // each with its own direction, speed, curl, lifetime and fade delay so
    // the burst looks organic. Positions are remembered while off.
    // Toggling on: fragments fly back in and the particles re-form at those
    // same spots, then resume falling exactly as they were.
    let fxMode = particlesEnabled ? "on" : "off";
    let fxT0 = 0;
    let frags = [];
    const RETURN_MS = 520;
    const rand = (a, b) => a + Math.random() * (b - a);

    const burstFrom = (p) => {
      const n = 3 + ((Math.random() * 3) | 0);
      for (let j = 0; j < n; j++) {
        const a = Math.random() * Math.PI * 2;
        const s = rand(1.4, 4.5);
        frags.push({
          // outward burst (explode) starts here and moves by velocity…
          x: p.x,
          y: p.y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - rand(0, 0.8),
          // …while the reverse (return) eases from a scattered start back home
          sx: p.x + Math.cos(a) * rand(26, 72),
          sy: p.y + Math.sin(a) * rand(26, 72),
          tx: p.x,
          ty: p.y,
          r: p.r * rand(0.35, 0.75),
          life: rand(280, 520),
          delay: rand(0, 80),
          drag: rand(0.86, 0.94),
          spin: rand(-0.22, 0.22),
          color: p.color,
        });
      }
    };

    onParticlesToggle = (enabled) => {
      fxT0 = performance.now();
      frags = [];
      if (!enabled) {
        particles.forEach((p) => {
          p.hx = p.x;
          p.hy = p.y;
          burstFrom(p);
        });
        fxMode = "exploding";
      } else {
        particles.forEach((p) => {
          if (p.hx !== undefined) {
            p.x = p.hx;
            p.y = p.hy;
          }
          burstFrom(p);
        });
        fxMode = "returning";
      }
    };

    const drawDot = (x, y, r, color, alpha, light) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.2, r), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = (small() ? 5 : 9) * (light ? 1.5 : 1);
      ctx.shadowColor = color;
      ctx.fill();
    };

    let nextSpawn = 0;
    let last = performance.now();
    function frame(now) {
      const dt = Math.min(48, now - last);
      last = now;
      ctx.clearRect(0, 0, W, H);
      const light = document.documentElement.getAttribute("data-theme") === "light";

      if (fxMode === "off") {
        // Keep the particles in memory (frozen at their saved spots) but draw nothing.
        requestAnimationFrame(frame);
        return;
      }

      if (fxMode === "exploding") {
        let alive = false;
        for (const f of frags) {
          const t = (now - fxT0 - f.delay) / f.life;
          if (t >= 1) continue; // this fragment has fully dissolved
          alive = true;
          const tc = Math.max(0, t); // holds still + opaque until its delay is up
          if (t > 0) {
            // curl the path a little, then bleed speed off with drag
            const c = f.spin * (dt / 16);
            const cos = Math.cos(c);
            const sin = Math.sin(c);
            const nvx = f.vx * cos - f.vy * sin;
            f.vy = f.vx * sin + f.vy * cos;
            f.vx = nvx;
            const d = Math.pow(f.drag, dt / 16);
            f.vx *= d;
            f.vy *= d;
            f.x += f.vx * (dt / 16);
            f.y += f.vy * (dt / 16);
          }
          drawDot(f.x, f.y, f.r * (1 - 0.45 * tc), f.color, 1 - tc, light);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        if (!alive) {
          fxMode = "off";
          particles.forEach((p) => {
            if (p.hx !== undefined) {
              p.x = p.hx;
              p.y = p.hy;
            }
          });
        }
        requestAnimationFrame(frame);
        return;
      }

      if (fxMode === "returning") {
        // Particles fade up at their old spots while their fragments ease
        // back in and hand their brightness over to the re-formed dot.
        const T = Math.min(1, (now - fxT0) / RETURN_MS);
        for (const p of particles) {
          const tw = 0.45 + 0.55 * Math.sin(now * 0.005 + p.tw);
          drawDot(
            p.x,
            p.y,
            p.r * (light ? 1.15 : 1),
            p.color,
            (light ? Math.min(1, tw + 0.25) : tw) * T * T,
            light
          );
        }
        let alive = false;
        for (const f of frags) {
          const t = (now - fxT0 - f.delay) / f.life;
          if (t >= 1) continue;
          alive = true;
          const tc = Math.max(0, t);
          const e = 1 - Math.pow(1 - tc, 3); // decelerate into home
          drawDot(
            f.sx + (f.tx - f.sx) * e,
            f.sy + (f.ty - f.sy) * e,
            f.r * (0.55 + 0.45 * tc),
            f.color,
            1 - tc,
            light
          );
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        if (!alive && T >= 1) fxMode = "on";
        requestAnimationFrame(frame);
        return;
      }

      if (now >= nextSpawn) {
        spawn();
        nextSpawn = now + (small() ? 2400 + Math.random() * 2200 : 1500 + Math.random() * 1300); // steady, never stops
      }
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
        // Boost alpha + glow in light mode so they're as visible as on dark.
        ctx.globalAlpha = light ? Math.min(1, tw + 0.25) : tw;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (light ? 1.15 : 1), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = (small() ? 6 : 12) * (light ? 1.5 : 1);
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
