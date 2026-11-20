(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("visible"));
  }

  // The glowing orb follows the dashed SVG path according to page scroll.
  const path = document.getElementById("scrollPath");
  const orb = document.getElementById("pathOrb");
  function moveOrb() {
    if (!path || !orb || reducedMotion) return;
    const rect = path.getBoundingClientRect();
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    const point = path.getPointAtLength(path.getTotalLength() * progress);
    const svgRect = path.ownerSVGElement.getBoundingClientRect();
    orb.style.left = (svgRect.left + (point.x / 1000) * svgRect.width) + "px";
    orb.style.top = (svgRect.top + (point.y / 4200) * svgRect.height) + "px";
  }
  let ticking = false;
  function requestOrbMove() {
    if (!ticking) {
      requestAnimationFrame(() => { moveOrb(); ticking = false; });
      ticking = true;
    }
  }
  window.addEventListener("scroll", requestOrbMove, { passive: true });
  window.addEventListener("resize", requestOrbMove);
  window.addEventListener("load", moveOrb);
  moveOrb();

  // Portfolio category filters.
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".project-card");
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(item => item.classList.toggle("active", item === button));
    const selected = button.dataset.filter;
    cards.forEach(card => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
    });
  }));

  // Lightweight project detail dialog; replace placeholder copy with real project info.
  const dialog = document.getElementById("projectDialog");
  const close = document.querySelector(".dialog-close");
  document.querySelectorAll(".project-open").forEach(button => button.addEventListener("click", () => {
    document.getElementById("dialogTitle").textContent = button.dataset.title;
    document.getElementById("dialogType").textContent = button.dataset.type;
    document.getElementById("dialogDescription").textContent = button.dataset.description;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
  }));
  close.addEventListener("click", () => dialog.close ? dialog.close() : dialog.removeAttribute("open"));
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  document.getElementById("year").textContent = new Date().getFullYear();
})();