/* Favorite flowers — SVG blooms for the midnight garden */

export const FLOWERS = [
  {
    id: "carnation",
    name: "Carnation",
    delay: 0,
  },
  {
    id: "peony",
    name: "Peony",
    delay: 0.12,
  },
  {
    id: "dahlia",
    name: "Dahlia",
    delay: 0.24,
  },
  {
    id: "chrysanthemum",
    name: "Chrysanthemum",
    delay: 0.36,
  },
  {
    id: "lily",
    name: "Lily",
    delay: 0.48,
  },
];

function carnationSvg() {
  return `
    <svg class="bloom-svg" viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <radialGradient id="carn-grad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#f0d0d0"/>
          <stop offset="55%" stop-color="#d4a0a8"/>
          <stop offset="100%" stop-color="#b87a86"/>
        </radialGradient>
      </defs>
      <g class="bloom-stem">
        <path d="M60 70 V130" stroke="#4a5c48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M60 100 Q48 96 42 104" stroke="#4a5c48" stroke-width="1.6" fill="none"/>
        <ellipse cx="40" cy="106" rx="7" ry="3.5" fill="#5a6e56" transform="rotate(-35 40 106)"/>
      </g>
      <g class="bloom-head">
        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
          .map(
            (a, i) => `
          <ellipse cx="60" cy="42" rx="${16 - (i % 3)}" ry="${22 - (i % 2) * 2}"
            fill="url(#carn-grad)" opacity="${0.75 + (i % 3) * 0.08}"
            transform="rotate(${a} 60 52)"/>`
          )
          .join("")}
        <circle cx="60" cy="52" r="8" fill="#e8b8c0"/>
      </g>
    </svg>`;
}

function peonySvg() {
  return `
    <svg class="bloom-svg" viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <radialGradient id="peony-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#faf0ee"/>
          <stop offset="45%" stop-color="#e8c8c4"/>
          <stop offset="100%" stop-color="#c9959a"/>
        </radialGradient>
      </defs>
      <g class="bloom-stem">
        <path d="M60 72 V132" stroke="#4a5c48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M60 105 Q72 100 78 108" stroke="#4a5c48" stroke-width="1.6" fill="none"/>
        <ellipse cx="80" cy="110" rx="8" ry="3.8" fill="#5a6e56" transform="rotate(30 80 110)"/>
      </g>
      <g class="bloom-head">
        ${[0, 40, 80, 120, 160, 200, 240, 280, 320]
          .map(
            (a) => `
          <ellipse cx="60" cy="40" rx="18" ry="24"
            fill="url(#peony-grad)" opacity="0.85"
            transform="rotate(${a} 60 52)"/>`
          )
          .join("")}
        ${[20, 100, 180, 260]
          .map(
            (a) => `
          <ellipse cx="60" cy="44" rx="12" ry="16"
            fill="#f2d8d4" opacity="0.9"
            transform="rotate(${a} 60 52)"/>`
          )
          .join("")}
        <circle cx="60" cy="52" r="7" fill="#f8e8e4"/>
      </g>
    </svg>`;
}

function dahliaSvg() {
  return `
    <svg class="bloom-svg" viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <radialGradient id="dahlia-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f5e6d0"/>
          <stop offset="50%" stop-color="#e0b892"/>
          <stop offset="100%" stop-color="#c49a6c"/>
        </radialGradient>
      </defs>
      <g class="bloom-stem">
        <path d="M60 70 V130" stroke="#4a5c48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M60 98 Q46 94 40 102" stroke="#4a5c48" stroke-width="1.6" fill="none"/>
        <ellipse cx="38" cy="104" rx="7" ry="3.2" fill="#5a6e56" transform="rotate(-40 38 104)"/>
      </g>
      <g class="bloom-head">
        ${Array.from({ length: 16 }, (_, i) => {
          const a = i * 22.5;
          return `<ellipse cx="60" cy="38" rx="7" ry="22"
            fill="url(#dahlia-grad)" opacity="${0.7 + (i % 2) * 0.15}"
            transform="rotate(${a} 60 52)"/>`;
        }).join("")}
        ${Array.from({ length: 12 }, (_, i) => {
          const a = i * 30 + 15;
          return `<ellipse cx="60" cy="42" rx="5" ry="14"
            fill="#f0d4b0" opacity="0.9"
            transform="rotate(${a} 60 52)"/>`;
        }).join("")}
        <circle cx="60" cy="52" r="6" fill="#c9b896"/>
      </g>
    </svg>`;
}

function chrysanthemumSvg() {
  return `
    <svg class="bloom-svg" viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <radialGradient id="mum-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#faf6ee"/>
          <stop offset="50%" stop-color="#e8dcc8"/>
          <stop offset="100%" stop-color="#d4c4a0"/>
        </radialGradient>
      </defs>
      <g class="bloom-stem">
        <path d="M60 70 V130" stroke="#4a5c48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M60 102 Q74 96 80 104" stroke="#4a5c48" stroke-width="1.6" fill="none"/>
        <ellipse cx="82" cy="106" rx="8" ry="3.5" fill="#5a6e56" transform="rotate(35 82 106)"/>
      </g>
      <g class="bloom-head">
        ${Array.from({ length: 24 }, (_, i) => {
          const a = i * 15;
          return `<ellipse cx="60" cy="34" rx="3.2" ry="20"
            fill="url(#mum-grad)" opacity="${0.65 + (i % 3) * 0.1}"
            transform="rotate(${a} 60 52)"/>`;
        }).join("")}
        ${Array.from({ length: 16 }, (_, i) => {
          const a = i * 22.5 + 8;
          return `<ellipse cx="60" cy="40" rx="2.4" ry="12"
            fill="#f5edd8" opacity="0.85"
            transform="rotate(${a} 60 52)"/>`;
        }).join("")}
        <circle cx="60" cy="52" r="5" fill="#c9b896"/>
      </g>
    </svg>`;
}

function lilySvg() {
  return `
    <svg class="bloom-svg" viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <radialGradient id="lily-grad" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stop-color="#fffef9"/>
          <stop offset="60%" stop-color="#f0ebe0"/>
          <stop offset="100%" stop-color="#d8d0c0"/>
        </radialGradient>
      </defs>
      <g class="bloom-stem">
        <path d="M60 68 V132" stroke="#4a5c48" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M60 100 Q48 92 44 100" stroke="#4a5c48" stroke-width="1.6" fill="none"/>
        <ellipse cx="42" cy="102" rx="9" ry="4" fill="#5a6e56" transform="rotate(-50 42 102)"/>
      </g>
      <g class="bloom-head">
        ${[0, 72, 144, 216, 288]
          .map(
            (a) => `
          <path d="M60 52 Q60 28 60 18 Q72 32 68 52 Z"
            fill="url(#lily-grad)" opacity="0.92"
            transform="rotate(${a} 60 52)"/>
          <path d="M60 52 Q60 28 60 18 Q48 32 52 52 Z"
            fill="url(#lily-grad)" opacity="0.88"
            transform="rotate(${a} 60 52)"/>`
          )
          .join("")}
        ${[0, 72, 144, 216, 288]
          .map(
            (a) => `
          <line x1="60" y1="52" x2="60" y2="28"
            stroke="#c9b896" stroke-width="1.2" opacity="0.7"
            transform="rotate(${a} 60 52)"/>
          <circle cx="60" cy="26" r="1.6" fill="#d4c4a0"
            transform="rotate(${a} 60 52)"/>`
          )
          .join("")}
        <circle cx="60" cy="52" r="4" fill="#c9b896"/>
      </g>
    </svg>`;
}

const BLOOM_RENDERERS = {
  carnation: carnationSvg,
  peony: peonySvg,
  dahlia: dahliaSvg,
  chrysanthemum: chrysanthemumSvg,
  lily: lilySvg,
};

/** Unique-id bloom markup for garden or confetti. */
export function bloomMarkup(id, { uid = id, includeStem = true } = {}) {
  let svg = BLOOM_RENDERERS[id]?.() ?? "";
  svg = svg.replaceAll('id="', `id="${uid}-`).replaceAll("url(#", `url(#${uid}-`);
  if (!includeStem) {
    svg = svg.replace(/<g class="bloom-stem">[\s\S]*?<\/g>/, "");
    svg = svg.replace('viewBox="0 0 120 140"', 'viewBox="8 6 104 72"');
  }
  return svg;
}

export function renderGarden(container) {
  if (!container) return;

  container.innerHTML = FLOWERS.map((flower) => {
    const svg = bloomMarkup(flower.id, { uid: `garden-${flower.id}` });
    return `
      <figure class="bloom" data-flower="${flower.id}" style="--bloom-delay: ${flower.delay}s">
        ${svg}
        <figcaption class="bloom-name">${flower.name}</figcaption>
      </figure>
    `;
  }).join("");
}
