/* Home page: render project cards into the carousel and wire up navigation. */
(function () {
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const projects = window.PROJECTS || [];

  document.getElementById("year").textContent = new Date().getFullYear();

  // Build a card for each project.
  projects.forEach((p) => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `project.html?id=${encodeURIComponent(p.id)}`;
    card.innerHTML = `
      <div class="card-img" style="background-image:url('${p.image}')"></div>
      <div class="card-body">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-tagline">${p.tagline || ""}</p>
        <span class="card-cta">View details &rarr;</span>
      </div>
    `;
    track.appendChild(card);

    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", `Go to ${p.title}`);
    dotsWrap.appendChild(dot);
  });

  const cards = Array.from(track.children);
  const dots = Array.from(dotsWrap.children);
  let index = 0;

  function update() {
    // Slide the track so the active card is in view.
    const card = cards[index];
    if (!card) return;
    const offset = card.offsetLeft - track.offsetLeft;
    track.scrollTo({ left: offset, behavior: "smooth" });
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function go(delta) {
    index = (index + delta + cards.length) % cards.length;
    update();
  }

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));
  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      index = i;
      update();
    })
  );

  // Keyboard arrows for accessibility.
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  // Keep dots in sync if the user scrolls/swipes the track directly.
  let scrollTimer;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      cards.forEach((c, i) => {
        const cardCenter = c.offsetLeft - track.offsetLeft + c.clientWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < best) {
          best = dist;
          nearest = i;
        }
      });
      index = nearest;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }, 80);
  });

  update();
})();
