/* Detail page: look up the certificate by ?id= and render it in-page —
   same pattern as project.js, instead of the home page's PDF popup modal. */
(function () {
  const page = document.getElementById("certPage");
  const certs = (window.CERTIFICATIONS || []).filter((c) => c.hasPdf && c.url && c.id);
  const id = new URLSearchParams(window.location.search).get("id");
  const cert = certs.find((c) => c.id === id);

  if (!cert) {
    page.innerHTML = `
      <h1>Certificate not found</h1>
      <p>Sorry, we couldn't find that certificate. It may have been renamed or removed.</p>`;
    return;
  }

  document.title = `${cert.name} - ${(window.PROFILE || {}).name || ""}`;

  // Refine the sharing/SEO tags for this specific certificate, same as
  // project.js does per project.
  (function updateMeta() {
    const site = "https://ikramjeelani.github.io/portfolio/";
    const url = site + "certificate.html?id=" + encodeURIComponent(cert.id);
    const desc = cert.name + (cert.issuer ? " — issued by " + cert.issuer + "." : ".");
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

  // Same GitHub-blob-to-local-path resolution main.js used for the old
  // modal — a GitHub "blob" PDF link also works and is resolved automatically.
  function toEmbed(url) {
    if (!url) return "";
    const m = url.match(/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+\.pdf)$/i);
    if (m) return m[1];
    if (/\.pdf($|\?)/i.test(url)) return url;
    return "";
  }
  const src = toEmbed(cert.url);

  const icoDownload =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>';
  const icoNewTab =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M14 4h6v6M20 4L10 14M9 5H5v14h14v-4"/></svg>';

  page.innerHTML = `
    <div class="cert-hero">
      ${cert.logo ? `<img class="cert-hero-logo" src="${cert.logo}" alt="${cert.issuer || cert.name} logo">` : ""}
      <div class="cert-hero-text">
        <h1>${cert.name}</h1>
        ${cert.issuer || cert.date ? `<p class="cert-hero-meta">${[cert.issuer, cert.date].filter(Boolean).join(" · ")}</p>` : ""}
      </div>
    </div>
    <div class="cert-embed">
      <div class="pdf-toolbar cert-embed-toolbar">
        <span class="pdf-title">${cert.name}</span>
        <div class="pdf-tools">
          <button type="button" class="pdf-tool-btn cert-zoom-out" aria-label="Zoom out">&minus;</button>
          <span class="pdf-zoom-label cert-zoom-label">100%</span>
          <button type="button" class="pdf-tool-btn cert-zoom-in" aria-label="Zoom in">+</button>
          <a class="pdf-tool-btn" href="${src}" download aria-label="Download">${icoDownload}</a>
          <a class="pdf-tool-btn" href="${src}" target="_blank" rel="noopener" aria-label="Open in new tab">${icoNewTab}</a>
        </div>
      </div>
      <div class="cert-embed-pages"><div class="pdf-spinner" aria-label="Loading"></div></div>
    </div>`;

  const PDFJS_CDN = "assets/vendor/pdfjs";
  const loadLib = () => {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = PDFJS_CDN + "/pdf.min.js";
      s.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDN + "/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };
      s.onerror = () => reject(new Error("pdf.js failed to load"));
      document.head.appendChild(s);
    });
  };

  let zoom = 1;
  let pdfDoc = null;
  const box = page.querySelector(".cert-embed-pages");
  const zoomLabel = page.querySelector(".cert-zoom-label");

  async function renderPages() {
    const doc = pdfDoc;
    box.classList.remove("fallback");
    box.innerHTML = "";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (let n = 1; n <= doc.numPages; n++) {
      if (doc !== pdfDoc) return; // a newer document replaced this one mid-render
      const pdfPage = await doc.getPage(n);
      const vp1 = pdfPage.getViewport({ scale: 1 });
      const fit = (box.clientWidth - 44) / vp1.width; // fit page to the column width
      const vp = pdfPage.getViewport({ scale: fit * zoom * dpr });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width;
      canvas.height = vp.height;
      canvas.style.width = vp.width / dpr + "px";
      canvas.style.height = vp.height / dpr + "px";
      box.appendChild(canvas);
      await pdfPage.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
    }
  }

  const setZoom = (z) => {
    zoom = Math.min(3, Math.max(0.5, z));
    zoomLabel.textContent = Math.round(zoom * 100) + "%";
    if (pdfDoc) renderPages();
  };
  page.querySelector(".cert-zoom-in").addEventListener("click", () => setZoom(zoom + 0.25));
  page.querySelector(".cert-zoom-out").addEventListener("click", () => setZoom(zoom - 0.25));

  (async () => {
    try {
      const lib = await loadLib();
      pdfDoc = await lib.getDocument(src).promise;
      await renderPages();
    } catch (err) {
      // CDN blocked or the PDF failed to parse — iframe fallback still works.
      box.classList.add("fallback");
      box.innerHTML = '<iframe title="Certificate" src="' + src + '"></iframe>';
    }
  })();

  // Re-render at the new display density (e.g. dragged to a different
  // monitor) — a rendered page is a bitmap sized for one density, same
  // reasoning as the home page's hero canvas.
  if (window.matchMedia) {
    const arm = () => {
      const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      if (!mq.addEventListener) return;
      mq.addEventListener(
        "change",
        () => {
          if (pdfDoc) renderPages();
          arm();
        },
        { once: true }
      );
    };
    arm();
  }

  // ←/→ step through certificates (ignored while typing or with modifiers held).
  const idx = certs.indexOf(cert);
  const prevC = idx > 0 ? certs[idx - 1] : null;
  const nextC = idx < certs.length - 1 ? certs[idx + 1] : null;
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.key === "ArrowLeft" && prevC) {
      location.href = "certificate.html?id=" + encodeURIComponent(prevC.id);
    } else if (e.key === "ArrowRight" && nextC) {
      location.href = "certificate.html?id=" + encodeURIComponent(nextC.id);
    }
  });

  // Sidebar certificate list — same pattern as project.js's sidebar-dock.
  // No logo thumbnail (a 46px square issuer logo read as too small to help
  // identify anything) and no hover-preview genie either — a certificate
  // only has that same small square logo, not a wide hero image, so
  // blowing it up to preview-panel size would just look stretched.
  const cardsHTML = certs
    .map((c, i) => {
      const active = c.id === cert.id ? " active" : "";
      const num = String(i + 1).padStart(2, "0");
      return `
        <a class="dock-card${active}" href="certificate.html?id=${encodeURIComponent(c.id)}">
          <span class="dock-num">${num}</span>
          <span class="dock-body">
            ${active ? '<span class="dock-flag">Now viewing</span>' : ""}
            <span class="dock-name">${c.name}</span>
            ${c.date ? `<span class="dock-date">${c.date}</span>` : ""}
          </span>
        </a>`;
    })
    .join("");

  const sidebar = document.querySelector(".site-header");
  if (sidebar && certs.length > 1) {
    const dock = document.createElement("div");
    dock.className = "sidebar-dock";
    dock.setAttribute("aria-label", "Other certifications");
    dock.innerHTML = `
      <span class="sidebar-dock-title">Certifications</span>
      <div class="dock-reel">${cardsHTML}</div>`;
    // Between the brand and the footer controls — branding.js has already
    // appended .header-controls to the sidebar by the time this script
    // runs (branding.js loads first; see certificate.html's script order).
    const controls = sidebar.querySelector(".header-controls");
    if (controls) sidebar.insertBefore(dock, controls);
    else sidebar.appendChild(dock);

    const reel = dock.querySelector(".dock-reel");
    // Cards are a fixed height in CSS, so the active card's "Now viewing"
    // flag never resizes the row. Centre the current one (clamped),
    // immediately and pre-paint, so it looks right however you arrive.
    const centerActive = () => {
      const cur = reel.querySelector(".dock-card.active");
      if (!cur) return;
      const max = Math.max(0, reel.scrollHeight - reel.clientHeight);
      const target = cur.offsetTop + cur.offsetHeight / 2 - reel.clientHeight / 2;
      reel.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: "auto" });
    };
    centerActive();
    // rAF-coalesced — a drag-resize firing many "resize" events shouldn't
    // force a scroll-layout recompute on every single one of them.
    let resizeRaf = null;
    window.addEventListener("resize", () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        centerActive();
      });
    });
  }
})();
