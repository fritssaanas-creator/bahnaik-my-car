export const LANGS = ['fr', 'en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

/** French is the primary language of the site. */
export const DEFAULT_LANG: Lang = 'fr';

export const RTL_LANGS: readonly Lang[] = ['ar'];

export const HTML_LANG: Record<Lang, string> = {
  fr: 'fr-MA',
  en: 'en',
  ar: 'ar-MA',
};

/** BCP-47 tags used for <link rel="alternate" hreflang>. */
export const HREFLANG: Record<Lang, string> = {
  fr: 'fr-MA',
  en: 'en',
  ar: 'ar-MA',
};

/** Open Graph locale codes. */
export const OG_LOCALE: Record<Lang, string> = {
  fr: 'fr_MA',
  en: 'en_US',
  ar: 'ar_MA',
};

export const DIR: Record<Lang, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  en: 'ltr',
  ar: 'rtl',
};

/** Endonyms — always shown in their own script in the language switcher. */
export const LANG_LABEL: Record<Lang, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

/** Short code used in the compact switcher trigger. */
export const LANG_SHORT: Record<Lang, string> = {
  fr: 'FR',
  en: 'EN',
  ar: 'AR',
};

export function isLang(v: string | undefined): v is Lang {
  return !!v && (LANGS as readonly string[]).includes(v);
}

export function dirOf(lang: Lang): 'ltr' | 'rtl' {
  return DIR[lang];
}

/** Pick the right string from a per-language record, falling back to French. */
export function pick<T>(lang: Lang, record: Record<Lang, T>): T {
  return record[lang] ?? record[DEFAULT_LANG];
}
