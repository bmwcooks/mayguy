/* Graduation countdown — June 10, 2028 (Ben Standard Time / America/Los_Angeles) */

export const GRADUATION_DATE = "2028-06-10T00:00:00-07:00";

function partsUntil(target) {
  const now = Date.now();
  const end = new Date(target).getTime();
  let diff = Math.max(0, end - now);

  const msDay = 86_400_000;
  const days = Math.floor(diff / msDay);
  diff -= days * msDay;
  const hours = Math.floor(diff / 3_600_000);
  diff -= hours * 3_600_000;
  const minutes = Math.floor(diff / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return { days, hours, minutes, seconds, done: end <= now };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export function initCountdown(root, { target = GRADUATION_DATE } = {}) {
  if (!root) return { destroy() {} };

  const daysEl = root.querySelector("[data-unit='days']");
  const hoursEl = root.querySelector("[data-unit='hours']");
  const minutesEl = root.querySelector("[data-unit='minutes']");
  const secondsEl = root.querySelector("[data-unit='seconds']");
  const statusEl =
    root.querySelector("[data-countdown-status]") ||
    document.querySelector("[data-countdown-status]");

  function tick() {
    const t = partsUntil(target);
    if (daysEl) daysEl.textContent = String(t.days);
    if (hoursEl) hoursEl.textContent = pad(t.hours);
    if (minutesEl) minutesEl.textContent = pad(t.minutes);
    if (secondsEl) secondsEl.textContent = pad(t.seconds);
    if (statusEl) {
      statusEl.textContent = t.done
        ? "It's here."
        : "until June 10, 2028"; // Ben's graduation
    }
  }

  tick();
  const id = setInterval(tick, 1000);

  return {
    destroy() {
      clearInterval(id);
    },
  };
}
