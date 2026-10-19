import { BUSINESS, SITE, absolute } from '~/data/business';
import { FLEET, FLEET_FROM_PRICE, FLEET_TO_PRICE, fleetSorted, type Vehicle } from '~/data/fleet';
import type { Lang } from '~/i18n/lang';
import { LANGS, OG_LOCALE, HTML_LANG } from '~/i18n/lang';
import { urls } from '~/i18n/routes';

export interface Crumb {
  name: string;
  href: string;
}

/** Root node emitted once per page: who the business is. */
export function organizationSchema(lang: Lang) {
  const city = lang === 'ar' ? 'القنيطرة' : lang === 'en' ? 'Kenitra' : 'Kénitra';
  return {
    '@type': 'LocalBusiness',
    '@id': `${SITE.origin}/#business`,
    name: BUSINESS.name,
    url: absolute(urls.home(lang)),
    image: absolute(SITE.defaultImage),
    logo: absolute('/images/icon.svg'),
        telephone: `+212608546900`,
    currenciesAccepted: BUSINESS.currency,
    // Built from the fleet rather than hardcoded, so it can never drift out of
    // sync with the actual day rates.
    priceRange: `${FLEET_FROM_PRICE}-${FLEET_TO_PRICE} MAD`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.street,
      addressLocality: city,
      addressRegion: 'Kénitra',
      addressCountry: BUSINESS.countryCode,
    },
    areaServed: [
      { '@type': 'City', name: 'Kénitra' },
      { '@type': 'Country', name: 'Morocco' },
    ],
    sameAs: [`https://wa.me/${BUSINESS.whatsappDigits}`, 'https://share.google/ytT4cp5j9NzMtVQ3M'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'reservations',
        // WhatsApp is the only published booking channel.
    telephone: `+212608546900`,
        availableLanguage: LANGS.map((l) => ({ '@type': 'Language', name: HTML_LANG[l] })),
        url: `https://wa.me/${BUSINESS.whatsappDigits}`,
      },
    ],
  };
}

/**
 * `alternates` is optional because a page may legitimately have no
 * translations (a 404). In that case we advertise the site root as the entry
 * point for each language rather than emitting an empty `inLanguageAlt`.
 */
export function websiteSchema(lang: Lang, alternates?: Record<Lang, string>) {
  const targets = alternates ?? Object.fromEntries(LANGS.map((l) => [l, urls.home(l)]));
  return {
    '@type': 'WebSite',
    '@id': `${absolute(urls.home(lang))}#website`,
    url: SITE.origin,
    name: BUSINESS.name,
    inLanguage: HTML_LANG[lang],
    publisher: { '@id': `${SITE.origin}/#business` },
    ...Object.fromEntries(
      LANGS.map((l) => [
        `inLanguageAlt${l.toUpperCase()}`,
        absolute(targets[l]),
      ]),
    ),
  };
}

/** WebSite + Organization graph for every page. */
export function baseGraph(lang: Lang, alternates?: Record<Lang, string>) {
  return [organizationSchema(lang), websiteSchema(lang, alternates)];
}

export function breadcrumbSchema(crumbs: Crumb[], lang: Lang) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absolute(crumbs[crumbs.length - 1]?.href ?? urls.home(lang))}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.href),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function vehicleSchema(v: Vehicle, lang: Lang) {
  return {
    '@type': 'Product',
    '@id': `${absolute(urls.vehicle(lang, v.slug))}#vehicle`,
    name: v.model,
    description: v.pitch[lang],
    image: [absolute(v.image)],
    brand: { '@type': 'Brand', name: v.brand },
    category: lang === 'fr' ? 'Location de voiture' : lang === 'ar' ? 'كراء سيارة' : 'Car rental',
    offers: {
      '@type': 'Offer',
      // A "from" rate is a price specification with a floor, not a fixed price.
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: v.fromPrice,
        priceCurrency: BUSINESS.currency,
        unitCode: 'DAY',
        valueAddedTaxIncluded: false,
      },
      availability: 'https://schema.org/InStock',
      url: absolute(urls.vehicle(lang, v.slug)),
      seller: { '@id': `${SITE.origin}/#business` },
    },
  };
}

/** ItemList of the whole fleet, used on the fleet page. */
export function fleetSchema(lang: Lang) {
  const list = fleetSorted();
  return {
    '@type': 'ItemList',
    '@id': `${absolute(urls.fleet(lang))}#fleet`,
    name:
      lang === 'fr'
        ? 'Flotte de voitures de location à Kénitra'
        : lang === 'ar'
          ? 'أسطول سيارات الكراء بالقنيطرة'
          : 'Car rental fleet in Kenitra',
    numberOfItems: list.length,
    itemListElement: list.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absolute(urls.vehicle(lang, v.slug)),
      name: v.model,
    })),
  };
}

/** A priced offer list — rendered as a table on the fleet page. */
export function offerCatalogSchema(lang: Lang) {
  return {
    '@type': 'OfferCatalog',
    '@id': `${absolute(urls.fleet(lang))}#offers`,
    name: lang === 'fr' ? 'Tarifs journaliers' : lang === 'ar' ? 'الأسعار اليومية' : 'Day rates',
    itemListElement: fleetSorted().map((v) => ({
      '@type': 'Offer',
      name: v.model,
      priceCurrency: BUSINESS.currency,
      price: v.fromPrice,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: v.fromPrice,
        priceCurrency: BUSINESS.currency,
        unitCode: 'DAY',
      },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  lang: Lang;
  keywords?: string[];
}) {
  return {
    '@type': 'BlogPosting',
    '@id': `${absolute(input.url)}#article`,
    headline: input.title,
    description: input.description,
    image: [absolute(input.image ?? SITE.defaultImage)],
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: HTML_LANG[input.lang],
    keywords: input.keywords?.join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(input.url) },
    author: { '@id': `${SITE.origin}/#business` },
    publisher: { '@id': `${SITE.origin}/#business` },
  };
}

export function serviceSchema(lang: Lang) {
  return {
    '@type': 'Service',
    '@id': `${SITE.origin}/#service`,
    name:
      lang === 'fr'
        ? 'Location de voitures sans chauffeur à Kénitra'
        : lang === 'ar'
          ? 'كراء سيارات بدون سائق بالقنيطرة'
          : 'Self-drive car rental in Kenitra',
    serviceType:
      lang === 'fr'
        ? 'Location de voiture sans chauffeur'
        : lang === 'ar'
          ? 'كراء سيارة بدون سائق'
          : 'Self-drive car rental',
    provider: { '@id': `${SITE.origin}/#business` },
    areaServed: [
      { '@type': 'City', name: 'Kénitra' },
      { '@type': 'Country', name: 'Morocco' },
    ],
    offers: FLEET.map((v) => ({
      '@type': 'Offer',
      name: v.model,
      priceCurrency: BUSINESS.currency,
      price: v.fromPrice,
    })),
  };
}

export function ogLocaleOf(lang: Lang) {
  return OG_LOCALE[lang];
}

/** Wrap a graph into the final @graph document. */
export function graph(nodes: unknown[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
