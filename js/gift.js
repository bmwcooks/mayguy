/* Gift locks, box opening, confetti, coupon copy */

import { LOCK_HASHES, COUPON_CODE } from "./data.js";

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function checkAnswer(input, expectedHash) {
  const normalized = String(input ?? "").trim().toLowerCase();
  if (!normalized) return false;
  const hash = await sha256Hex(normalized);
  return hash === expectedHash;
}

export function initLocks({ onLock1, onLock2 }) {
  const form1 = document.getElementById("lock-form-1");
  const form2 = document.getElementById("lock-form-2");
  const input1 = document.getElementById("lock-input-1");
  const input2 = document.getElementById("lock-input-2");
  const err1 = document.getElementById("lock-error-1");
  const err2 = document.getElementById("lock-error-2");

  async function handle(form, input, err, hash, next) {
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await checkAnswer(input.value, hash);
      if (!ok) {
        err.hidden = false;
        input.classList.add("is-wrong");
        input.addEventListener(
          "animationend",
          () => input.classList.remove("is-wrong"),
          { once: true }
        );
        input.select?.();
        return;
      }
      err.hidden = true;
      input.blur();
      next?.();
    });
  }

  handle(form1, input1, err1, LOCK_HASHES.one, onLock1);
  handle(form2, input2, err2, LOCK_HASHES.two, onLock2);

  return {
    focusLock1() {
      requestAnimationFrame(() => input1?.focus());
    },
    focusLock2() {
      requestAnimationFrame(() => input2?.focus());
    },
  };
}

/* Lightweight confetti — soft champagne palette */
export function burstConfetti(canvas, duration = 2200) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = ["#c9b896", "#e8eef8", "#d4c4a0", "#8b9bc4", "#f3eee4", "#a8926e"];
  const pieces = Array.from({ length: 72 }, () => ({
    x: w * 0.5 + (Math.random() - 0.5) * 80,
    y: h * 0.42,
    vx: (Math.random() - 0.5) * 7.5,
    vy: -Math.random() * 9 - 3,
    g: 0.14 + Math.random() * 0.08,
    size: 3 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
    color: colors[(Math.random() * colors.length) | 0],
    life: 1,
  }));

  const start = performance.now();
  let raf = 0;

  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, w, h);

    for (const p of pieces) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - t / duration);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.life * 0.9;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    if (t < duration) {
      raf = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, w, h);
    }
  }

  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

export function playGiftOpen({ onDone }) {
  const box = document.getElementById("gift-box");
  const text = document.getElementById("gift-opening-text");
  const canvas = document.getElementById("confetti");

  text?.classList.add("is-visible");

  requestAnimationFrame(() => {
    box?.classList.add("is-opening");
  });

  setTimeout(() => burstConfetti(canvas), 420);

  setTimeout(() => {
    onDone?.();
  }, 2100);
}

export function initCouponCopy() {
  const btn = document.getElementById("copy-code");
  const feedback = document.getElementById("copy-feedback");
  const codeEl = document.getElementById("coupon-code");

  btn?.addEventListener("click", async () => {
    const code = codeEl?.textContent?.trim() || COUPON_CODE;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for older Safari
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    if (feedback) {
      feedback.hidden = false;
      btn.textContent = "Copied";
      setTimeout(() => {
        feedback.hidden = true;
        btn.textContent = "Copy Code";
      }, 1800);
    }
  });
}
