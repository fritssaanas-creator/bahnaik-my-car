import type { Lang } from './lang';
import type { UI } from './ui/types';
import { fr } from './ui/fr';
import { en } from './ui/en';
import { ar } from './ui/ar';

const DICTIONARIES: Record<Lang, UI> = { fr, en, ar };

/** UI strings for a language. Never call with an unvalidated string. */
export function t(lang: Lang): UI {
  return DICTIONARIES[lang] ?? DICTIONARIES.fr;
}

export * from './lang';
export * from './routes';
export type { UI } from './ui/types';
