/**
 * Rasterises the brand mark into the PNG sizes the browser and social
 * platforms expect, and paints the 1200x630 Open Graph card.
 *
 * Run with: npm run brand
 * Everything is generated from the same palette as global.css, so the icons
 * can never drift out of sync with the site.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const GOLD = '#d4af37';
const GOLD_LIGHT = '#f0d98a';
const GOLD_DARK = '#9d7c1f';
const BLACK = '#0b0b0e';
const INK = '#a7a7b0';

/* ---------------------------------------------------------------- *
 * The "B" monogram, drawn as a path so it scales cleanly to any size.
 * ---------------------------------------------------------------- */
const MONOGRAM = `
<path
  d="M22 16h11.5c5.2 0 8.5 2.7 8.5 7 0 3-1.7 5.1-4.5 6.1 3.4.9 5.5 3.2 5.5 6.5 0 4.7-3.6 7.4-9.3 7.4H22V16Zm6 5.6v5.9h4.6c2.1 0 3.4-1.1 3.4-2.9 0-1.9-1.3-3-3.4-3H28Zm0 11v5.9h5.2c2.4 0 3.8-1.1 3.8-2.9 0-1.9-1.4-3-3.8-3H28Z"
  fill="url(#gold)"
/>
<path d="M14 51h36" stroke="url(#gold)" stroke-width="2.6" stroke-linecap="round" opacity="0.9" />
`;

const defs = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#15151b" />
    <stop offset="1" stop-color="${BLACK}" />
  </linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${GOLD_LIGHT}" />
    <stop offset="0.5" stop-color="${GOLD}" />
    <stop offset="1" stop-color="${GOLD_DARK}" />
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${GOLD}" stop-opacity="0.22" />
    <stop offset="1" stop-color="${GOLD}" stop-opacity="0" />
  </radialGradient>
</defs>
`;

/** Icon SVG. `inset` shrinks the mark for maskable variants' safe zone. */
function iconSvg({ padding = 0, radius = 0.22, ring = true }) {
  const scale = 1 - padding * 2;
  const offset = 64 * padding;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    ${defs}
    <rect width="64" height="64" rx="${64 * radius}" fill="url(#bg)" />
    ${ring ? `<rect x="0.75" y="0.75" width="62.5" height="62.5" rx="${64 * radius - 0.75}" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.55" />` : ''}
    <g transform="translate(${offset} ${offset}) scale(${scale})">${MONOGRAM}</g>
  </svg>`;
}

/** The 1200x630 social card: dark showroom, gold rule, wordmark, offer line. */
function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    ${defs}

    <rect width="1200" height="630" fill="${BLACK}" />
    <rect width="1200" height="630" fill="url(#glow)" />

    <!-- Faint perspective grid, matching the hero's showroom floor. -->
    <g stroke="${GOLD}" stroke-width="1" opacity="0.07">
      ${Array.from({ length: 13 }, (_, i) => {
        const y = 330 + i * i * 2.6;
        return `<line x1="0" y1="${y}" x2="1200" y2="${y}" />`;
      }).join('\n      ')}
      ${Array.from({ length: 17 }, (_, i) => {
        const x = i * 80;
        return `<line x1="${x}" y1="330" x2="${600 + (x - 600) * 2.2}" y2="630" />`;
      }).join('\n      ')}
    </g>

    <!-- Wordmark block -->
    <g transform="translate(90 150)">
      <g transform="scale(1.05)">${MONOGRAM}</g>
      <text x="96" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="#ffffff" letter-spacing="0.5">Bahnik My Car</text>
      <text x="98" y="66" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="${GOLD}" letter-spacing="7">LOCATION DE VOITURES</text>
    </g>

    <text x="90" y="360" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="700" fill="#ffffff">Kénitra</text>
    <text x="90" y="432" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="${INK}">À partir de 250 DH / jour</text>

    <line x1="90" y1="486" x2="330" y2="486" stroke="url(#gold)" stroke-width="3" stroke-linecap="round" />
    <text x="90" y="530" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="${GOLD}">Livraison offerte — aéroports et gares</text>

    <!-- WhatsApp pill -->
    <g transform="translate(830 430)">
      <rect x="0" y="0" width="280" height="70" rx="35" fill="#25d366" />
      <text x="140" y="45" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#0b0b0e">WhatsApp</text>
    </g>
    <text x="970" y="545" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${INK}">+212 608 546 900</text>
  </svg>`;
}

await mkdir(join(pub, 'images'), { recursive: true });
await mkdir(join(pub, 'images', 'og'), { recursive: true });

const jobs = [
  ['images/icon.svg', Buffer.from(iconSvg({})), null],
  ['images/icon-180.png', Buffer.from(iconSvg({})), 180],
  ['images/icon-192.png', Buffer.from(iconSvg({})), 192],
  ['images/icon-512.png', Buffer.from(iconSvg({})), 512],
  // Maskable icons need the mark inside the safe circle, so more padding.
  ['images/icon-maskable-512.png', Buffer.from(iconSvg({ padding: 0.12, ring: false })), 512],
  ['images/og/bahnik-my-car.png', Buffer.from(ogSvg()), null],
];

for (const [rel, svg, size] of jobs) {
  let image = sharp(svg);
  if (size) image = image.resize(size, size);
  if (rel.endsWith('.png')) {
    // Flatten onto the brand black so the PNGs have no alpha halo on iOS.
    image = image.flatten({ background: BLACK });
  }
  const out = join(pub, rel);
  await image.toFile(out);
  console.log('wrote', rel);
}

console.log('brand assets done');
