/* Home page: build the nav + sections dynamically from data.js.
   - Order comes from window.SECTIONS.
   - A section is skipped entirely if it has no content (auto-hide). */
(function () {
  const sectionsRoot = document.getElementById("sections");
  const navRoot = document.getElementById("navLinks");
  if (!sectionsRoot) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Turn a GitHub "blob" PDF link into a same-origin path we can embed in a popup.
  function toEmbed(url) {
    if (!url) return "";
    const m = url.match(/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+\.pdf)$/i);
    if (m) return m[1]; // e.g. "assets/Certifications/CSWA.pdf"
    if (/\.pdf($|\?)/i.test(url)) return url;
    return "";
  }

  /* ---------- Section builders ----------
     Each returns null when empty (so the section is hidden), or an object:
     { title, html, cls?, mount? }. */

  function buildAbout() {
    const text = (window.ABOUT || "").trim();
    if (!text) return null;
    return { title: "About", cls: "about", html: `<p class="about-text reveal">${window.ABOUT}</p>` };
  }

  function buildExperience() {
    const list = window.EXPERIENCE || [];
    if (!list.length) return null;
    const items = list
      .map((e, i) => {
        const points = (e.points || []).map((p) => `<li>${p}</li>`).join("");
        const logo = e.logo
          ? `<img class="tl-logo" src="${e.logo}" alt="${e.company || "company"} logo">`
          : "";
        const tech = (e.tech || []).map((t) => `<span class="tag">${t}</span>`).join("");
        return `
          <div class="tl-left">
            <span class="tl-date">${e.date || ""}</span>
            ${e.location ? `<span class="tl-loc">${e.location}</span>` : ""}
          </div>
          <div class="tl-card reveal" style="--reveal-delay:${i * 70}ms">
            ${logo}
            <div class="tl-role">${e.role || ""}</div>
            ${e.company ? `<div class="tl-company">${e.company}</div>` : ""}
            ${points ? `<ul class="tl-points">${points}</ul>` : ""}
            ${tech ? `<div class="tags tl-tags">${tech}</div>` : ""}
          </div>`;
      })
      .join("");
    return { title: "Experience", cls: "experience", html: `<div class="timeline">${items}</div>` };
  }

  function buildProjects() {
    const list = window.PROJECTS || [];
    if (!list.length) return null;
    const cards = list
      .map((p, i) => {
        const tech = (p.tech || []).map((t) => `<span class="tag">${t}</span>`).join("");
        return `
          <a class="card reveal" style="--reveal-delay:${i * 70}ms" href="project.html?id=${encodeURIComponent(p.id)}" aria-label="View details — ${p.title || ""}">
            <div class="card-img" style="background-image:url('${p.image}')"></div>
            <div class="card-body">
              <div class="card-main">
                <h3 class="card-title">${p.title}</h3>
                ${p.date ? `<p class="card-date">${p.date}</p>` : ""}
                <p class="card-tagline">${p.tagline || ""}</p>
              </div>
              <div class="card-foot">
                ${tech ? `<div class="tags">${tech}</div>` : ""}
                <span class="card-cta">View details &rarr;</span>
              </div>
            </div>
          </a>`;
      })
      .join("");
    return { title: "Projects", cls: "projects", html: `<div class="card-grid">${cards}</div>` };
  }

  function buildSkills() {
    const list = window.SKILLS || [];
    if (!list.length) return null;
    const groups = list
      .map((g) => {
        const tags = (g.items || []).map((i) => `<span class="tag">${i}</span>`).join("");
        return `<div class="skill-group reveal"><h3 class="skill-category">${g.category}</h3><div class="tags">${tags}</div></div>`;
      })
      .join("");
    return { title: "Skills", cls: "skills", html: `<div class="skills-list">${groups}</div>` };
  }

  function buildCertifications() {
    const list = window.CERTIFICATIONS || [];
    if (!list.length) return null;
    const cards = list
      .map((c, i) => {
        const delay = `--reveal-delay:${i * 70}ms`;
        const meta = [c.issuer, c.date].filter(Boolean).join(" · ");
        const logo = c.logo
          ? `<img class="cert-logo" src="${c.logo}" alt="${c.issuer || c.name || "logo"}">`
          : `<div class="cert-logo" aria-hidden="true"></div>`;
        const inner = `
          ${logo}
          <div class="cert-text">
            <span class="cert-name">${c.name || ""}</span>
            <div class="cert-foot">
              ${meta ? `<span class="cert-meta">${meta}</span>` : ""}
              ${c.url ? `<span class="cert-cta">View Credential &rarr;</span>` : ""}
            </div>
          </div>`;
        const embed = toEmbed(c.url);
        const pdfAttr = embed ? ` data-pdf="${embed}"` : "";
        // aria-label gives screen readers one clean, purposeful name for the
        // whole card ("View credential — X") instead of reading every piece
        // of visible text (logo alt, name, issuer, date, "View Credential")
        // concatenated together as the link's accessible name.
        return c.url
          ? `<a class="cert-card reveal" style="${delay}" href="${c.url}"${pdfAttr} target="_blank" rel="noopener" aria-label="View credential — ${c.name || ""}">${inner}</a>`
          : `<div class="cert-card reveal" style="${delay}">${inner}</div>`;
      })
      .join("");
    return { title: "Certifications", cls: "certifications", html: `<div class="card-grid">${cards}</div>` };
  }

  function buildEducation() {
    const list = window.EDUCATION || [];
    if (!list.length) return null;
    const items = list
      .map((e, i) => {
        const logo = e.logo
          ? `<img class="edu-logo" src="${e.logo}" alt="${e.school || "university"} logo">`
          : `<div class="edu-logo" aria-hidden="true"></div>`;
        const degreeLine = e.degree ? `<div class="edu-degree">${e.degree}</div>` : "";
        const majorLine = e.major ? `<div class="edu-major">${e.major}</div>` : "";
        let details = "";
        if (Array.isArray(e.details)) {
          const li = e.details.filter(Boolean).map((d) => `<li>${d}</li>`).join("");
          if (li) details = `<ul class="edu-points">${li}</ul>`;
        } else if (e.details) {
          details = `<p class="edu-details">${e.details}</p>`;
        }
        return `
          <div class="edu-left">
            <span class="edu-date">${e.date || ""}</span>
            ${e.location ? `<span class="edu-loc">${e.location}</span>` : ""}
          </div>
          <div class="edu-card reveal" style="--reveal-delay:${i * 70}ms">
            ${logo}
            <div class="edu-school">${e.school || ""}</div>
            ${degreeLine}
            ${majorLine}
            ${details}
          </div>`;
      })
      .join("");
    return { title: "Education", cls: "education", html: `<div class="edu-timeline">${items}</div>` };
  }

  function buildContact() {
    const list = window.CONTACTS || [];
    if (!list.length) return null;
    const links = list
      .map((c) => {
        const ext = /^https?:/i.test(c.url) ? ` target="_blank" rel="noopener"` : "";
        return `<a class="btn" href="${c.url}"${ext}>${c.label}</a>`;
      })
      .join("");
    return {
      title: "Contact",
      cls: "contact",
      html: `<p class="contact-intro reveal">Interested in working together or want to know more? Get in touch.</p>
             <div class="contact-links reveal">${links}</div>`,
    };
  }

  const BUILDERS = {
    about: buildAbout,
    experience: buildExperience,
    projects: buildProjects,
    skills: buildSkills,
    certifications: buildCertifications,
    education: buildEducation,
    contact: buildContact,
  };

  /* ---------- Render in the configured order, skipping empty sections ---------- */
  const order = window.SECTIONS || Object.keys(BUILDERS);

  order.forEach((key) => {
    const builder = BUILDERS[key];
    if (!builder) return;
    const sec = builder();
    if (!sec) return; // no content -> auto-hidden

    const el = document.createElement("section");
    el.id = key;
    el.className = "section" + (sec.cls ? " " + sec.cls : "");
    el.innerHTML = `<h2 class="section-title reveal">${sec.title}</h2>${sec.html}`;
    sectionsRoot.appendChild(el);

    const link = document.createElement("a");
    link.href = "#" + key;
    link.textContent = sec.title;
    navRoot.appendChild(link);
  });

  setupReveal();
  setupTilt();
  setupSectionFlash();
  setupEqualize();
  setupTimelineWidth();
  setupPdfModal();
  setupResumeButton();
  setupSharedTransition();
  setupHeroArm();
  setupSkillsMasonry();

  /* ---------- Experience + Education: one shared card width ----------
     Each timeline is its own grid, so their card columns size independently
     (Experience might be wider than Education, or vice-versa). Measure the
     widest card across BOTH sections and pin every card to that width so the
     two sections line up. Cleared below the mobile breakpoint, where cards
     are meant to fill the row fluidly. */
  function setupTimelineWidth() {
    const cards = Array.from(document.querySelectorAll(".tl-card, .edu-card"));
    if (cards.length < 2) return;
    const apply = () => {
      cards.forEach((c) => (c.style.width = ""));
      if (window.innerWidth <= 640) return; // fluid on phones
      let max = 0;
      cards.forEach((c) => (max = Math.max(max, c.offsetWidth)));
      cards.forEach((c) => (c.style.width = max + "px"));
    };
    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("load", apply);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);
  }

  /* ---------- Skills: balanced masonry ----------
     CSS columns can only split between categories in source order, which
     leaves one column hanging long (e.g. a short "Tools" dangling at the
     bottom). Instead, measure each category and deal them into flex columns
     shortest-first — the columns always end nearly level, whatever the
     content in data.js grows into. */
  function setupSkillsMasonry() {
    const wrap = document.querySelector(".skills-list");
    if (!wrap) return;
    const groups = Array.from(wrap.querySelectorAll(".skill-group"));
    if (!groups.length) return;
    const GAP = 36; // keep in sync with the CSS column gap
    const COLW = 190;

    const layout = () => {
      const w = wrap.clientWidth || 640;
      const n = Math.max(1, Math.floor((w + GAP) / (COLW + GAP)));
      wrap.innerHTML = "";
      const cols = [];
      for (let i = 0; i < n; i++) {
        const c = document.createElement("div");
        c.className = "skill-col";
        wrap.appendChild(c);
        cols.push(c);
      }
      // Park everything in the first column to measure at real column width…
      groups.forEach((g) => cols[0].appendChild(g));
      if (n === 1) return;
      const hs = groups.map((g) => g.offsetHeight);
      // …then deal each category (in order) onto the currently shortest column.
      const tot = cols.map(() => 0);
      groups.forEach((g, i) => {
        let k = 0;
        for (let j = 1; j < n; j++) if (tot[j] < tot[k] - 1) k = j;
        cols[k].appendChild(g);
        tot[k] += hs[i];
      });
    };

    layout();
    window.addEventListener("load", layout);
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(layout, 150);
    });
  }

  /* ---------- Hero: 3-link robotic arm with servo physics + pick-and-place ----------
     The IK solver produces DESIRED joint angles; each joint then behaves like
     a real servo — PD control with acceleration and velocity limits — so the
     arm has genuine inertia: it winds up, follows through, and settles.
     Idle: glides through poses. Hover in its box: tracks the cursor.
     Click in its box: drops a part that the arm picks and places in the bin. */
  function setupHeroArm() {
    const canvas = document.querySelector(".hero-arm");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 520;
    const H = 450;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const base = { x: W * 0.54, y: H * 0.87 };
    const L = [148, 116, 82];
    const ang = [-1.9, -1.1, -0.4]; // actual link angles (absolute, for drawing/FK)
    const desired = ang.slice(); //   IK solution the servos chase
    // True joint state lives in RELATIVE coordinates (shoulder abs, elbow rel,
    // wrist rel) so servo errors are plain differences — a joint always travels
    // through its allowed range, never "the short way" through a hard stop.
    const q = [-1.9, 0.8, 0.7];
    const vel = [0, 0, 0]; //         joint angular velocities (rad/s)
    const MAXV = 3.0; //              velocity limit, rad/s
    const MAXA = 9; //                acceleration limit, rad/s^2
    // Mechanical joint limits, like real hard stops: the shoulder can never
    // aim below the horizon, and the elbow/wrist can't fold back on themselves —
    // no more impossible zig-zag poses.
    const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));
    const LIM1 = [-2.7, -0.45]; //  shoulder (absolute angle; never lies flat)
    const LIM2 = [-2.25, 2.25]; //  elbow (relative to shoulder)
    const LIM3 = [-1.75, 1.75]; //  wrist (relative to forearm)
    // `hit[i]` reports which joints actually slammed a stop (used to bleed
    // servo velocity) — the rebuild itself has float drift, so comparing
    // angles before/after would false-positive every frame.
    const applyLimits = (a, hit) => {
      const w0 = wrapPi(a[0]);
      const c0 = Math.min(LIM1[1], Math.max(LIM1[0], w0));
      if (hit && c0 !== w0) hit[0] = true;
      a[0] = c0;
      let r = wrapPi(a[1] - a[0]);
      let rc = Math.min(LIM2[1], Math.max(LIM2[0], r));
      if (hit && rc !== r) hit[1] = true;
      a[1] = a[0] + rc;
      r = wrapPi(a[2] - a[1]);
      rc = Math.min(LIM3[1], Math.max(LIM3[0], r));
      if (hit && rc !== r) hit[2] = true;
      a[2] = a[1] + rc;
    };
    const maxR = L[0] + L[1] + L[2] - 8;
    const floorY = base.y;
    const bin = { x: 58, y: floorY - 6, w: 66, h: 30 };

    const fk = (a) => {
      const pts = [{ x: base.x, y: base.y }];
      for (let i = 0; i < 3; i++) {
        const p = pts[i];
        pts.push({ x: p.x + Math.cos(a[i]) * L[i], y: p.y + Math.sin(a[i]) * L[i] });
      }
      return pts;
    };
    const jointPts = () => fk(ang);

    // Damped CCD writes into `a` (used on the desired-angle shadow copy).
    const solveIK = (a, tx, ty) => {
      for (let pass = 0; pass < 4; pass++) {
        for (let i = 2; i >= 0; i--) {
          const pts = fk(a);
          const j = pts[i];
          const tip = pts[3];
          let d = Math.atan2(ty - j.y, tx - j.x) - Math.atan2(tip.y - j.y, tip.x - j.x);
          d = Math.atan2(Math.sin(d), Math.cos(d)) * 0.5;
          for (let k = i; k < 3; k++) a[k] += d;
        }
        applyLimits(a); // limits enforced per pass so CCD can still converge
      }
      // Keep the elbow from actually punching through the work surface.
      for (let n = 0; n < 16; n++) {
        const pts = fk(a);
        if (pts[2].y <= floorY - 2) break;
        a[1] += wrapPi(-Math.PI / 2 - a[1]) > 0 ? 0.03 : -0.03;
        applyLimits(a);
      }
    };

    const tipErr = (a, tx, ty) => {
      const t = fk(a)[3];
      return Math.hypot(t.x - tx, t.y - ty);
    };

    const clampReach = (x, y) => {
      const dx = x - base.x;
      const dy = y - base.y;
      const d = Math.hypot(dx, dy) || 1;
      // Outer limit = arm length; inner limit keeps targets out of the
      // cramped zone right at the base where only extreme folds reach.
      const r = Math.min(Math.max(d, 70), maxR);
      let cx = base.x + (dx / d) * r;
      let cy = base.y + (dy / d) * r;
      if (cy > floorY - 10) cy = floorY - 10;
      return { x: cx, y: cy };
    };

    /* --- pick-and-place state --- */
    const parts = [];
    let job = null; // { part, phase: 'reach' | 'carry' }
    let placed = 0;
    let grip = 0.55;
    const target = { x: base.x + 120, y: base.y - 230 };
    const goal = { x: target.x, y: target.y };
    let mouseIn = false;
    let stall = 0; // seconds the IK solver has been unable to reach the target
    let recoverUntil = 0; // while set, the solver pauses so the arm can unfold

    const colors = () => {
      const light = document.documentElement.getAttribute("data-theme") === "light";
      return {
        grid: light ? "rgba(109, 40, 217, 0.10)" : "rgba(168, 85, 247, 0.09)",
        arc: light ? "rgba(109, 40, 217, 0.18)" : "rgba(168, 85, 247, 0.16)",
        link: light ? "#6d28d9" : "#a855f7",
        link2: light ? "#be185d" : "#ec4899",
        slot: light ? "rgba(27, 24, 48, 0.20)" : "rgba(8, 6, 16, 0.38)",
        jointHi: light ? "#ffffff" : "#3d3560",
        jointLo: light ? "#d9d4ea" : "#141020",
        bolt: light ? "#8b84a8" : "#0d0a18",
        tip: light ? "#be185d" : "#f472b6",
        hud: light ? "rgba(92, 88, 111, 0.75)" : "rgba(163, 157, 181, 0.7)",
        trail: light ? "190, 24, 93" : "244, 114, 182",
        glow: light ? 9 : 14,
        light,
      };
    };
    let c = colors();

    const drawLink = (a, b, w1, w2, colEnd) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, c.link);
      g.addColorStop(1, colEnd || c.link);
      ctx.fillStyle = g;
      ctx.shadowBlur = c.glow;
      ctx.shadowColor = colEnd || c.link;
      ctx.beginPath();
      ctx.moveTo(a.x + nx * w1, a.y + ny * w1);
      ctx.lineTo(b.x + nx * w2, b.y + ny * w2);
      ctx.lineTo(b.x - nx * w2, b.y - ny * w2);
      ctx.lineTo(a.x - nx * w1, a.y - ny * w1);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = c.slot;
      ctx.lineWidth = Math.min(w1, w2) * 0.75;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(a.x + dx * 0.24, a.y + dy * 0.24);
      ctx.lineTo(a.x + dx * 0.8, a.y + dy * 0.8);
      ctx.stroke();
    };

    const drawJoint = (p, r, a) => {
      const rg = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, r * 0.15, p.x, p.y, r);
      rg.addColorStop(0, c.jointHi);
      rg.addColorStop(1, c.jointLo);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = rg;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = c.link;
      ctx.stroke();
      for (let k = 0; k < 4; k++) {
        const ba = a + (k * Math.PI) / 2;
        ctx.beginPath();
        ctx.arc(p.x + Math.cos(ba) * r * 0.58, p.y + Math.sin(ba) * r * 0.58, r * 0.14, 0, Math.PI * 2);
        ctx.fillStyle = c.bolt;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = c.link2;
      ctx.fill();
    };

    const drawGripper = (tip, a, open) => {
      ctx.strokeStyle = c.link2;
      ctx.lineWidth = 3.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      [1, -1].forEach((s) => {
        const spread = 0.34 + open * 0.5;
        const a1 = a + s * spread;
        const k1 = { x: tip.x + Math.cos(a1) * 9, y: tip.y + Math.sin(a1) * 9 };
        const a2 = a + s * spread * 0.22;
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(k1.x, k1.y);
        ctx.lineTo(k1.x + Math.cos(a2) * 12, k1.y + Math.sin(a2) * 12);
        ctx.stroke();
      });
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = c.tip;
      ctx.shadowBlur = 12;
      ctx.shadowColor = c.tip;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawPart = (p, alpha) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.tone;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.tone;
      ctx.fillRect(-7, -7, 14, 14);
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = c.light ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-4, -4, 8, 8);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const trail = [];

    const drawFrame = () => {
      c = colors();
      ctx.clearRect(0, 0, W, H);

      // Blueprint grid, reach envelope, work surface.
      ctx.strokeStyle = c.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let g = 40; g < W; g += 40) {
        ctx.moveTo(g, 0);
        ctx.lineTo(g, H);
      }
      for (let g = 40; g < H; g += 40) {
        ctx.moveTo(0, g);
        ctx.lineTo(W, g);
      }
      ctx.stroke();
      ctx.setLineDash([5, 7]);
      ctx.strokeStyle = c.arc;
      ctx.beginPath();
      ctx.arc(base.x, base.y, maxR, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = c.arc;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(16, floorY + 12);
      ctx.lineTo(W - 16, floorY + 12);
      ctx.stroke();

      // OUT bin (label above so nothing overlaps it).
      ctx.strokeStyle = c.link;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2;
      ctx.strokeRect(bin.x, bin.y - bin.h, bin.w, bin.h);
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = c.link;
      ctx.fillRect(bin.x, bin.y - bin.h, bin.w, bin.h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.hud;
      ctx.font = "500 10px Consolas, 'Courier New', monospace";
      ctx.fillText("OUT", bin.x + bin.w / 2 - 10, bin.y - bin.h - 6);

      // Fading light trail behind the tip.
      if (trail.length > 1) {
        ctx.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          const a = (i / trail.length) * 0.45;
          ctx.strokeStyle = "rgba(" + c.trail + "," + a.toFixed(3) + ")";
          ctx.lineWidth = 1 + (i / trail.length) * 2.2;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
      }

      parts.forEach((p) => {
        if (p.state === "held") return;
        drawPart(p, p.state === "binned" ? p.fade : 1);
      });

      const pts = jointPts();
      const tip = pts[3];

      // Tip shadow on the work surface.
      const hgt = Math.max(0, floorY - tip.y);
      const sa = Math.max(0, 0.16 - hgt / 2200);
      if (sa > 0.02) {
        ctx.beginPath();
        ctx.ellipse(tip.x, floorY + 10, 16 + hgt * 0.05, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0," + sa.toFixed(3) + ")";
        ctx.fill();
      }

      // Base pedestal.
      ctx.fillStyle = c.link;
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.moveTo(base.x - 34, base.y + 12);
      ctx.lineTo(base.x - 22, base.y - 8);
      ctx.lineTo(base.x + 22, base.y - 8);
      ctx.lineTo(base.x + 34, base.y + 12);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.fillRect(base.x - 52, base.y + 10, 104, 5);
      ctx.globalAlpha = 1;

      drawLink(pts[0], pts[1], 11, 8.5);
      drawLink(pts[1], pts[2], 8.5, 6.5);
      drawLink(pts[2], pts[3], 6, 4, c.link2);
      drawJoint(pts[0], 12, ang[0]);
      drawJoint(pts[1], 8.5, ang[1]);
      drawJoint(pts[2], 6.5, ang[2]);

      const held = parts.find((p) => p.state === "held");
      if (held) {
        held.x = tip.x + Math.cos(ang[2]) * 9;
        held.y = tip.y + Math.sin(ang[2]) * 9;
        held.rot = ang[2];
        drawPart(held, 1);
      }
      drawGripper(tip, ang[2], grip);

      // HUD: top-left so it never collides with the bin or the arm.
      ctx.fillStyle = c.hud;
      ctx.font = "500 12px Consolas, 'Courier New', monospace";
      const deg = (r) => {
        let v = ((r * 180) / Math.PI) % 360;
        if (v < -180) v += 360;
        if (v > 180) v -= 360;
        return (v >= 0 ? " " : "") + v.toFixed(1) + "°";
      };
      ctx.fillText("θ1 " + deg(ang[0]), 16, 24);
      ctx.fillText("θ2 " + deg(ang[1] - ang[0]), 16, 42);
      ctx.fillText("θ3 " + deg(ang[2] - ang[1]), 16, 60);
      ctx.fillText("PLACED " + placed, 16, 82);
      ctx.font = "500 10px Consolas, 'Courier New', monospace";
      ctx.fillText("click to drop a part", W - 126, H - 12);
    };

    if (reduced) {
      solveIK(desired, base.x + 130, base.y - 235);
      for (let i = 0; i < 3; i++) ang[i] = desired[i];
      drawFrame();
      return;
    }

    const armBox = canvas.closest(".hero-visual") || canvas;
    const toCanvas = (e) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return null;
      const k = W / r.width;
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    };
    // Remember where the cursor is so the arm can come back to it on its own
    // after finishing a pick-and-place job (no mouse move needed).
    const cursor = { x: 0, y: 0 };
    armBox.addEventListener("pointermove", (e) => {
      const p = toCanvas(e);
      if (!p) return;
      cursor.x = p.x;
      cursor.y = p.y;
      mouseIn = true;
    });
    armBox.addEventListener("pointerleave", () => (mouseIn = false));
    armBox.style.cursor = "crosshair";

    // A deliberate click/tap (not a scroll gesture or drag) drops a part.
    armBox.addEventListener("click", (e) => {
      const p = toCanvas(e);
      if (!p) return;
      if (parts.filter((q) => q.state !== "binned").length >= 1) return; // one part at a time
      // Keep drops clear of the bin AND of the cramped zone at the base.
      let px = Math.min(W - 36, Math.max(bin.x + bin.w + 46, p.x));
      if (Math.abs(px - base.x) < 85) px = px < base.x ? base.x - 85 : base.x + 85;
      parts.push({
        x: px,
        y: Math.min(floorY - 90, Math.max(36, p.y)),
        vy: 0,
        rot: (Math.random() - 0.5) * 0.8,
        state: "fall",
        fade: 1,
        tone: Math.random() < 0.5 ? c.link : c.link2,
      });
    });

    let running = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((en) => (running = en[0].isIntersecting), { threshold: 0.05 }).observe(canvas);
    }

    let last = performance.now();
    const frame = (now) => {
      const dts = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (running) {
        // Part physics: gravity, bounce, settle.
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          if (p.state === "fall") {
            p.vy += 30 * dts;
            p.y += p.vy * 60 * dts;
            if (p.y >= floorY - 8) {
              p.y = floorY - 8;
              if (p.vy > 2.4) p.vy *= -0.3;
              else {
                p.vy = 0;
                p.state = "rest";
              }
            }
          } else if (p.state === "binned") {
            p.fade -= 1.2 * dts;
            if (p.fade <= 0) parts.splice(i, 1);
          }
        }

        if (!job) {
          const next = parts.find((p) => p.state === "rest");
          if (next) job = { part: next, phase: "reach", t0: now };
        }

        // Goal priority: job > cursor > idle sweep.
        let gripGoal = 0.55;
        if (job) {
          const p = job.part;
          if (job.phase === "reach") {
            goal.x = p.x;
            goal.y = p.y - 4;
            const tip = jointPts()[3];
            const d = Math.hypot(tip.x - p.x, tip.y - p.y);
            gripGoal = d < 70 ? 1 : 0.55;
            // Grab tolerance grows the longer the approach takes, so an
            // awkward corner pose can never soft-lock the arm.
            const tol = 20 + Math.min(26, ((now - job.t0) / 1000) * 7);
            if (d < tol) {
              p.state = "held";
              job.phase = "carry";
              job.t0 = now;
            }
          } else {
            const bx = bin.x + bin.w / 2;
            const by = bin.y - bin.h - 16;
            goal.x = bx;
            goal.y = by;
            gripGoal = 0.12;
            const tip = jointPts()[3];
            const tol = 18 + Math.min(26, ((now - job.t0) / 1000) * 7);
            if (Math.hypot(tip.x - bx, tip.y - by) < tol) {
              const p2 = job.part;
              p2.state = "binned";
              p2.x = bx;
              p2.y = bin.y - 12;
              p2.rot = 0;
              placed++;
              job = null;
              gripGoal = 1;
            }
          }
        } else if (mouseIn) {
          // No job: head straight back to the cursor, wherever it's resting.
          goal.x = cursor.x;
          goal.y = cursor.y;
        } else {
          const t = now * 0.00032;
          goal.x = base.x + Math.cos(t * 1.3) * 165 + Math.sin(t * 2.1) * 45;
          goal.y = base.y - 195 + Math.sin(t * 1.7) * 80;
        }
        grip += (gripGoal - grip) * Math.min(1, 8 * dts);

        // IK -> desired angles; servos chase them under physics limits.
        const g = clampReach(goal.x, goal.y);
        target.x += (g.x - target.x) * Math.min(1, 7 * dts);
        target.y += (g.y - target.y) * Math.min(1, 7 * dts);
        if (now >= recoverUntil) {
          solveIK(desired, target.x, target.y);
          // CCD is greedy: it can wedge into one elbow-fold family when the
          // target needs the mirrored one. If the solution is off, also solve
          // the mirror configuration and adopt it when it's clearly better.
          const e1 = tipErr(desired, target.x, target.y);
          if (e1 > 12) {
            const alt = [desired[0], 0, 0];
            alt[1] = alt[0] - wrapPi(desired[1] - desired[0]); // flip elbow fold
            alt[2] = alt[1] - wrapPi(desired[2] - desired[1]); // flip wrist fold
            applyLimits(alt);
            solveIK(alt, target.x, target.y);
            if (tipErr(alt, target.x, target.y) < e1 - 8) {
              desired[0] = alt[0];
              desired[1] = alt[1];
              desired[2] = alt[2];
            }
          }
          // Last-resort stall net: command home and pause solving so the arm
          // fully unfolds before trying again.
          if (tipErr(desired, target.x, target.y) > 30) {
            stall += dts;
            if (stall > 1.1) {
              desired[0] = -1.8;
              desired[1] = -1.0;
              desired[2] = -0.35;
              stall = 0;
              recoverUntil = now + 650;
            }
          } else {
            stall = 0;
          }
        }
        // IK solution → relative joint commands (each already limit-clamped).
        const dq = [
          Math.min(LIM1[1], Math.max(LIM1[0], wrapPi(desired[0]))),
          Math.min(LIM2[1], Math.max(LIM2[0], wrapPi(desired[1] - desired[0]))),
          Math.min(LIM3[1], Math.max(LIM3[0], wrapPi(desired[2] - desired[1]))),
        ];
        const LIMS = [LIM1, LIM2, LIM3];
        for (let i = 0; i < 3; i++) {
          const err = dq[i] - q[i]; // plain difference: no wrap through a stop
          let acc = 60 * err - 9 * vel[i];
          if (acc > MAXA) acc = MAXA;
          else if (acc < -MAXA) acc = -MAXA;
          vel[i] += acc * dts;
          if (vel[i] > MAXV) vel[i] = MAXV;
          else if (vel[i] < -MAXV) vel[i] = -MAXV;
          q[i] += vel[i] * dts;
          // Hard stop: clamp and bleed velocity, like real hardware.
          if (q[i] < LIMS[i][0]) {
            q[i] = LIMS[i][0];
            vel[i] *= 0.25;
          } else if (q[i] > LIMS[i][1]) {
            q[i] = LIMS[i][1];
            vel[i] *= 0.25;
          }
        }
        ang[0] = q[0];
        ang[1] = q[0] + q[1];
        ang[2] = ang[1] + q[2];

        const tip = jointPts()[3];
        trail.push({ x: tip.x, y: tip.y });
        if (trail.length > 36) trail.shift();
        drawFrame();
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Scroll-reveal (subtle fade/slide-up) ---------- */
  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Shared-element page transition (card image <-> detail hero) ---------- */
  function setupSharedTransition() {
    const projSec = document.getElementById("projects");
    if (!projSec) return;
    const cardFor = (id) => projSec.querySelector(`a.card[href$="id=${id}"]`);

    // Returning from a project (from any depth): tag the card so the hero morphs back
    // into it, and restore the exact scroll position instead of jumping to the top.
    try {
      const last = sessionStorage.getItem("lastProject");
      if (last) {
        const img = cardFor(last) && cardFor(last).querySelector(".card-img");
        if (img) img.style.viewTransitionName = "project-hero";
      }
      if (sessionStorage.getItem("returnToProjects")) {
        sessionStorage.removeItem("returnToProjects");
        const y = parseInt(sessionStorage.getItem("indexScroll") || "", 10);
        if (!isNaN(y)) {
          const root = document.documentElement;
          const prev = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto"; // instant, no slide
          window.scrollTo(0, y);
          root.style.scrollBehavior = prev;
        }
      }
    } catch (e) {}

    // Opening a project: remember scroll + tag the clicked card's image before navigating.
    projSec.addEventListener("click", (e) => {
      const card = e.target.closest("a.card");
      if (!card) return;
      const m = (card.getAttribute("href") || "").match(/id=([^&]+)/);
      try {
        if (m) sessionStorage.setItem("lastProject", m[1]);
        sessionStorage.setItem("indexScroll", String(window.scrollY));
      } catch (e2) {}
      projSec.querySelectorAll(".card-img").forEach((im) => (im.style.viewTransitionName = ""));
      const img = card.querySelector(".card-img");
      if (img) img.style.viewTransitionName = "project-hero";
    });
  }

  /* ---------- PDF popup (View Credential opens the certificate in a modal) ----------
     Renders the PDF with pdf.js into theme-styled canvases (custom toolbar with
     zoom / download / open-in-tab) instead of the browser's grey default viewer.
     Falls back to a plain iframe if the pdf.js CDN can't be reached. */
  function setupPdfModal() {
    const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174";
    let modal, pdfDoc, libPromise;
    let zoom = 1;
    let curSrc = "";

    const loadLib = () => {
      if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
      if (!libPromise) {
        libPromise = new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = PDFJS_CDN + "/pdf.min.js";
          s.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDN + "/pdf.worker.min.js";
            resolve(window.pdfjsLib);
          };
          s.onerror = () => reject(new Error("pdf.js failed to load"));
          document.head.appendChild(s);
        });
      }
      return libPromise;
    };

    const icoDownload =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>';
    const icoNewTab =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M14 4h6v6M20 4L10 14M9 5H5v14h14v-4"/></svg>';

    const build = () => {
      modal = document.createElement("div");
      modal.className = "pdf-modal";
      modal.innerHTML =
        '<div class="pdf-backdrop"></div>' +
        '<div class="pdf-box">' +
        '<div class="pdf-toolbar">' +
        '<span class="pdf-title"></span>' +
        '<div class="pdf-tools">' +
        '<button class="pdf-tool-btn pdf-zoom-out" aria-label="Zoom out">&minus;</button>' +
        '<span class="pdf-zoom-label">100%</span>' +
        '<button class="pdf-tool-btn pdf-zoom-in" aria-label="Zoom in">+</button>' +
        '<a class="pdf-tool-btn pdf-download" aria-label="Download" download>' + icoDownload + "</a>" +
        '<a class="pdf-tool-btn pdf-newtab" aria-label="Open in new tab" target="_blank" rel="noopener">' + icoNewTab + "</a>" +
        '<button class="pdf-tool-btn pdf-close" aria-label="Close">&times;</button>' +
        "</div></div>" +
        '<div class="pdf-pages"></div></div>';
      document.body.appendChild(modal);
      modal.querySelector(".pdf-backdrop").addEventListener("click", close);
      modal.querySelector(".pdf-close").addEventListener("click", close);
      modal.querySelector(".pdf-zoom-in").addEventListener("click", () => setZoom(zoom + 0.25));
      modal.querySelector(".pdf-zoom-out").addEventListener("click", () => setZoom(zoom - 0.25));
    };

    const setZoom = (z) => {
      zoom = Math.min(3, Math.max(0.5, z));
      modal.querySelector(".pdf-zoom-label").textContent = Math.round(zoom * 100) + "%";
      if (pdfDoc) renderPages();
    };

    async function renderPages() {
      const box = modal.querySelector(".pdf-pages");
      const doc = pdfDoc;
      box.classList.remove("fallback");
      box.innerHTML = "";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (let n = 1; n <= doc.numPages; n++) {
        if (doc !== pdfDoc) return; // a newer document replaced this one mid-render
        const page = await doc.getPage(n);
        const vp1 = page.getViewport({ scale: 1 });
        const fit = (box.clientWidth - 44) / vp1.width; // fit page to the modal width
        const vp = page.getViewport({ scale: fit * zoom * dpr });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        canvas.style.width = vp.width / dpr + "px";
        canvas.style.height = vp.height / dpr + "px";
        box.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
      }
    }

    async function open(src, title) {
      if (!modal) build();
      modal.querySelector(".pdf-title").textContent = title || "Certificate";
      modal.querySelector(".pdf-download").href = src;
      modal.querySelector(".pdf-newtab").href = src;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      const box = modal.querySelector(".pdf-pages");
      box.classList.remove("fallback");
      box.innerHTML = '<div class="pdf-spinner" aria-label="Loading"></div>';
      zoom = 1;
      modal.querySelector(".pdf-zoom-label").textContent = "100%";
      try {
        const lib = await loadLib();
        if (curSrc !== src || !pdfDoc) {
          if (pdfDoc) pdfDoc.destroy();
          pdfDoc = await lib.getDocument(src).promise;
          curSrc = src;
        }
        await renderPages();
      } catch (err) {
        // CDN blocked or the PDF failed to parse — browser's viewer still works.
        box.classList.add("fallback");
        box.innerHTML = '<iframe title="Certificate" src="' + src + '"></iframe>';
      }
    }

    function close() {
      if (!modal) return;
      modal.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => {
        if (pdfDoc) pdfDoc.destroy();
        pdfDoc = null;
        curSrc = "";
        modal.querySelector(".pdf-pages").innerHTML = "";
      }, 250);
    }

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-pdf]");
      if (!link) return;
      e.preventDefault();
      // Explicit data-pdf-title (used by the résumé button) wins; certification
      // cards fall back to their own .cert-name text.
      const name = link.querySelector(".cert-name");
      const title = link.getAttribute("data-pdf-title") || (name ? name.textContent.trim() : "");
      open(link.getAttribute("data-pdf"), title);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Résumé / CV button ----------
     One button under the name on the hero, a second compact one that fades
     into the nav (between the theme and particles toggles) once the hero
     button scrolls out of view. Both open the same in-page PDF viewer used
     for certifications. Controlled entirely by RESUME in data.js. */
  function setupResumeButton() {
    const RESUME = window.RESUME;
    if (!RESUME || !RESUME.show || !RESUME.url) return;

    const embed = toEmbed(RESUME.url);
    const pdfAttr = embed ? ` data-pdf="${embed}"` : "";
    const title = ((window.PROFILE || {}).name || "") + " — Résumé";

    const icon =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>';

    const heroText = document.querySelector(".hero-text");
    let heroBtn = null;
    if (heroText) {
      heroBtn = document.createElement("a");
      heroBtn.className = "resume-btn";
      heroBtn.href = RESUME.url;
      heroBtn.target = "_blank";
      heroBtn.rel = "noopener";
      heroBtn.setAttribute("data-pdf-title", title);
      heroBtn.setAttribute("aria-label", "Download résumé");
      heroBtn.innerHTML = icon + "<span>Download CV</span>";
      if (embed) heroBtn.setAttribute("data-pdf", embed);
      heroText.appendChild(heroBtn);
    }

    const themeToggle = document.querySelector(".theme-toggle");
    let navBtn = null;
    if (themeToggle) {
      navBtn = document.createElement("a");
      navBtn.className = "nav-resume-btn";
      navBtn.href = RESUME.url;
      navBtn.target = "_blank";
      navBtn.rel = "noopener";
      navBtn.setAttribute("data-pdf-title", title);
      navBtn.setAttribute("aria-label", "Download résumé");
      navBtn.innerHTML = icon;
      if (embed) navBtn.setAttribute("data-pdf", embed);
      themeToggle.insertAdjacentElement("afterend", navBtn); // between the two toggles
    }

    // The nav button only appears once the hero button is no longer visible
    // (scrolled under the sticky header) — never both at once.
    if (heroBtn && navBtn) {
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => navBtn.classList.toggle("show", !entries[0].isIntersecting),
          { rootMargin: "-73px 0px 0px 0px", threshold: 0 }
        );
        io.observe(heroBtn);
      } else {
        navBtn.classList.add("show"); // no IO support: keep it simply visible
      }
    } else if (navBtn) {
      navBtn.classList.add("show");
    }
  }

  /* ---------- Equal-height cert cards so "View Credential" lines up everywhere ---------- */
  function setupEqualize() {
    // For each group, stretch the measured block to the tallest one so the content
    // below it (View Credential / View details) lines up across every card. A fixed
    // CSS gap keeps that content clear of the text even on the tallest card.
    // Equalize each row separately (not the whole block) so the date, the
    // description, the tags and "View details" all line up at the same
    // position across every project card, whatever the title/description length.
    const groups = [
      { id: "certifications", sel: ".cert-name" },
      { id: "projects", sel: ".card-title" },
      { id: "projects", sel: ".card-tagline" },
      { id: "projects", sel: ".card-foot .tags" },
    ];
    const runners = [];
    groups.forEach(({ id, sel }) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const els = Array.from(sec.querySelectorAll(sel));
      if (els.length < 2) return;
      runners.push(() => {
        els.forEach((e) => (e.style.minHeight = ""));
        let max = 0;
        els.forEach((e) => (max = Math.max(max, e.offsetHeight)));
        els.forEach((e) => (e.style.minHeight = max + "px"));
      });
    });
    if (!runners.length) return;
    const runAll = () => runners.forEach((r) => r());
    runAll();
    window.addEventListener("resize", runAll);
    window.addEventListener("load", runAll);
    // Re-measure once the web fonts have loaded (they change text height).
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(runAll);
  }

  /* ---------- "Arrival" flash on the heading when navigating to a section ---------- */
  function setupSectionFlash() {
    function flash(id) {
      const el = document.getElementById(id);
      if (!el || reduced) return;
      el.classList.remove("flash");
      void el.offsetWidth; // restart the animation if re-triggered
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 1000);
    }
    navRoot.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) setTimeout(() => flash(href.slice(1)), 360);
    });
    // Arriving from another page with a hash (e.g. project page -> #projects).
    if (location.hash.length > 1) {
      setTimeout(() => flash(location.hash.slice(1)), 450);
    }
  }

  /* ---------- 3D tilt on cards (pointer-following, with glare) ---------- */
  function setupTilt() {
    const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    if (reduced || !canHover) return;

    const MAX = 8; // degrees
    document.querySelectorAll(".card, .cert-card").forEach((card) => {
      card.addEventListener("pointerenter", () => {
        card.classList.add("tilting");
        card.style.transition = "transform 0.08s linear, box-shadow 0.25s ease";
      });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -2 * MAX;
        const ry = (px - 0.5) * 2 * MAX;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("tilting");
        card.style.transition = "transform 0.4s ease, box-shadow 0.3s ease";
        card.style.transform = "";
      });
    });
  }
})();
