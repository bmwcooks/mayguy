/* Birthday — candle, note, age gap, phone, then the other days */

import { initStars } from "./stars.js";
import { startFlowerConfetti } from "./flower-confetti.js";

const SCREENS = {
  landing: "screen-bday-landing",
  note: "screen-bday-note",
  older: "screen-bday-older",
  gift: "screen-bday-gift",
  hub: "screen-hub",
};

let current = "landing";
let transitioning = false;
let confetti = null;
let wished = false;

function getScreen(key) {
  return document.getElementById(SCREENS[key]);
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function goTo(next) {
  if (transitioning || next === current) return;
  transitioning = true;

  const from = getScreen(current);
  const to = getScreen(next);
  if (!to) {
    transitioning = false;
    return;
  }

  if (from) {
    from.classList.add("screen--exit");
    from.classList.remove("screen--active");
    await wait(520);
    from.hidden = true;
    from.classList.remove("screen--exit");
  }

  to.hidden = false;
  void to.offsetWidth;
  to.classList.add("screen--active");
  current = next;
  transitioning = false;

  if (next !== "landing") confetti?.stop();
}

function mountPhoto(img) {
  const frame = img?.closest(".photo-frame");
  if (!img || !frame) return;

  const show = () => {
    if (img.naturalWidth <= 0) return;
    img.hidden = false;
    frame.classList.add("has-photo");
  };

  img.addEventListener("load", show);
  img.addEventListener("error", () => {
    img.hidden = true;
    frame.classList.remove("has-photo");
  });

  if (img.complete) show();
}

function bootLanding() {
  const layer = document.getElementById("flower-confetti");
  const card = document.getElementById("bday-popup");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  confetti = startFlowerConfetti(layer, { count: reduced ? 6 : 14 });

  const show = () => card?.classList.add("is-visible");
  if (reduced) show();
  else setTimeout(show, 800);
}

async function blowOut() {
  if (wished || transitioning) return;
  wished = true;

  const candle = document.getElementById("birthday-candle");
  const button = document.getElementById("bday-wish");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  candle?.classList.add("is-out");
  if (button) button.disabled = true;

  await wait(reduced ? 180 : 880);
  await goTo("note");
}

initStars(document.getElementById("stars"));
document.querySelectorAll("[data-photo]").forEach(mountPhoto);
bootLanding();

document.getElementById("bday-wish")?.addEventListener("click", blowOut);

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = btn.getAttribute("data-next");
    if (next) goTo(next);
  });
});

document.addEventListener(
  "touchmove",
  (e) => {
    if (e.target.closest("#screen-bday-note, #screen-bday-gift, #screen-bday-older, .day-list")) return;
    if (e.touches.length === 1) e.preventDefault();
  },
  { passive: false }
);

window.__bday = { goTo, blowOut };
