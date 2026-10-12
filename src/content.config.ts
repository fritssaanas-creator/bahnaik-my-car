import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts live as one Markdown file per post *per language*
 * (`<slug>.<lang>.md`). Each file is a genuine translation rather than a
 * machine swap, and the shared `slug` field is what ties the three together
 * so hreflang and the language switcher land on the equivalent article.
 */
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
    // Astro lifts a `slug` field out of frontmatter and uses it as the entry
    // id, which would collide across the three translations of a post. Pin the
    // id to the filename instead (which already carries the slug and language)
    // so `data.slug` stays free to mean "the shared, language-independent key".
    generateId: ({ entry }) =>
      entry.split('/').pop()!.replace(/\.(md|mdx)$/, ''),
  }),
  schema: z.object({
    /** Language-independent identifier shared by all three files. */
    slug: z.string(),
    lang: z.enum(['fr', 'en', 'ar']),
    title: z.string(),
    /** 150–160 characters, written for the SERP snippet. */
    description: z.string(),
    /** Short teaser used on cards and at the top of the post. */
    excerpt: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** Pillar articles are the topical hubs; the rest support them. */
    pillar: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    /** Slugs of other posts to link to — builds the internal mesh. */
    related: z.array(z.string()).default([]),
    /** Vehicle slugs to link to, so articles feed the booking pages. */
    vehicles: z.array(z.string()).default([]),
    /**
     * Question/answer pairs rendered on the page *and* emitted as FAQPage
     * structured data from this single field. Holding both in one place is what
     * stops the answer a reader sees and the answer Google indexes from
     * drifting apart, which is what voids a rich result.
     */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /**
     * Append the on-demand luxury CTA. Used by the articles that target
     * high-intent luxury searches, where the reader wants a car we do not list
     * in the grid.
     */
    vip: z.boolean().default(false),
  }),
});

export const collections = { blog };
