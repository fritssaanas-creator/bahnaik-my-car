/**
 * Verified business information only.
 * Nothing here may be invented: no reviews, ratings, opening hours,
 * certifications, guarantees, awards or partnerships.
 *
 * The one forward-looking claim the site does make is the delivery promise
 * below, and it is stated with its own conditions attached.
 */
export const BUSINESS = {
  name: 'Bahnaik My Car',
  legalName: 'Bahnaik My Car',
  street: "RESIDENCE YOUSSEF AV MOULAY SLIMANE APT 3",
  city: 'Kénitra',
  cityLatin: 'Kenitra',
  region: 'Kénitra',
  country: 'Maroc',
  countryCode: 'MA',
  /** Full postal address used in schema.org and the contact block. */
  address: "RESIDENCE YOUSSEF AV MOULAY SLIMANE APT 3, KENITRA, MAROC",
  /** E.164 digits only — used to build wa.me links. */
  whatsappDigits: '212608546900',
  /** Human readable, spaces for display. */
  whatsappDisplay: '0608 54 69 00',
  whatsappLabel: 'WhatsApp',
  currency: 'MAD',
  currencyLabel: 'DH',
  /**
   * Delivery promise. Kénitra city is covered outright; beyond it, delivery to
   * any airport or train station in Morocco is offered free of charge, and any
   * other address is handled on request. Every case is still confirmed over
   * WhatsApp before the booking is closed, so the site never promises a slot it
   * has not agreed.
   */
  delivery: {
    /** Free as standard, no distance condition. */
    freeCity: 'Kénitra',
    /** Free on top of the city, as a standing offer. */
    freeAirports: true,
    freeRailStations: true,
    /** Anything else: possible, agreed case by case. */
    otherAddresses: 'onRequest',
    /** Shown wherever the free-delivery promise appears. */
    note: 'Kénitra, airports and train stations',
  },
  /** No opening hours are published — the site directs everything to WhatsApp. */
  contactChannel: 'whatsapp',
} as const;

export const SITE = {
  /** Canonical origin. Update together with astro.config.mjs `site`. */
  origin: 'https://www.bahnikmycar.com',
  name: BUSINESS.name,
  shortName: 'Bahnaik My Car',
  themeColor: '#0b0b0e',
  gold: '#d4af37',
  defaultImage: '/images/og/bahnik-my-car.png',
  locale: 'fr-MA',
} as const;

export function waLink(text: string): string {
  return `https://wa.me/${BUSINESS.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

export function absolute(pathname: string): string {
  return new URL(pathname, SITE.origin).toString();
}
