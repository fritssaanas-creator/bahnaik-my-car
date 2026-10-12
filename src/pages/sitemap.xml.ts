import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LANGS, type Lang } from '~/i18n/lang';
import { urls } from '~/i18n/routes';
import { FLEET } from '~/data/fleet';
import { absolute } from '~/data/business';

type StaticKey = 'home' | 'fleet' | 'kenitra' | 'maroc' | 'mre' | 'blog' | 'contact' | 'faq';

interface Entry {
  /** Path in the language the entry was generated for. */
  path: string;
  /** All language equivalents, as { path, lang } pairs. */
  alternates: { lang: Lang; path: string }[];
  lastmod?: Date;
  changefreq: string;
  priority: string;
}

const STATIC: { key: StaticKey; changefreq: string; priority: string }[] = [
  { key: 'home', changefreq: 'weekly', priority: '1.0' },
  { key: 'fleet', changefreq: 'weekly', priority: '0.9' },
  { key: 'kenitra', changefreq: 'monthly', priority: '0.9' },
  { key: 'maroc', changefreq: 'monthly', priority: '0.8' },
  { key: 'mre', changefreq: 'monthly', priority: '0.8' },
  { key: 'blog', changefreq: 'weekly', priority: '0.7' },
  { key: 'contact', changefreq: 'yearly', priority: '0.6' },
  { key: 'faq', changefreq: 'monthly', priority: '0.6' },
];

const NOW = new Date();

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const entries: Entry[] = [];

  /* One entry per language for the fixed pages, each carrying all three
     alternates so hreflang is expressed in the sitemap as well as the head. */
  for (const lang of LANGS) {
    for (const page of STATIC) {
      entries.push({
        path: urls[page.key](lang),
        alternates: LANGS.map((l) => ({ lang: l, path: urls[page.key](l) })),
        changefreq: page.changefreq,
        priority: page.priority,
      });
    }

    for (const vehicle of FLEET) {
      entries.push({
        path: urls.vehicle(lang, vehicle.slug),
        alternates: LANGS.map((l) => ({ lang: l, path: urls.vehicle(l, vehicle.slug) })),
        changefreq: 'weekly',
        priority: '0.8',
      });
    }

    for (const post of posts.filter((p) => p.data.lang === lang)) {
      // Only advertise alternates that actually exist for this post.
      const alternates = LANGS.flatMap((l) => {
        const exists = posts.some((p) => p.data.slug === post.data.slug && p.data.lang === l);
        return exists ? [{ lang: l, path: urls.post(l, post.data.slug) }] : [];
      });
      entries.push({
        path: urls.post(lang, post.data.slug),
        alternates,
        lastmod: post.data.updated ?? post.data.date,
        changefreq: 'monthly',
        priority: post.data.pillar ? '0.8' : '0.6',
      });
    }
  }

  const body = entries
    .map((entry) => {
      const links = entry.alternates
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${absolute(alt.path)}" />`,
        )
        .join('\n');
      const lastmod = (entry.lastmod ?? NOW).toISOString().slice(0, 10);
      return [
        '  <url>',
        `    <loc>${absolute(entry.path)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        links,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    body,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
