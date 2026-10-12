import type { Lang } from './lang';

/**
 * Localised URL segments.
 *
 * French is the primary language, so French slugs are the canonical ones and
 * the other languages get their own equivalents. Arabic deliberately uses
 * ASCII segments: they stay readable in hreflang/canonical output, avoid
 * percent-encoding pitfalls in sitemaps and share links, and Google indexes
 * them identically to Latin slugs.
 */
export const SEG = {
  fleet: { fr: 'flotte', en: 'fleet', ar: 'fleet' },
  vehicle: { fr: 'vehicule', en: 'car', ar: 'vehicle' },
  kenitra: {
    fr: 'location-voiture-kenitra',
    en: 'car-rental-kenitra',
    ar: 'kenitra-car-rental',
  },
  maroc: {
    fr: 'location-voiture-maroc',
    en: 'car-rental-morocco',
    ar: 'morocco-car-rental',
  },
  mre: { fr: 'mre', en: 'mre', ar: 'mre' },
  blog: { fr: 'blog', en: 'blog', ar: 'blog' },
  contact: { fr: 'contact', en: 'contact', ar: 'contact' },
  faq: { fr: 'faq', en: 'faq', ar: 'faq' },
} as const satisfies Record<string, Record<Lang, string>>;

/** Build a clean, trailing-slash-free path for a language. */
export function pathFor(lang: Lang, ...segments: string[]): string {
  const clean = segments.map((s) => s.replace(/^\/+|\/+$/g, '')).filter(Boolean);
  return clean.length ? `/${lang}/${clean.join('/')}` : `/${lang}`;
}

export const urls = {
  home: (l: Lang) => pathFor(l),
  fleet: (l: Lang) => pathFor(l, SEG.fleet[l]),
  vehicle: (l: Lang, slug: string) => pathFor(l, SEG.vehicle[l], slug),
  kenitra: (l: Lang) => pathFor(l, SEG.kenitra[l]),
  maroc: (l: Lang) => pathFor(l, SEG.maroc[l]),
  mre: (l: Lang) => pathFor(l, SEG.mre[l]),
  blog: (l: Lang) => pathFor(l, SEG.blog[l]),
  post: (l: Lang, slug: string) => pathFor(l, SEG.blog[l], slug),
  contact: (l: Lang) => pathFor(l, SEG.contact[l]),
  faq: (l: Lang) => pathFor(l, SEG.faq[l]),
} as const;
