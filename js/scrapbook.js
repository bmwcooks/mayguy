/* Horizontal scrapbook with touch swipe + keyboard support */

import { MEMORIES } from "./data.js";

export function initScrapbook({ onComplete }) {
  const track = document.getElementById("scrapbook-track");
  const dotsEl = document.getElementById("scrapbook-dots");
  const hint = document.getElementById("scrapbook-hint");
  const continueBtn = document.getElementById("scrapbook-continue");
  const scrapbook = track?.closest(".scrapbook");

  if (!track || !dotsEl || !scrapbook) {
    return { destroy() {} };
  }

  let index = 0;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let dragging = false;
  let lockedAxis = null; // 'x' | 'y'
  let width = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;

  function build() {
    track.innerHTML = MEMORIES.map((m, i) => {
      const n = String(i + 1).padStart(2, "0");
      const total = String(MEMORIES.length).padStart(2, "0");
      return `
        <article class="scrapbook-page" role="listitem" aria-label="Memory ${i + 1} of ${MEMORIES.length}">
          <div class="page-sheet" style="--tilt: ${m.tilt}deg">
            <span class="page-tape page-tape--tl" aria-hidden="true"></span>
            <span class="page-tape page-tape--tr" aria-hidden="true"></span>
            <span class="page-deco page-deco--star" aria-hidden="true">✦</span>
            <h3 class="page-title">${escapeHtml(m.title)}</h3>
            <div class="page-photo-wrap">
              <img
                src="${m.image}"
                alt=""
                loading="${i < 2 ? "eager" : "lazy"}"
                decoding="async"
                draggable="false"
                style="object-position: ${m.focus || "50% 40%"}"
              />
            </div>
            <p class="page-story">${escapeHtml(m.story)}</p>
            <div class="page-footer">
              <p class="page-date">${escapeHtml(m.date)}</p>
              <p class="page-number">${n} / ${total}</p>
            </div>
            <span class="page-deco page-deco--dot" aria-hidden="true"></span>
          </div>
        </article>
      `;
    }).join("");

    dotsEl.innerHTML = MEMORIES.map(
      (_, i) => `<span class="scrapbook-dot${i === 0 ? " is-active" : ""}"></span>`
    ).join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function measure() {
    width = scrapbook.clientWidth || window.innerWidth;
  }

  function render(animate = true) {
    if (!animate) track.classList.add("is-dragging");
    else track.classList.remove("is-dragging");

    const offset = -index * width + (dragging ? deltaX : 0);
    track.style.transform = `translate3d(${offset}px, 0, 0)`;

    dotsEl.querySelectorAll(".scrapbook-dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });

    const last = index === MEMORIES.length - 1;
    if (hint) hint.classList.toggle("is-hidden", last || index > 0);
    if (continueBtn) {
      continueBtn.hidden = !last;
    }
  }

  function goTo(next) {
    index = Math.max(0, Math.min(MEMORIES.length - 1, next));
    deltaX = 0;
    dragging = false;
    render(true);
  }

  function onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    measure();
    dragging = true;
    lockedAxis = null;
    startX = e.clientX;
    startY = e.clientY;
    lastX = e.clientX;
    lastT = performance.now();
    velocity = 0;
    deltaX = 0;
    track.classList.add("is-dragging");
    try {
      scrapbook.setPointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const now = performance.now();
    const dt = now - lastT;

    if (dt > 0) {
      velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = now;
    }

    if (!lockedAxis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      lockedAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }

    if (lockedAxis === "y") {
      return;
    }

    e.preventDefault();
    const atStart = index === 0 && dx > 0;
    const atEnd = index === MEMORIES.length - 1 && dx < 0;
    deltaX = atStart || atEnd ? dx * 0.28 : dx;
    render(false);
  }

  function onPointerUp() {
    if (!dragging) return;
    const threshold = width * 0.16;
    const flick = Math.abs(velocity) > 0.45;
    const dx = deltaX;
    dragging = false;
    track.classList.remove("is-dragging");

    if (lockedAxis === "x") {
      if (dx < -threshold || (flick && velocity < -0.45)) goTo(index + 1);
      else if (dx > threshold || (flick && velocity > 0.45)) goTo(index - 1);
      else goTo(index);
    } else {
      goTo(index);
    }
    lockedAxis = null;
    velocity = 0;
  }

  function onKey(e) {
    const screen = document.getElementById("screen-scrapbook");
    if (!screen?.classList.contains("screen--active")) return;
    if (e.key === "ArrowRight") goTo(index + 1);
    if (e.key === "ArrowLeft") goTo(index - 1);
  }

  function onContinue() {
    onComplete?.();
  }

  function onResize() {
    measure();
    render(false);
  }

  build();
  measure();
  render(false);

  scrapbook.addEventListener("pointerdown", onPointerDown);
  scrapbook.addEventListener("pointermove", onPointerMove);
  scrapbook.addEventListener("pointerup", onPointerUp);
  scrapbook.addEventListener("pointercancel", onPointerUp);
  // Prevent image drag ghost on desktop
  scrapbook.addEventListener("dragstart", (e) => e.preventDefault());
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize, { passive: true });
  continueBtn?.addEventListener("click", onContinue);

  return {
    reset() {
      index = 0;
      measure();
      render(false);
      if (hint) hint.classList.remove("is-hidden");
      if (continueBtn) continueBtn.hidden = true;
    },
    destroy() {
      scrapbook.removeEventListener("pointerdown", onPointerDown);
      scrapbook.removeEventListener("pointermove", onPointerMove);
      scrapbook.removeEventListener("pointerup", onPointerUp);
      scrapbook.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      continueBtn?.removeEventListener("click", onContinue);
    },
  };
}
