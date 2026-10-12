/**
 * Content QA — catches the classes of corruption that are invisible in a
 * terminal but ship to production: mixed-script strings, Unicode replacement
 * characters, stray ASCII words inside Arabic copy, and the banned figures.
 *
 * Run: node scripts/check-content.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['src', 'scripts'];
/** The checker itself contains the patterns it looks for. */
const SELF = path.join(ROOT, 'scripts', 'check-content.mjs');

const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const LATIN = /[A-Za-z]/;

/** Terms that legitimately appear in Latin inside Arabic copy. */
const AR_ALLOWED = new Set([
  'bahnik',
  'my',
  'car',
  'whatsapp',
  'caution',
  'mre',
  'mad',
  'dh',
  'km',
]);

/**
 * Shapes that are legitimately Latin inside Arabic copy even though they are not
 * brand names: motorway and national-road designations (A1, N13, E611). These
 * are official signage, so transliterating them would be wrong, not helpful.
 */
const AR_ALLOWED_SHAPES = [/^[AE]\d{1,3}$/, /^N\d{1,3}$/];

/** True when every Latin word in `words` is an allowed term or shape. */
function latinAllowed(words) {
  return words.every(
    (w) =>
      AR_ALLOWED.has(w.toLowerCase()) ||
      AR_ALLOWED_SHAPES.some((re) => re.test(w)),
  );
}

/** Figures that must never appear anywhere in the content. */
const BANNED = [
  { re: /\b4000\s*(dh|dirham|درهم|dh)\b/i, why: 'banned deposit figure (4000 DH)' },
  { re: /\b\d+\s*(avis|reviews?|étoiles|stars?)\b/i, why: 'invented review/rating claim' },
];

/**
 * The site never states how many cars it has. A count goes stale the moment a
 * vehicle is added, and it frames a growing fleet as a small one — so the number
 * is banned outright rather than merely discouraged. `sept`/`seven` for a week
 * of hire is a normal phrase, hence the required unit.
 */
const FLEET_COUNT = [
  {
    re: /\b(six|sept|seventh|sixth|huit|eight|neuf|nine)\s+(voitures?|véhicules?|cars?|vehicles?|seats?)\b/i,
    why: 'fleet-size claim (say what the car is for, not how many there are)',
  },
  {
    re: /\b(ست|سبع|سبتة|ثماني|تسع)\s+(سيارات?|سيارتين|مركبات?)\b/,
    why: 'fleet-size claim in Arabic',
  },
  {
    re: /\b(only|just)\s+(six|seven|\d+)\s+(cars?|vehicles?)\b/i,
    why: 'fleet-size claim',
  },
  {
    re: /\b(all|every)\s+(the\s+)?(six|seven)\s+(cars?|vehicles?)\b/i,
    why: 'fleet-size claim',
  },
];

/**
 * Delivery is free to any airport and any train station in Morocco. Copy that
 * promises Kénitra and never mentions a terminal is not wrong, it is incomplete,
 * and it quietly caps where people think the offer applies.
 */
/**
 * A delivery promise *scoped to Kénitra by a preposition*, not merely a string
 * that happens to contain both words. "Livraison offerte à Kénitra" caps the
 * offer at one city and must be fixed; "Location voiture Kénitra — Livraison
 * offerte" is a title listing two separate facts and must not be. The
 * preposition is the only thing that tells them apart, so it is required.
 * Arabic attaches its prepositions as prefixes and allows the adjective to come
 * after the city ("التوصيل بالقنيطرة مجانا"), hence the gap there.
 */
const DELIVERY_CLAIM = new RegExp(
  [
    // French: la livraison offerte à Kénitra
    'livraison\\s+(?:offerte|gratuite)\\s*(?:[,;–—]\\s*)?(?:à|a|de|au|aux)\\s*k[ée]nitra',
    // English: free delivery in Kenitra
    'free\\s+(?:delivery|pick-?up)\\s*(?:[,;–—]\\s*)?(?:in|to|at|around|within)\\s*kenitra',
    // Arabic: توصيل / التوصيل ... بالقنيطرة. No \b: Arabic letters are not
    // \w in JavaScript, so a word boundary after them can never match.
    '(?:التوصيل|توصيل)[^.\\n]{0,30}(?:بالقنيطرة|للقنيطرة|إلى\\s*القنيطرة|في\\s*القنيطرة)',
  ].join('|'),
  'i',
);
const DELIVERY_TERMINAL =
  /airports?|a[ée]roports?|gares?|stations?|terminals?|مطار|مطارات|محطة|محطات/i;

/**
 * Collapses the file into blank-line-separated blocks, keeping the source line
 * number of each block's first line. Markdown wraps prose at ~80 columns, and a
 * consecutive bullet list is a single block, which is exactly the granularity a
 * scope claim is written at.
 */
function paragraphs(src) {
  const out = [];
  let line = 1;
  let buf = [];
  const flush = () => {
    if (buf.length) out.push({ line, text: buf.join(' ') });
    buf = [];
  };
  for (const l of src.split(/\r?\n/)) {
    if (!l.trim()) flush();
    else buf.push(l.trim());
    line++;
  }
  flush();
  return out;
}

/** Returns a reason string when a line promises free delivery only to Kénitra. */
function staleDelivery(line) {
  if (!/k[ée]nitra|قنيطرة/i.test(line)) return null;
  if (!DELIVERY_CLAIM.test(line)) return null;
  if (DELIVERY_TERMINAL.test(line)) return null;
  return 'stale delivery scope (Kenitra only) — mention airports and train stations';
}

/** Every hard ban, scanned against every line of every file. */
const BANS = [...BANNED, ...FLEET_COUNT];

/**
 * English words that have no business in French copy. Generated content keeps
 * leaking these in ("un Mirror cassé", "frais de cleaning"), and they are
 * invisible when skimming. Only applied to `.fr.md` bodies, after frontmatter
 * and link targets are stripped.
 */
const ENGLISH_IN_FRENCH = [
  'pickup', 'drop-off', 'dropoff', 'shuttle', 'mirror', 'damage', 'damaged',
  'fault', 'fee', 'fees', 'main street', 'needed', 'nights', 'weekend',
  'check', 'checkout', 'rent', 'rental', 'booking', 'customer', 'customers',
  'staff', 'manager', 'price', 'prices', 'cheap', 'cheapest', 'review',
  'reviews', 'rating', 'ratings', 'airport', 'delivery', 'insurance',
  'deposit', 'license', 'licence', 'driving', 'highway', 'motorway', 'parking',
  // False friends and leftover anglicisms seen in generated French copy.
  'five', 'well', 'supplement', 'cleaning', 'young driver', 'the', 'and',
  'whatever', 'whenever', 'wherever', 'however',
];

/**
 * Words that are French but are almost always a mistake in this project:
 * Latin-script leftovers or typos that survive review. Kept separate from the
 * English list because they are not English, they are just wrong.
 */
const LATIN_TYPOS = [
  'RAlors', 'kmeter', 'Payment', 'paiement', 'vedicule', 'vehicule',
];

/** Arabic punctuation and tatweel are not letters. */
const ARABIC_NON_LETTER = new Set([
  '؍', '؎', '؏', 'ؐ', 'ؑ', 'ؒ', '،', 'ؓ', 'ؔ', 'ؕ', 'ؖ', 'ؗ', 'ؘ',
  '؟', '،', '۔', 'ـ', '۟',
]);

/**
 * Scripts that must never appear glued into Latin copy. A stray Cyrillic
 * character inside a French word ("фарукtionnement") or a CJK fragment in an
 * English sentence is invisible when reading the source, and ships to
 * production. This is the single most common corruption seen in generated
 * content, so it gets its own rule.
 */
const CYRILLIC = /[\u0400-\u04FF\u0500-\u052F]/;
const CJK = /[\u3000-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;
const HANGUL = /[\uAC00-\uD7AF\u1100-\u11FF]/;
const DEVANAGARI = /[\u0900-\u097F]/;
const THAI = /[\u0E00-\u0E7F]/;

const FOREIGN = [
  [CYRILLIC, 'Cyrillic'],
  [CJK, 'CJK'],
  [HANGUL, 'Hangul'],
  [DEVANAGARI, 'Devanagari'],
  [THAI, 'Thai'],
];

function isArabicLetter(ch) {
  return ARABIC.test(ch) && !ARABIC_NON_LETTER.has(ch);
}

/** True when a Latin letter sits directly against an Arabic letter. */
function weldedScripts(value) {
  for (let i = 1; i < value.length; i++) {
    const a = value[i - 1];
    const b = value[i];
    if (LATIN.test(a) && isArabicLetter(b)) return true;
    if (isArabicLetter(a) && LATIN.test(b)) return true;
  }
  return false;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx|js|mjs|astro|md|mdx|json|css)$/.test(entry.name)) yield full;
  }
}

const problems = [];

/** Inspect every single-quoted or double-quoted string literal in the source. */
const STRING_RE = /(['"`])((?:\\.|(?!\1)[^\\\r\n])*)\1/g;

for (const dir of DIRS) {
  for await (const file of walk(path.join(ROOT, dir))) {
    if (file === SELF) continue;
    const rel = path.relative(ROOT, file);
    const src = await readFile(file, 'utf8');
    const lines = src.split(/\r?\n/);

    if (src.includes('�')) {
      lines.forEach((l, i) => {
        if (l.includes('�')) problems.push(`${rel}:${i + 1} U+FFFD replacement character`);
      });
    }

    // Whole-line scan. String-literal inspection below only covers quoted copy,
    // so Markdown prose and template text need their own pass or foreign
    // characters sail straight through.
    for (const [re, name] of FOREIGN) {
      lines.forEach((l, i) => {
        if (re.test(l)) {
          problems.push(`${rel}:${i + 1} ${name} character in file -> ${l.trim().slice(0, 80)}`);
        }
      });
    }

    // Track YAML frontmatter so its keys and the slugs in `related:`/`tags:`
    // are not mistaken for corrupted prose. The prose fields inside it are
    // still checked, because `description` and `title` are user-facing copy
    // and the most common place for a stray foreign word to survive.
    let inFrontmatter = false;
    const frontmatter = {};

    lines.forEach((line, i) => {
      if (/\.(md|mdx)$/.test(file)) {
        if (i === 0 && line.trim() === '---') {
          inFrontmatter = true;
          return;
        }
        if (inFrontmatter) {
          if (line.trim() === '---') {
            inFrontmatter = false;
          } else {
            const m = line.match(/^(title|description|excerpt):\s*"?(.+?)"?\s*$/);
            if (m) frontmatter[m[1]] = { value: m[2], line: i + 1 };
          }
          return;
        }

        // Strip Markdown link targets, which are always Latin paths.
        const prose = line.replace(/\]\([^)]*\)/g, ']');
        const inArabic = ARABIC.test(prose);

        if (inArabic) {
          const words = prose.match(/[A-Za-z][A-Za-z0-9']*/g) ?? [];
          const bad = words.filter((w) => !latinAllowed([w]));
          if (bad.length) {
            problems.push(
              `${rel}:${i + 1} Latin text inside Arabic prose: ${[...new Set(bad)].join(', ')}`,
            );
          }
        }
        if (weldedScripts(prose)) {
          problems.push(`${rel}:${i + 1} unspaced mixed script in prose`);
        }

        // English leaking into French copy.
        if (/\.fr\.md$/.test(file)) {
          const lower = prose.toLowerCase();
          const found = ENGLISH_IN_FRENCH.filter((w) =>
            new RegExp(`\\b${w}\\b`).test(lower),
          );
          if (found.length) {
            problems.push(
              `${rel}:${i + 1} English word(s) in French copy: ${found.join(', ')}`,
            );
          }
        }
      }
    });

    // Scope-sensitive bans run over paragraphs, not lines. Prose is hard-wrapped,
    // so a sentence like "free delivery in Kenitra, at any airport and at any
    // train / station" splits across two lines and a line-level match both misses
    // the qualifier and reports a false positive.
    for (const p of paragraphs(src)) {
      for (const { re, why } of BANS) {
        if (re.test(p.text)) {
          problems.push(`${rel}:${p.line} ${why} -> ${p.text.slice(0, 90)}`);
        }
      }
      // Delivery scope is a property of a *sentence*, so in Markdown the whole
      // paragraph is the unit. In code it is not: a dictionary holds sibling
      // values that are independent facts, and reading `delivery: 'Free
      // delivery'` next to `local: 'Service in Kenitra'` as one claim would
      // flag a list of separate benefits. Code copy is checked per string
      // literal further down instead.
      if (/\.(md|mdx)$/.test(file)) {
        const why = staleDelivery(p.text);
        if (why) problems.push(`${rel}:${p.line} ${why} -> ${p.text.slice(0, 90)}`);
      }
    }

    // Frontmatter copy gets the same English-in-French treatment as the body,
    // plus a length check: Google truncates meta descriptions past roughly
    // 160 characters, so a longer one wastes the sentence it was meant to use.
    if (/\.fr\.md$/.test(file)) {
      for (const key of ['title', 'description', 'excerpt']) {
        const field = frontmatter[key];
        if (!field) continue;
        const found = ENGLISH_IN_FRENCH.filter((w) =>
          new RegExp(`\\b${w}\\b`).test(field.value.toLowerCase()),
        );
        if (found.length) {
          problems.push(
            `${rel}:${field.line} English word(s) in ${key}: ${found.join(', ')}`,
          );
        }
      }
    }
    const desc = frontmatter.description;
    if (desc && (desc.value.length < 70 || desc.value.length > 175)) {
      problems.push(
        `${rel}:${desc.line} description is ${desc.value.length} chars (aim for 120-160)`,
      );
    }

    lines.forEach((line, i) => {
      for (const m of line.matchAll(STRING_RE)) {
        // Drop ${...} interpolations: they are code, not copy.
        const value = m[2].replace(/\$\{[^}]*\}/g, ' ');
        if (!value || value.length < 2) continue;
        if (ARABIC.test(value) && LATIN.test(value)) {
          // Every Latin run must be an allowed term (brand, unit, product name).
          const words = value.match(/[A-Za-z][A-Za-z0-9']*/g) ?? [];
          const bad = words.filter((w) => !latinAllowed([w]));
          if (bad.length) {
            problems.push(
              `${rel}:${i + 1} Latin text inside Arabic string: ${[...new Set(bad)].join(', ')}`,
            );
          }
        }
        // Adjacent Latin letter + Arabic *letter* means two words were welded
        // together. Arabic punctuation (، ؛ ؟ ۔) after a brand name is fine.
        if (weldedScripts(value)) {
          problems.push(`${rel}:${i + 1} unspaced mixed script in string`);
        }
        // A non-Latin, non-Arabic script can only be corruption here: this
        // project ships French, English and Arabic and nothing else.
        for (const [re, name] of FOREIGN) {
          if (re.test(value)) {
            problems.push(
              `${rel}:${i + 1} ${name} character in copy -> ${value.trim().slice(0, 80)}`,
            );
          }
        }
        // One string literal is one independent piece of copy, so the delivery
        // scope claim has to hold within it. This is what catches a meta
        // description promising Kénitra only, without flagging the dictionary
        // that lists free delivery and Kenitra service as two separate items.
        if (!/\.(md|mdx)$/.test(file)) {
          const why = staleDelivery(value);
          if (why) {
            problems.push(`${rel}:${i + 1} ${why} -> ${value.trim().slice(0, 90)}`);
          }
        }
      }
    });
  }
}

if (problems.length) {
  console.error(`\n✗ ${problems.length} content problem(s):\n`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('✓ content check passed — no mixed script, no replacement chars, no banned figures');
