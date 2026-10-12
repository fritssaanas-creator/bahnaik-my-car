import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';
import { LANGS, type Lang } from '~/i18n/lang';
import { urls } from '~/i18n/routes';

export type Post = CollectionEntry<'blog'>;

export function isPost(entry: { data: { lang: string } }, lang: Lang): boolean {
  return entry.data.lang === lang;
}

/** All posts for a language, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('blog');
  return all
    .filter((p) => p.data.lang === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Distinct post slugs that exist in at least one language. */
export async function getPostSlugs(): Promise<string[]> {
  const all = await getCollection('blog');
  return [...new Set(all.map((p) => p.data.slug))];
}

export async function getPost(slug: string, lang: Lang): Promise<Post | undefined> {
  const all = await getCollection('blog');
  return all.find((p) => p.data.slug === slug && p.data.lang === lang);
}

/**
 * Same article in every language, falling back to French when a translation
 * does not exist yet — the switcher then links to the language that does.
 */
export async function getPostAlternates(
  slug: string,
): Promise<Record<Lang, string | undefined>> {
  const all = await getCollection('blog');
  const out = {} as Record<Lang, string | undefined>;
  for (const lang of LANGS) {
    const found = all.find((p) => p.data.slug === slug && p.data.lang === lang);
    out[lang] = found ? urls.post(lang, slug) : undefined;
  }
  return out;
}

/** Pillar posts first, then most recent — the shape the hub page wants. */
export async function getBlogIndex(lang: Lang): Promise<{ pillars: Post[]; rest: Post[] }> {
  const posts = await getPosts(lang);
  return {
    pillars: posts.filter((p) => p.data.pillar),
    rest: posts.filter((p) => !p.data.pillar),
  };
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  if (!post.data.related.length) return [];
  const all = await getCollection('blog');
  const slugs = post.data.related;
  return all
    .filter((p) => p.data.lang === post.data.lang && slugs.includes(p.data.slug))
    .slice(0, limit);
}

export { render, getEntry };

/** Rough reading time in minutes, floored at 1. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-GB' : 'fr-MA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}
