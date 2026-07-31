/* App shell — screen flow, envelope, typewriter goodbye */

import { initStars } from "./stars.js";
import { initScrapbook } from "./scrapbook.js";
import { initLocks, playGiftOpen, initCouponCopy } from "./gift.js";
import { GOODBYE_LINES } from "./data.js";

const SCREENS = {
  envelope: "screen-envelope",
  welcome: "screen-welcome",
  disclaimers: "screen-disclaimers",
  scrapbook: "screen-scrapbook",
  "gift-intro": "screen-gift-intro",
  "gift-lock-1": "screen-gift-lock-1",
  "gift-lock-2": "screen-gift-lock-2",
  "gift-box": "screen-gift-box",
  "gift-reveal": "screen-gift-reveal",
  goodbye: "screen-goodbye",
};

let current = "envelope";
let transitioning = false;

function getScreen(key) {
  return document.getElementById(SCREENS[key]);
}

async function goTo(next, { delay = 0 } = {}) {
  if (transitioning || next === current) return;
  transitioning = true;

  if (delay) await wait(delay);

  const from = getScreen(current);
  const to = getScreen(next);
  if (!to) {
    transitioning = false;
    return;
  }

  if (from) {
    from.classList.add("screen--exit");
    from.classList.remove("screen--active");
    await wait(480);
    from.hidden = true;
    from.classList.remove("screen--exit");
  }

  to.hidden = false;
  // force reflow so entrance animation plays
  void to.offsetWidth;
  to.classList.add("screen--active");
  current = next;
  transitioning = false;

  // screen-specific hooks
  if (next === "gift-lock-1") locks.focusLock1();
  if (next === "gift-lock-2") locks.focusLock2();
  if (next === "gift-box") {
    playGiftOpen({
      onDone: () => goTo("gift-reveal"),
    });
  }
  if (next === "goodbye") runGoodbye();
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ---------- Envelope ---------- */
function initEnvelope() {
  const envelope = document.getElementById("envelope");
  const hint = document.querySelector(".envelope-hint");
  if (!envelope) return;

  let opened = false;

  envelope.addEventListener("click", async () => {
    if (opened) return;
    opened = true;
    if (hint) hint.style.opacity = "0";
    envelope.classList.add("is-opening");

    await wait(1450);
    envelope.classList.add("is-opened");
    await wait(400);
    goTo("welcome");
  });
}

/* ---------- Typewriter goodbye ---------- */
async function runGoodbye() {
  const ids = ["goodbye-line-1", "goodbye-line-2", "goodbye-line-3"];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  for (let i = 0; i < GOODBYE_LINES.length; i++) {
    const el = document.getElementById(ids[i]);
    if (!el) continue;
    await typeLine(el, GOODBYE_LINES[i], reduced ? 0 : 38);
    await wait(reduced ? 100 : 480);
  }
}

async function typeLine(el, text, speed) {
  el.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  el.appendChild(cursor);

  if (speed === 0) {
    el.insertBefore(document.createTextNode(text), cursor);
    cursor.remove();
    return;
  }

  for (const ch of text) {
    el.insertBefore(document.createTextNode(ch), cursor);
    await wait(speed + (ch === " " ? 40 : 0));
  }

  await wait(320);
  cursor.remove();
}

/* ---------- Boot ---------- */
initStars(document.getElementById("stars"));
initEnvelope();
initCouponCopy();

const scrapbook = initScrapbook({
  onComplete: () => goTo("gift-intro"),
});

const locks = initLocks({
  onLock1: () => goTo("gift-lock-2"),
  onLock2: () => goTo("gift-box"),
});

// Declarative next buttons
document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = btn.getAttribute("data-next");
    if (next) goTo(next);
  });
});

// Prevent accidental overscroll bounce from feeling broken on iOS
document.body.addEventListener(
  "touchmove",
  (e) => {
    // allow inputs / scrapbook track handling; block background rubber-band
    if (e.target.closest(".scrapbook") || e.target.closest(".lock-input")) return;
    if (e.target === document.body || e.target === document.documentElement) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Expose for debugging in console if needed (harmless)
window.__ngd = { goTo, scrapbook };
