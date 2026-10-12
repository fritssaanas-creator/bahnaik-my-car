import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Post-build verification of the things a type-checker cannot see: that every
 * hreflang alternate actually resolves to a built file, that internal links
 * point at pages that exist, and that the sitemap agrees with what was built.
 *
 * Run after `npm run build`.
 */

const DIST = fileURLToPath(new URL('../dist/', import.meta.url)).replace(/[\\/]+$/, '');
const problems = [];
const notes = [];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));

/** Reduce an absolute or relative href to the built-file path it must resolve to. */
function builtPathFor(href) {
  const raw = decodeURIComponent(href.split('#')[0].split('?')[0]);
  const pathname = raw.startsWith('http') ? new URL(raw).pathname : raw;
  const rel = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(DIST, rel, 'index.html');
}

/** True when the built output contains a page that this href would serve. */
function routeExists(href) {
  return files.includes(builtPathFor(href));
}

const relOf = (file) => '/' + path.relative(DIST, file).split(path.sep).join('/');

const ORIGIN = 'https://www.bahnikmycar.com';
const ALTERNATE = /<link[^>]+rel="alternate"[^>]+hreflang="([a-zA-Z-]+)"[^>]+href="([^"]+)"/g;
const CANONICAL = /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g;

let alternateCount = 0;
let canonicalCount = 0;
const alternatesSeen = new Set();

for (const file of html) {
  const src = fs.readFileSync(file, 'utf8');
  const rel = relOf(file);
  const isNoindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(src);

  for (const m of src.matchAll(CANONICAL)) {
    canonicalCount++;
    const href = m[1];
    if (!href.startsWith(ORIGIN)) {
      problems.push(`${rel}: canonical off-origin -> ${href}`);
    }
  }

  for (const m of src.matchAll(ALTERNATE)) {
    alternateCount++;
    const [, lang, href] = m;
    const url = href.startsWith('http') ? href : `${ORIGIN}${href}`;
    alternatesSeen.add(`${rel}|${lang}`);
    if (!url.startsWith(ORIGIN)) {
      problems.push(`${rel}: hreflang ${lang} off-origin -> ${href}`);
      continue;
    }
    if (isNoindex) continue;
    if (!routeExists(url)) {
      problems.push(`${rel}: hreflang ${lang} has no built page -> ${href}`);
    }
  }

  // Internal navigation links must resolve. The site is built with
  // `trailingSlash: 'never'`, so a page URL has no trailing slash and is
  // served from `<path>/index.html`.
  for (const m of src.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    // Files copied verbatim from public/ keep their own name.
    if (/\.[a-z0-9]+$/i.test(href)) {
      if (!files.includes(path.join(DIST, href.replace(/^\/+/, '')))) {
        problems.push(`${rel}: missing asset -> ${href}`);
      }
      continue;
    }
    if (!routeExists(href)) {
      problems.push(`${rel}: dead internal link -> ${href}`);
    }
  }

  // A translated page must never point its own canonical at another language.
  const canon = src.match(CANONICAL)?.[1];
  const selfLang = rel.split('/')[1];
  if (canon && selfLang && selfLang !== '404' && !canon.includes(`/${selfLang}/`)) {
    problems.push(`${rel}: canonical ${canon} does not match its language directory`);
  }
}

notes.push(`${html.length} HTML pages, ${canonicalCount} canonical tags, ${alternateCount} hreflang tags`);

// Sitemap agreement.
const sitemapFile = files.find((f) => f.endsWith('sitemap.xml'));
if (sitemapFile) {
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  notes.push(`sitemap lists ${locs.length} URLs`);
  for (const loc of locs) {
    if (!loc.startsWith(ORIGIN)) problems.push(`sitemap: off-origin URL -> ${loc}`);
    if (!routeExists(loc)) problems.push(`sitemap: URL has no built page -> ${loc}`);
  }
  // Anything indexable that is not in the sitemap is a missed opportunity.
  // Both sides are normalised to `<path>/index.html` so trailing-slash policy
  // cannot produce a false mismatch.
  const listed = new Set(locs.map((l) => builtPathFor(l)));
  for (const file of html) {
    const src = fs.readFileSync(file, 'utf8');
    if (/noindex/i.test(src)) continue;
    if (!listed.has(file)) problems.push(`sitemap: missing ${relOf(file)}`);
  }
} else {
  problems.push('sitemap.xml was not generated');
}

const robotsFile = files.find((f) => f.endsWith('robots.txt'));
if (!robotsFile) problems.push('robots.txt was not generated');
else if (!fs.readFileSync(robotsFile, 'utf8').includes('/sitemap.xml')) {
  problems.push('robots.txt does not reference the sitemap');
}

for (const n of notes) console.log(`  ${n}`);
if (problems.length) {
  console.log(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems) console.log(`  ${p}`);
  process.exit(1);
}
console.log('\n✓ build verification passed — links, hreflang, canonicals and sitemap all agree');
