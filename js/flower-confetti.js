/* Falling bloom confetti — uses the same SVG flowers as the garden */

import { FLOWERS, bloomMarkup } from "./flowers.js";

export function startFlowerConfetti(layer, { count = 22 } = {}) {
  if (!layer) return { stop() {} };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ids = FLOWERS.map((f) => f.id);
  const pieces = [];

  layer.innerHTML = "";
  layer.hidden = false;

  const n = reduced ? Math.min(8, count) : count;

  for (let i = 0; i < n; i++) {
    const id = ids[i % ids.length];
    const el = document.createElement("div");
    el.className = "flower-piece";
    el.innerHTML = bloomMarkup(id, {
      uid: `confetti-${i}-${id}`,
      includeStem: false,
    });

    const left = Math.random() * 100;
    const size = 2.4 + Math.random() * 2.6; // rem
    const delay = Math.random() * 1.4;
    const duration = reduced ? 0 : 7.5 + Math.random() * 6.5;
    const drift = (Math.random() - 0.5) * 48;
    const spin = (Math.random() - 0.5) * 80;
    const opacity = 0.55 + Math.random() * 0.4;

    el.style.left = `${left}vw`;
    el.style.width = `${size}rem`;
    el.style.setProperty("--drift", `${drift}vw`);
    el.style.setProperty("--spin", `${spin}deg`);
    el.style.setProperty("--fall-delay", `${delay}s`);
    el.style.setProperty("--fall-duration", `${duration}s`);
    el.style.opacity = String(opacity);

    if (reduced) {
      el.style.top = `${10 + Math.random() * 70}vh`;
      el.style.animation = "none";
    }

    layer.appendChild(el);
    pieces.push(el);
  }

  return {
    stop() {
      layer.innerHTML = "";
      layer.hidden = true;
    },
  };
}
