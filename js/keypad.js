/* iOS-style entry keypad — PIN verified via SHA-256 hash */

import { LOCK_HASHES, ENTRY_PIN_LENGTH } from "./data.js";

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function initEntryKeypad({ onUnlock }) {
  const keypad = document.getElementById("entry-keypad");
  const dots = document.querySelectorAll("#passcode-dots .passcode-dot");
  const error = document.getElementById("entry-error");
  const dotsRow = document.getElementById("passcode-dots");

  if (!keypad) return { destroy() {} };

  let pin = "";
  let locked = false;

  function renderDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-filled", i < pin.length);
    });
  }

  function clearError() {
    if (error) error.hidden = true;
    dotsRow?.classList.remove("is-wrong");
  }

  async function submit() {
    locked = true;
    const hash = await sha256Hex(pin);
    if (hash === LOCK_HASHES.entry) {
      dotsRow?.classList.add("is-success");
      setTimeout(() => onUnlock?.(), 320);
      return;
    }

    // Wrong PIN — shake and reset
    if (error) error.hidden = false;
    dotsRow?.classList.add("is-wrong");
    keypad.classList.add("is-wrong");

    setTimeout(() => {
      pin = "";
      renderDots();
      keypad.classList.remove("is-wrong");
      dotsRow?.classList.remove("is-wrong");
      locked = false;
    }, 520);
  }

  function press(key) {
    if (locked) return;
    clearError();

    if (key === "delete") {
      if (!pin.length) return;
      pin = pin.slice(0, -1);
      renderDots();
      return;
    }

    if (!/^\d$/.test(key)) return;
    if (pin.length >= ENTRY_PIN_LENGTH) return;

    pin += key;
    renderDots();

    if (pin.length === ENTRY_PIN_LENGTH) {
      submit();
    }
  }

  function onClick(e) {
    const btn = e.target.closest("[data-key]");
    if (!btn) return;
    press(btn.getAttribute("data-key"));
  }

  function onKeydown(e) {
    const screen = document.getElementById("screen-entry");
    if (!screen?.classList.contains("screen--active")) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      press("delete");
      return;
    }
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      press(e.key);
    }
  }

  keypad.addEventListener("click", onClick);
  window.addEventListener("keydown", onKeydown);
  renderDots();

  return {
    destroy() {
      keypad.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeydown);
    },
  };
}
