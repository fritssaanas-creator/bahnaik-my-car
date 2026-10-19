import type { Lang } from '~/i18n/lang';
import { BUSINESS, SITE } from '~/data/business';
import { FLEET_FROM_PRICE, type Vehicle } from '~/data/fleet';

const city = { fr: 'Kénitra', en: 'Kenitra', ar: 'القنيطرة' } as const;

export interface Meta {
  title: string;
  description: string;
  /** Extra images for social, relative to the origin. */
  image?: string;
  /** Keep a page out of the index (404). */
  noindex?: boolean;
}

const FROM = `${FLEET_FROM_PRICE} ${BUSINESS.currencyLabel}`;


/* ------------------------------------------------------------------ *
 * Per-language page metadata.
 *
 * French is the primary language and carries the fullest keyword coverage;
 * English and Arabic are genuine equivalents, not translations of a keyword
 * list. Every description stays inside the 150–160 character window that
 * Google renders without truncation.
 * ------------------------------------------------------------------ */
export const META = {
  home: {
    fr: {
      title: `Location de voitures à ${city.fr} — Livraison offerte | Bahnaik My Car`,
      description: `Location de voitures à Kénitra dès ${FROM}/jour. Livraison offerte à Kénitra, dans tous les aéroports et gares du Maroc. Réservation WhatsApp.`,
    },
    en: {
      title: `Car rental in ${city.en} — Free delivery | Bahnaik My Car`,
      description: `Car rental in Kenitra from ${FROM}/day. Free delivery in Kenitra, at any airport or train station in Morocco. Book on WhatsApp.`,
    },
    ar: {
      title: `كراء السيارات بالقنيطرة — توصيل مجاني | Bahnaik My Car`,
      description: `كراء السيارات بالقنيطرة ابتداء من ${FROM} لليوم. توصيل مجاني بالقنيطرة وفي كل المطارات ومحطات القطار بالمغرب. حجز عبر واتساب.`,
    },
  },

  fleet: {
    fr: {
      title: `Location voiture Kénitra — Flotte et tarifs | Bahnaik My Car`,
      description: `Location de voitures à Kénitra : Dacia Sandero et Logan, Renault Clio 5, Peugeot 208, Opel Corsa, Hyundai i20. Tarifs clairs, livraison offerte dans tous les aéroports et gares du Maroc.`,
    },
    en: {
      title: `Car rental Kenitra — Fleet and rates | Bahnaik My Car`,
      description: `Our Kenitra rental fleet: Dacia Sandero and Logan, Renault Clio 5, Peugeot 208, Opel Corsa, Hyundai i20. Clear rates, free delivery to every airport and train station.`,
    },
    ar: {
      title: `كراء السيارات بالقنيطرة — الأسطول والأسعار | Bahnaik My Car`,
      description: `أسطول كراء السيارات بالقنيطرة: داسيا سانديرو ولوقان، رينو كليو 5، بيجو 208، أوبل كورسا، هيونداي آي 20. أسعار واضحة وتوصيل مجاني إلى المطارات والمحطات.`,
    },
  },

  kenitra: {
    fr: {
      title: `Location voiture Kénitra — Agence sans chauffeur | Bahnaik My Car`,
      description: `Location voiture pas cher à Kénitra : des voitures récentes sans chauffeur dès ${FROM}/jour. Livraison offerte à Kénitra, dans tous les aéroports et gares du Maroc.`,
    },
    en: {
      title: `Car rental Kenitra — Self-drive agency | Bahnaik My Car`,
      description: `Cheap car rental in Kenitra: recent self-drive cars from ${FROM}/day. Free delivery in Kenitra, at every airport and train station in Morocco.`,
    },
    ar: {
      title: `كراء السيارات بالقنيطرة — وكالة بدون سائق | Bahnaik My Car`,
      description: `كراء سيارات بسعر مناسب بالقنيطرة: سيارات حديثة بدون سائق ابتداء من ${FROM} لليوم، مع توصيل مجاني بالقنيطرة وإلى كل مطار ومحطة قطار بالمغرب.`,
    },
  },

  maroc: {
    fr: {
      title: `Location voiture Maroc — Vacation car rental | Bahnaik My Car`,
      description: `Location de voiture au Maroc : réservation claire, livraison offerte dans tous les aéroports et gares, accompagnement WhatsApp avant et pendant le séjour.`,
    },
    en: {
      title: `Car rental Morocco — Holiday car hire | Bahnaik My Car`,
      description: `Car rental in Morocco: clear booking, free delivery to any airport or train station, WhatsApp support before and during your stay.`,
    },
    ar: {
      title: `كراء السيارات بالمغرب — سيارات لعطلة مريحة | Bahnaik My Car`,
      description:
        'اكترت سيارة حديثة بدون سائق بالمغرب لعطلك: حجز واضح، توصيل مجاني في كل المطارات ومحطات القطار، ومرافقة عبر واتساب قبل إقامتك وأثناءها.',
    },
  },

  mre: {
    fr: {
      title: `Location voiture Maroc MRE — Kénitra, desde France, Belgique ou Espagne`,
      description: `Vous rentrez au Maroc depuis l'Europe ? Location de voiture à Kénitra pour les MRE : réservation par WhatsApp, livraison à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Car rental Morocco for the diaspora — Kenitra, from France, Belgium or Spain`,
      description: `Coming back to Morocco from Europe? Rent a car in Kenitra: WhatsApp booking and free delivery to your airport or train station in Morocco.`,
    },
    ar: {
      title: `كراء السيارات بالمغرب للجالية — القنيطرة، من فرنسا وبلجيكا وإسبانيا`,
      description: `تعيش في أوروبا وعائد إلى المغرب؟ كراء سيارة بالقنيطرة: حجز عبر واتساب، وتوصيل مجاني إلى المطار أو محطة القطار، وأسعار واضحة بالدرهم.`,
    },
  },

  blog: {
    fr: {
      title: `Blog — Location de voiture au Maroc et à Kénitra | Bahnaik My Car`,
      description: `Conseils pratiques pour louer une voiture au Maroc : préparer son séjour, choisir sa voiture, récupérer la voiture à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Blog — Car rental in Morocco and Kenitra | Bahnaik My Car`,
      description: `Practical advice on renting a car in Morocco: planning your stay, choosing the right car, and collecting it at an airport or train station.`,
    },
    ar: {
      title: `المدونة — كراء السيارات بالمغرب وبالقنيطرة | Bahnaik My Car`,
      description: `نصائح عملية لكراء سيارة بالمغرب: تحضير إقامتك، اختيار السيارة المناسبة، واستلامها من المطار أو محطة القطار، وشروط الكراء التي يجب معرفتها.`,
    },
  },

  faq: {
    fr: {
      title: `Questions fréquentes — Location voiture Kénitra | Bahnaik My Car`,
      description: `Caution, livraison, tarifs, réservation : les réponses aux questions fréquentes sur la location de voitures à Kénitra et la livraison au Maroc.`,
    },
    en: {
      title: `FAQ — Car rental in Kenitra | Bahnaik My Car`,
      description: `Deposit, delivery, prices and booking: answers to the most common questions about renting a car in Kenitra and getting it delivered in Morocco.`,
    },
    ar: {
      title: `أسئلة متكررة — كراء السيارات بالقنيطرة | Bahnaik My Car`,
      description: `الضمان، التوصيل، الأسعار والحجز: إجابات عن أكثر الأسئلة شيوعا حول كراء السيارات بالقنيطرة والتوصيل في المطارات ومحطات القطار بالمغرب.`,
    },
  },

  contact: {
    fr: {
      title: `Contact — Location de voitures à Kénitra | Bahnaik My Car`,
      description: `Contactez Bahnaik My Car pour votre location à Kénitra. WhatsApp ${BUSINESS.whatsappDisplay}, livraison offerte à l'aéroport ou à la gare, réponse rapide.`,
    },
    en: {
      title: `Contact — Car rental in Kenitra | Bahnaik My Car`,
      description: `Contact Bahnaik My Car to rent a car in Kenitra. WhatsApp ${BUSINESS.whatsappDisplay}, free delivery to your airport or station, quick reply.`,
    },
    ar: {
      title: `اتصل بنا — كراء السيارات بالقنيطرة | Bahnaik My Car`,
      description: `تواصل مع Bahnaik My Car لكراء سيارة بالقنيطرة. واتساب ${BUSINESS.whatsappDisplay}، توصيل مجاني إلى المطار أو محطة القطار، ورد سريع.`,
    },
  },

  notFound: {
    fr: {
      title: `Page introuvable — Bahnaik My Car`,
      description: `Cette page n'existe pas. Découvrez la flotte de voitures disponibles à la location à Kénitra ou contactez-nous sur WhatsApp.`,
      noindex: true,
    },
    en: {
      title: `Page not found — Bahnaik My Car`,
      description: `This page does not exist. Browse the cars available for rent in Kenitra or contact us on WhatsApp.`,
      noindex: true,
    },
    ar: {
      title: `الصفحة غير موجودة — Bahnaik My Car`,
      description: `هذه الصفحة غير موجودة. تصفح السيارات المتاحة للكراء بالقنيطرة أو تواصل معنا عبر واتساب.`,
      noindex: true,
    },
  },
} satisfies Record<string, Record<Lang, Meta>>;

/* ------------------------------------------------------------------ *
 * Vehicle detail metadata — one of the strongest long-tail plays,
 * so each car gets its own title, description and social copy.
 * ------------------------------------------------------------------ */
const VEHICLE_SEO: Record<
  string,
  Record<Lang, { title: string; description: string }>
> = {
  'dacia-sandero': {
    fr: {
      title: `Location Dacia Sandero à Kénitra — dès ${FROM}/jour | Bahnaik My Car`,
      description: `Location Dacia Sandero à Kénitra dès ${FROM} par jour. Berline 5 portes économique, idéale en ville. Livraison offerte à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Dacia Sandero rental in Kenitra — from ${FROM}/day | Bahnaik My Car`,
      description: `Rent a Dacia Sandero in Kenitra from ${FROM} per day. An affordable five-door hatchback, ideal for the city. Free delivery to your airport or station.`,
    },
    ar: {
      title: `كراء داسيا سانديرو بالقنيطرة — ابتداء من ${FROM}/يوم | Bahnaik My Car`,
      description: `كراء داسيا سانديرو بالقنيطرة ابتداء من ${FROM} لليوم. سيارة هاتشبابك بخمسة أبواب اقتصادية، مثالية للمدينة، مع توصيل مجاني إلى المطار أو المحطة.`,
    },
  },
  'dacia-logan': {
    fr: {
      title: `Location Dacia Logan à Kénitra — berline spacieuse | Bahnaik My Car`,
      description: `Location Dacia Logan à Kénitra dès ${FROM}/jour. Berline au coffre généreux, confortable sur l'axe Kénitra–Rabat. Livraison offerte à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Dacia Logan rental in Kenitra — spacious saloon | Bahnaik My Car`,
      description: `Rent a Dacia Logan in Kenitra from ${FROM} per day. A saloon with a generous boot, comfortable on the Kenitra–Rabat road. Free delivery to your airport or station.`,
    },
    ar: {
      title: `كراء داسيا لوقان بالقنيطرة — سيدان واسعة | Bahnaik My Car`,
      description: `كراء داسيا لوقان بالقنيطرة ابتداء من ${FROM} لليوم. سيارة سيدان بصندوق كبير ومريحة على طريق القنيطرة – الرباط، مع توصيل مجاني إلى المطار أو محطة القطار.`,
    },
  },
  'renault-clio-5': {
    fr: {
      title: `Location Renault Clio 5 à Kénitra — dès ${FROM}/jour | Bahnaik My Car`,
      description: `Location Renault Clio 5 à Kénitra dès ${FROM} par jour. La compacte la plus demandée, facile à garer. Livraison offerte à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Renault Clio 5 rental in Kenitra — from ${FROM}/day | Bahnaik My Car`,
      description: `Rent a Renault Clio 5 in Kenitra from ${FROM} per day. The most requested compact, easy to park. Free delivery to your airport or station.`,
    },
    ar: {
      title: `كراء رينو كليو 5 بالقنيطرة — ابتداء من ${FROM}/يوم | Bahnaik My Car`,
      description: `كراء رينو كليو 5 بالقنيطرة ابتداء من ${FROM} لليوم. أكثر السيارات المدمجة طلبا وسهلة الوقوف، مع توصيل مجاني إلى المطار أو محطة القطار.`,
    },
  },
  'peugeot-208': {
    fr: {
      title: `Location Peugeot 208 à Kénitra — dès ${FROM}/jour | Bahnaik My Car`,
      description: `Location Peugeot 208 à Kénitra dès ${FROM} par jour. Compacte confortable pour la ville et la route. Livraison offerte à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Peugeot 208 rental in Kenitra — from ${FROM}/day | Bahnaik My Car`,
      description: `Rent a Peugeot 208 in Kenitra from ${FROM} per day. A comfortable compact for town and open road. Free delivery to your airport or station.`,
    },
    ar: {
      title: `كراء بيجو 208 بالقنيطرة — ابتداء من ${FROM}/يوم | Bahnaik My Car`,
      description: `كراء بيجو 208 بالقنيطرة ابتداء من ${FROM} لليوم. سيارة مدمجة مريحة للمدينة والطريق، مع توصيل مجاني إلى المطار أو محطة القطار.`,
    },
  },
  'opel-corsa': {
    fr: {
      title: `Location Opel Corsa à Kénitra — dès ${FROM}/jour | Bahnaik My Car`,
      description: `Location Opel Corsa à Kénitra dès ${FROM} par jour. La plus compacte de notre flotte, économique et facile à garer. Livraison offerte à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Opel Corsa rental in Kenitra — from ${FROM}/day | Bahnaik My Car`,
      description: `Rent an Opel Corsa in Kenitra from ${FROM} per day. Our most compact car, economical and easy to park. Free delivery to your airport or station.`,
    },
    ar: {
      title: `كراء أوبل كورسا بالقنيطرة — ابتداء من ${FROM}/يوم | Bahnaik My Car`,
      description: `كراء أوبل كورسا بالقنيطرة ابتداء من ${FROM} لليوم. أصغر سيارة في أسطولنا، اقتصادية وسهلة الركن، مع توصيل مجاني إلى المطار أو محطة القطار.`,
    },
  },
  'hyundai-i20': {
    fr: {
      title: `Location Hyundai i20 à Kénitra — dès ${FROM}/jour | Bahnaik My Car`,
      description: `Location Hyundai i20 à Kénitra dès ${FROM} par jour. Compacte fiable et bien équipée, demandée par la clientèle MRE. Livraison offerte à l'aéroport ou à la gare.`,
    },
    en: {
      title: `Hyundai i20 rental in Kenitra — from ${FROM}/day | Bahnaik My Car`,
      description: `Rent a Hyundai i20 in Kenitra from ${FROM} per day. A dependable, well-equipped compact popular with diaspora customers. Free delivery to your airport or station.`,
    },
    ar: {
      title: `كراء هيونداي آي 20 بالقنيطرة — ابتداء من ${FROM}/يوم | Bahnaik My Car`,
      description: `كراء هيونداي آي 20 بالقنيطرة ابتداء من ${FROM} لليوم. سيارة مدمجة موثوقة ومجهزة يطلبها كثير من الجالية، مع توصيل مجاني إلى المطار أو محطة القطار.`,
    },
  },
};

export function vehicleMeta(v: Vehicle, lang: Lang): Meta {
  const entry = VEHICLE_SEO[v.slug]?.[lang];
  if (entry) return entry;
  return {
    title: `${v.alt[lang]} | ${SITE.name}`,
    description: v.pitch[lang],
  };
}

/** Blog post metadata comes from frontmatter; this is the fallback shape. */
export function metaFor(key: keyof typeof META, lang: Lang): Meta {
  return META[key][lang];
}
