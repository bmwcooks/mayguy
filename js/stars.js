/* Soft midnight starfield — lightweight canvas, iPhone-friendly */

export function initStars(canvas) {
  if (!canvas) return { destroy() {} };

  const ctx = canvas.getContext("2d", { alpha: true });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let stars = [];
  let raf = 0;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let running = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const count = Math.floor((w * h) / 14000);
    stars = Array.from({ length: Math.max(40, Math.min(count, 120)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.15 + 0.25,
      a: Math.random() * 0.55 + 0.15,
      tw: Math.random() * Math.PI * 2,
      sp: 0.004 + Math.random() * 0.012,
    }));
  }

  function draw(t) {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      const twinkle = reduced ? s.a : s.a * (0.65 + 0.35 * Math.sin(t * s.sp + s.tw));
      ctx.beginPath();
      ctx.fillStyle = `rgba(232, 238, 248, ${twinkle})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduced) {
      raf = requestAnimationFrame(draw);
    }
  }

  function onVisibility() {
    running = document.visibilityState === "visible";
    if (running && !reduced) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    }
  }

  resize();
  draw(0);
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
