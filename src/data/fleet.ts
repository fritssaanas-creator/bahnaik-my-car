import type { Lang } from '~/i18n/lang';

/** Specification keys, localised at render time. */
export type Spec = 'seats' | 'transmission' | 'fuel' | 'luggage' | 'aircon';
export type Body = 'hatchback' | 'sedan';
export type Fuel = 'petrol' | 'diesel';
export type Gearbox = 'manual' | 'automatic';

export interface Vehicle {
  /** URL slug, shared by every language. */
  slug: string;
  /** Marketing name, e.g. "Renault Clio 5". */
  model: string;
  brand: string;
  /** Price per day in MAD, "à partir de" — never a guarantee. */
  fromPrice: number;
  body: Body;
  seats: number;
  doors: number;
  gearbox: Gearbox;
  fuel: Fuel;
  /** Luggage capacity, in units. */
  luggage: number;
  aircon: boolean;
  /** Display order. */
  order: number;
  /** Artwork. Swap in real photography by replacing these two fields. */
  image: string;
  /**
   * Intrinsic dimensions of `image`, per vehicle. The generated vector art is
   * 1600x640; a real photograph can be any size, so these must always match the
   * file on disk or the width/height attributes lie and the layout shifts.
   */
  imageWidth: number;
  imageHeight: number;
  /**
   * Alt text is written per language and describes the photograph, which is
   * what image SEO actually rewards.
   */
  alt: Record<Lang, string>;
  /** One-sentence positioning used on cards and at the top of detail pages. */
  pitch: Record<Lang, string>;
  /** Two or three sentences of body copy for the detail page. */
  blurb: Record<Lang, string>;
  /** Who this car suits — feeds long-tail internal linking. */
  bestFor: Record<Lang, string[]>;
}

/**
 * The fleet.
 *
 * The site never states how many cars there are: a fixed count would go stale
 * the moment a vehicle is added or retired, and it frames a growing fleet as a
 * small one. The grid, the booking dropdown, the vehicle schema, the sitemap
 * and the related-vehicle blocks all read from this array, so growing it is a
 * single-entry change and needs no other edit anywhere.
 */
export const FLEET: Vehicle[] = [
  {
    slug: 'dacia-sandero',
    model: 'Dacia Sandero',
    brand: 'Dacia',
    fromPrice: 250,
    body: 'hatchback',
    seats: 5,
    doors: 5,
    gearbox: 'manual',
    fuel: 'petrol',
    luggage: 2,
    aircon: true,
    order: 1,
    image: '/cars/dacia-sandero.webp',
    imageWidth: 736,
    imageHeight: 414,
    alt: {
      fr: 'Dacia Sandero de location à Kénitra, berline 5 portes, vue de profil',
      en: 'Dacia Sandero rental car in Kenitra, five-door hatchback, side view',
      ar: 'داسيا سانديرو للإيجار في القنيطرة، سيارة هاتشبابك بخمسة أبواب، من الجانب',
    },
    pitch: {
      fr: 'La berline 5 portes la plus économique de la flotte, idéale pour un séjour en ville ou un court trajet.',
      en: 'The most affordable five-door car in the fleet, ideal for a city stay or a short trip.',
      ar: 'أقل سيارة من نوع هاتشبابك بخمسة أبواب من حيث السعر في الأسطول، مثالية للإقامة في المدينة أو للرحلات القصيرة.',
    },
    blurb: {
      fr: "La Dacia Sandero combine une habitabilité correcte avec un prix de location jour par jour très accessible. C'est le choix raisonnable pour un couple ou un petit groupe qui circule surtout à Kénitra et sur les axes proches. Son hayon arrière simplifie le chargement des bagages et des courses.",
      en: 'The Dacia Sandero pairs usable interior space with a very accessible day rate. It is the sensible pick for a couple or a small group driving mostly around Kenitra and the nearby roads. Its rear hatch makes loading bags and shopping straightforward.',
      ar: 'تجمع داسيا سانديرو بين مساحة داخلية مقبولة وسعر إيجار يومي في المتناول. وهي الخيار المنطقي لزوجين أو لمجموعة صغيرة تتحرك غالبا حول القنيطرة والطرق المجاورة. كما أن صندوقها الخلفي يسهل تحميل الأمتعة والمشتريات.',
    },
    bestFor: {
      fr: ['Séjour en ville à Kénitra', 'Petits groupes', 'Budget maîtrisé'],
      en: ['City stays in Kenitra', 'Small groups', 'Budget-friendly trips'],
      ar: ['الإقامة في مدينة القنيطرة', 'المجموعات الصغيرة', 'رحلات اقتصادية'],
    },
  },
  {
    slug: 'dacia-logan',
    model: 'Dacia Logan',
    brand: 'Dacia',
    fromPrice: 250,
    body: 'sedan',
    seats: 5,
    doors: 5,
    gearbox: 'manual',
    fuel: 'petrol',
    luggage: 3,
    aircon: true,
    order: 2,
    image: '/cars/dacia-logan.webp',
    imageWidth: 735,
    imageHeight: 490,
    alt: {
      fr: 'Dacia Logan de location à Kénitra, berline trois volumes, vue de profil',
      en: 'Dacia Logan rental car in Kenitra, five-door saloon, side view',
      ar: 'داسيا لوقان للإيجار في القنيطرة، سيارة سيدان بصندوق واسع، من الجانب',
    },
    pitch: {
      fr: 'La berline la plus spacieuse de la flotte : coffre généreux et tenue de route stable sur l’axe Kénitra – Rabat.',
      en: 'The most spacious saloon in the fleet: a generous boot and stable road manners on the Kenitra–Rabat road.',
      ar: 'أوسع سيارة سيدان في الأسطول: صندوق كبير وثبات جيد على طريق القنيطرة – الرباط.',
    },
    blurb: {
      fr: "Avec son coffre nettement plus profond que celui d'une compacte, la Dacia Logan convient aux voyages qui comportent des bagages ou de la publicité. Elle reste confortable sur les trajets plus longs, par exemple entre Kénitra et Rabat ou lors des approches d'autres villes du Royaume.",
      en: 'With a boot clearly deeper than a compact car, the Dacia Logan suits trips that involve luggage or advertising material. It stays comfortable on longer drives, for example between Kenitra and Rabat or on approaches to other Moroccan cities.',
      ar: 'بصندوق أوسع بوضوح من صندوق السيارة المدمجة، تناسب داسيا لوقان الرحلات التي تشمل أمتعة أو مواد إعلانية. وهي مريحة في الرحلات الأطول، على سبيل المثال بين القنيطرة والرباط أو عند الاقتراب من مدن أخرى بالمملكة.',
    },
    bestFor: {
      fr: ['Trajets Kénitra – Rabat', 'Familles avec bagages', 'Déplacements pro'],
      en: ['Kenitra–Rabat journeys', 'Families with luggage', 'Business travel'],
      ar: ['رحلات القنيطرة – الرباط', 'العائلات مع الأمتعة', 'التنقل المهني'],
    },
  },
  {
    slug: 'renault-clio-5',
    model: 'Renault Clio 5',
    brand: 'Renault',
    fromPrice: 280,
    body: 'hatchback',
    seats: 5,
    doors: 5,
    gearbox: 'manual',
    fuel: 'petrol',
    luggage: 2,
    aircon: true,
    order: 3,
    image: '/cars/renault-clio-5.webp',
    imageWidth: 735,
    imageHeight: 490,
    alt: {
      fr: 'Renault Clio 5 de location à Kénitra, berline 5 portes, vue de profil',
      en: 'Renault Clio 5 rental car in Kenitra, five-door hatchback, side view',
      ar: 'رينو كليو 5 للإيجار في القنيطرة، سيارة هاتشبابك بخمسة أبواب، من الجانب',
    },
    pitch: {
      fr: 'La compacte la plus demandée de la flotte : maniable, économique et comfortable au quotidien.',
      en: 'The most requested compact in the fleet: easy to drive, economical and comfortable day to day.',
      ar: 'أكثر السيارات المدمجة طلبا في الأسطول: سهلة القيادة واقتصادية ومريحة للاستعمال اليومي.',
    },
    blurb: {
      fr: "La Renault Clio 5 est la compacte la plus recherchée de notre flotte à Kénitra. Elle est assez petite pour se garer facilement en ville, mais conserve un habitacle et un coffre suffisants pour un couple ou une petite famille. C'est également la voiture présentée sur cette page comme exemple de notre showroom.",
      en: 'The Renault Clio 5 is the most sought-after compact in our Kenitra fleet. It is small enough to park easily in town while still offering enough cabin and boot space for a couple or a small family. It is also the car featured on this page as an example of our showroom.',
      ar: 'رينو كليو 5 هي السيارة المدمجة الأكثر طلبا في أسطولنا بالقنيطرة. هي صغيرة بما يكفي لسهولة الوقوف في المدينة، مع الحفاظ على مقصورة وصندوق كافيين لزوجين أو لعائلة صغيرة. وهي أيضا السيارة المعروضة في هذه الصفحة كمثال من أسطولنا.',
    },
    bestFor: {
      fr: ['Ville et stationnements serrés', 'Couples', 'Visites au Maroc'],
      en: ['City driving and tight parking', 'Couples', 'Tours around Morocco'],
      ar: ['القيادة داخل المدينة والمواقف الضيقة', 'الأزواج', 'جولات في المغرب'],
    },
  },
  {
    slug: 'peugeot-208',
    model: 'Peugeot 208',
    brand: 'Peugeot',
    fromPrice: 280,
    body: 'hatchback',
    seats: 5,
    doors: 5,
    gearbox: 'manual',
    fuel: 'petrol',
    luggage: 2,
    aircon: true,
    order: 4,
    image: '/cars/Peugeot 208.png',
    imageWidth: 736,
    imageHeight: 414,
    alt: {
      fr: 'Peugeot 208 de location à Kénitra, berline 5 portes, vue de profil',
      en: 'Peugeot 208 rental car in Kenitra, five-door hatchback, side view',
      ar: 'بيجو 208 للإيجار في القنيطرة، سيارة هاتشبابك بخمسة أبواب، من الجانب',
    },
    pitch: {
      fr: 'Une compacte au design soigné, agréable à conduire en ville comme sur route.',
      en: 'A compact with the i-Cockpit interior, pleasant both in town and on the open road.',
      ar: 'سيارة مدمجة بتصميم داخلي مميز، ممتعة في المدينة وعلى الطريق المفتوح.',
    },
    blurb: {
      fr: "La Peugeot 208 est une alternative à la Clio pour qui préfère une position de conduite un peu plus haute et un intérieur à la Peugeot. Elle se comporte bien sur les courtes distances urbaines de Kénitra comme sur les axes vers Rabat ou Sidi Kacem.",
      en: 'The Peugeot 208 is an alternative to the Clio for drivers who prefer a slightly higher seating position and a Peugeot cabin. It handles short urban hops around Kenitra as well as the roads towards Rabat or Sidi Kacem.',
      ar: 'بيجو 208 هي بديل لكليو لمن يفضل وضعية جلوس أعلى قليلًا ومقصورة بطابع بيجو. تتصرف بشكل جيد في التنقلات الحضرية القصيرة بالقنيطرة وعلى الطرق المؤدية إلى الرباط أو سيدي قاسم.',
    },
    bestFor: {
      fr: ['Usage urbain', 'Confort de conduite', 'Alternative à la Clio'],
      en: ['Everyday city use', 'Driving comfort', 'An alternative to the Clio'],
      ar: ['الاستخدام الحضري اليومي', 'راحة القيادة', 'بديل عن كليو'],
    },
  },
  {
    slug: 'opel-corsa',
    model: 'Opel Corsa',
    brand: 'Opel',
    fromPrice: 280,
    body: 'hatchback',
    seats: 5,
    doors: 5,
    gearbox: 'manual',
    fuel: 'petrol',
    luggage: 2,
    aircon: true,
    order: 5,
    image: '/cars/opel-corsa.png',
    imageWidth: 1104,
    imageHeight: 621,
    alt: {
      fr: 'Opel Corsa de location à Kénitra, berline 5 portes, vue de profil',
      en: 'Opel Corsa rental car in Kenitra, five-door hatchback, side view',
      ar: 'أوبل كورسا للإيجار في القنيطرة، سيارة هاتشبابك بخمسة أبواب، من الجانب',
    },
    pitch: {
      fr: 'La plus compacte du groupe : discrète en ville, économique sur les petits trajets.',
      en: 'The most compact of the group: discreet in town and economical on short journeys.',
      ar: 'أصغر سيارة في المجموعة: هادئة داخل المدينة واقتصادية في الرحلات القصيرة.',
    },
    blurb: {
      fr: "L'Opel Corsa est la plus petite voiture de notre flotte, ce qui la rend facile à garer dans les rues de Kénitra. C'est un choix pratique pour deux personnes qui se déplacent surtout en ville ou sur de courtes distances, et qui veulent rester sur un budget jour par jour raisonnable.",
      en: 'The Opel Corsa is the smallest car in our fleet, which makes it easy to park on Kenitra streets. It is a practical choice for two people who mostly drive in town or over short distances and want to stay within a sensible day rate.',
      ar: 'أوبل كورسا هي أصغر سيارة في أسطولنا، مما يجعل ركنها سهلا في شوارع القنيطرة. وهي خيار عملي لشخصين يتنقلان غالبا داخل المدينة أو على مسافات قصيرة ويريدان البقاء ضمن سعر يومي معقول.',
    },
    bestFor: {
      fr: ['Deux voyageurs', 'Parkings serrés', 'Budget jour par jour'],
      en: ['Two travellers', 'Tight parking', 'Day-by-day budget'],
      ar: ['مسافران', 'المواقف الضيقة', 'ميزانية يومية'],
    },
  },
  {
    slug: 'hyundai-i20',
    model: 'Hyundai i20',
    brand: 'Hyundai',
    fromPrice: 280,
    body: 'hatchback',
    seats: 5,
    doors: 5,
    gearbox: 'manual',
    fuel: 'petrol',
    luggage: 2,
    aircon: true,
    order: 6,
    image: '/cars/hyundai-i20.webp',
    imageWidth: 736,
    imageHeight: 508,
    alt: {
      fr: 'Hyundai i20 de location à Kénitra, berline 5 portes, vue de profil',
      en: 'Hyundai i20 rental car in Kenitra, five-door hatchback, side view',
      ar: 'هيونداي آي 20 للإيجار في القنيطرة، سيارة هاتشبابك بخمسة أبواب، من الجانب',
    },
    pitch: {
      fr: 'Une compacte fiable et bien équipée, régulièrement demandée par la clientèle MRE.',
      en: 'A dependable, well-equipped compact, regularly requested by our diaspora customers.',
      ar: 'سيارة مدمجة موثوقة ومزوّدة بتجهيزات جيدة، يطلبها عملاؤنا من الجالية المغربية بانتظام.',
    },
    blurb: {
      fr: "L'Hyundai i20 est une compacte que la clientèle marocaine residing abroad demande régulièrement, notamment pour son équipement et sa facilité de prise en main. Elle convient aussi bien à un séjour urbain qu'à un circuit touristique à travers le Royaume.",
      en: 'The Hyundai i20 is a compact that diaspora customers ask for repeatedly, notably for its equipment and how easy it is to get comfortable with. It suits an urban stay just as well as a touring route across the Kingdom.',
      ar: 'هيونداي آي 20 هي سيارة مدمجة يكرر طلبها عملاؤنا من الجالية، خصوصا لما تتميز به من تجهيزات وسهولة في القيادة. وهي ملائمة للإقامة الحضرية وللجولات السياحية عبر المملكة.',
    },
    bestFor: {
      fr: ['Clientèle MRE', 'Bon équipement', 'Séjours + circuits'],
      en: ['Diaspora customers', 'Good equipment', 'Stays and touring'],
      ar: ['عملاء الجالية', 'تجهيزات جيدة', 'إقامة وجولات'],
    },
  },
];

/* ------------------------------------------------------------------ *
 * Adding a vehicle
 * ------------------------------------------------------------------ *
 * Append an object shaped like the ones above — the fleet grid, the
 * booking dropdown, the vehicle schema, the sitemap, the /flotte page
 * and the related-vehicle blocks on detail pages all derive from FLEET,
 * so a single entry is enough. Nothing else needs to be touched.
 *
 * Example:
 *
 *   {
 *     slug: 'renault-capture', model: 'Renault Capture', brand: 'Renault',
 *     fromPrice: 320, body: 'hatchback', seats: 5, doors: 5,
 *     gearbox: 'automatic', fuel: 'petrol', luggage: 2, aircon: true,
 *     order: 7,
 *     image: '/cars/renault-capture.webp',
 *     imageWidth: 735, imageHeight: 490,
 *     alt: { fr: '…', en: '…', ar: '…' },
 *     pitch: { fr: '…', en: '…', ar: '…' },
 *     blurb: { fr: '…', en: '…', ar: '…' },
 *     bestFor: { fr: ['…'], en: ['…'], ar: ['…'] },
 *   }
 * ------------------------------------------------------------------ */

export const FLEET_BY_SLUG: Record<string, Vehicle> = Object.fromEntries(
  FLEET.map((v) => [v.slug, v]),
);

export function getVehicle(slug: string): Vehicle | undefined {
  return FLEET_BY_SLUG[slug];
}

/** Lowest day rate in the fleet — used for "à partir de" style statements. */
export const FLEET_FROM_PRICE = Math.min(...FLEET.map((v) => v.fromPrice));

/** Highest day rate in the fleet — closes the published price range. */
export const FLEET_TO_PRICE = Math.max(...FLEET.map((v) => v.fromPrice));

/** Sort helper — keeps ordering declarative and identical everywhere. */
export function fleetSorted(): Vehicle[] {
  return [...FLEET].sort((a, b) => a.order - b.order);
}
