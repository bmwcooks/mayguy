/* Graduation experience — landing, countdown, letter, special-days hub */

import { initStars } from "./stars.js";
import { startFlowerConfetti } from "./flower-confetti.js";
import { initCountdown } from "./countdown.js";

const SCREENS = {
  landing: "screen-grad-landing",
  countdown: "screen-grad-countdown",
  letter: "screen-grad-letter",
  hub: "screen-hub",
};

let current = "landing";
let transitioning = false;
let confetti = null;
let countdown = null;

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

  if (next === "countdown") {
    countdown?.destroy();
    countdown = initCountdown(document.getElementById("grad-countdown"));
  }
  if (next !== "landing") {
    confetti?.stop();
  }
}

function bootLanding() {
  const layer = document.getElementById("flower-confetti");
  const card = document.getElementById("grad-popup");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  confetti = startFlowerConfetti(layer, { count: reduced ? 8 : 24 });

  const show = () => card?.classList.add("is-visible");
  if (reduced) show();
  else setTimeout(show, 900);
}

initStars(document.getElementById("stars"));
bootLanding();

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = btn.getAttribute("data-next");
    if (next) goTo(next);
  });
});

document.addEventListener(
  "touchmove",
  (e) => {
    if (e.target.closest("#screen-grad-letter, .day-list")) return;
    if (e.touches.length === 1) e.preventDefault();
  },
  { passive: false }
);

window.__grad = { goTo };
