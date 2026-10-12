/** Shape every language dictionary must satisfy. */
export interface UI {
  brand: { name: string; city: string; tagline: string };

  nav: {
    home: string;
    fleet: string;
    kenitra: string;
    maroc: string;
    mre: string;
    blog: string;
    contact: string;
    faq: string;
    menu: string;
    open: string;
    close: string;
    langLabel: string;
    primary: string;
  };

  hero: {
    eyebrow: string;
    /** VIP pill shown above the headline. */
    badge: string;
    title: string;
    /** Substring of `title` painted with the gold gradient, e.g. "à Kénitra". */
    titleAccent: string;
    lead: string;
    cta: string;
    ctaSecondary: string;
    highlights: string[];
  };

  /**
   * The delivery promise. `text` is the full explanation shown in the booking
   * panel; `badge` is the compact form used where there is no room for a
   * paragraph. The two must never say the same thing twice on one page, so each
   * surface picks a different one.
   */
  delivery: {
    title: string;
    text: string;
    badge: string;
    /** Two-line breakdown of what is covered, for the contact panel. */
    points: string[];
  };

  /**
   * Short verified benefits shown in the trust bar between the hero and the
   * fleet. Keyed by benefit rather than by index so the icons in
   * `TrustBar.astro` can never drift out of alignment with the copy.
   */
  trust: {
    items: {
      recent: string;
      delivery: string;
      whatsapp: string;
      local: string;
      deposit: string;
    };
  };

  fleet: {
    eyebrow: string;
    title: string;
    lead: string;
    /**
     * Homepage-only heading and subheading. Kept apart from `title`/`lead`
     * because those double as the `/flotte` `<h1>`, breadcrumb labels and CTA
     * headings on vehicle, service and blog pages — a marketing line like this
     * must not leak into all of those.
     */
    homeTitle: string;
    homeLead: string;
    /** Gold status badge shown under every vehicle name in the catalog grid. */
    modelTag: string;
    cta: string;
    from: string;
    perDay: string;
    reserve: string;
    wa: string;
    specsTitle: string;
    countLabel: string;
    titleSuffix: string;
  };

  /**
   * On-demand luxury inventory. These cars are deliberately NOT in `fleet.ts`:
   * they are sourced per request, so they must never appear as a bookable grid
   * card. This block is the only place they are named, and its `whatsapp` string
   * is the pre-filled message that opens the enquiry.
   */
  vip: {
    eyebrow: string;
    title: string;
    text: string;
    cta: string;
    whatsapp: string;
  };

  why: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  how: {
    eyebrow: string;
    title: string;
    steps: { n: string; title: string; text: string }[];
  };

  faq: { eyebrow: string; title: string; lead: string; cta: string; items: { q: string; a: string }[] };

  blog: {
    eyebrow: string;
    title: string;
    lead: string;
    all: string;
    read: string;
    readMore: string;
    minRead: string;
    empty: string;
  };

  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    whatsapp: string;
    whatsappCta: string;
    address: string;
    note: string;
    hoursNote: string;
    /** Headline for the delivery recap inside the contact panel. */
    deliveryTitle: string;
    deliveryLead: string;
  };

  booking: {
    title: string;
    lead: string;
    vehicle: string;
    vehicleAny: string;
    start: string;
    end: string;
    pickup: string;
    pickupAgency: string;
    pickupAirport: string;
    pickupStation: string;
    pickupOther: string;
    /** Label of the free-text field that asks which airport/station/address. */
    pickupPlace: string;
    /** Placeholder for that field when the airport option is chosen. */
    pickupAirportHint: string;
    /** Placeholder for that field when the station option is chosen. */
    pickupStationHint: string;
    /** Shown under the form, whatever the option. */
    pickupHint: string;
    /** Validation message when the free-text field is left empty. */
    pickupNeedPlace: string;
    submit: string;
    note: string;
    nights: string;
    invalidRange: string;
    invalidVehicle: string;
    needDates: string;
  };

  vehicle: {
    back: string;
    specsTitle: string;
    from: string;
    perDay: string;
    book: string;
    wa: string;
    related: string;
    bestFor: string;
    overview: string;
    priceNote: string;
    cautionNote: string;
    specs: Record<string, string>;
  };

  footer: {
    tagline: string;
    navTitle: string;
    explore: string;
    rights: string;
    city: string;
  };

  misc: {
    breadcrumbHome: string;
    backHome: string;
    notFoundTitle: string;
    notFoundText: string;
    relatedLabel: string;
    skip: string;
  };
}
