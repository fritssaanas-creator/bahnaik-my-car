import { BUSINESS, waLink } from '~/data/business';
import { getVehicle } from '~/data/fleet';
import type { Lang } from '~/i18n/lang';

/**
 * Pick-up options.
 *
 * Airport and station are first-class, not variations of "other": delivery to
 * any airport or any train station in Morocco is a standing, free offer, so the
 * form should ask for them by name instead of making the customer invent a
 * free-text address. `other` stays the catch-all for an address we have to look
 * at first, and is confirmed over WhatsApp before anything is booked.
 */
export const PICKUP = {
  agency: 'agency',
  airport: 'airport',
  station: 'station',
  other: 'other',
} as const;
export type Pickup = (typeof PICKUP)[keyof typeof PICKUP];

export interface BookingInput {
  /** Vehicle slug, or empty for "no preference". */
  vehicle?: string;
  /** ISO yyyy-mm-dd */
  start?: string;
  end?: string;
  pickup?: Pickup;
  /** Free-text location: which airport, which station, or a full address. */
  location?: string;
  /** Page the request came from, for context in the chat. */
  source?: string;
  lang: Lang;
}

const STRINGS = {
  fr: {
    head: 'Bonjour Bahnik My Car, je souhaite réserver une voiture.',
    vehicle: 'Véhicule demandé',
    undecided: 'Véhicule demandé : à confirmer selon disponibilité',
    start: 'Départ',
    end: 'Retour',
    duration: 'Durée',
    pickup: 'Prise en charge',
    atAgency: 'Agence Bahnik My Car — Kénitra',
    atAirport: 'Aéroport',
    atStation: 'Gare',
    elsewhere: 'Autre adresse',
    where: 'Lieu précisé',
    noStart: 'Date de départ : à préciser',
    noEnd: 'Date de retour : à préciser',
    day: 'jour(s)',
    source: 'Depuis la page',
    freeDelivery: 'Livraison offerte à Kénitra, dans les aéroports et les gares du Maroc',
    arrivalAsk: 'Heure d’arrivée à préciser',
    caution:
      'Merci de me confirmer la disponibilité, le tarif final et les conditions de location (caution incluse).',
    question: 'Une question :',
    aboutVehicle: ' au sujet de la',
  },
  en: {
    head: 'Hello Bahnik My Car, I would like to rent a car.',
    vehicle: 'Car requested',
    undecided: 'Car requested: to be confirmed depending on availability',
    start: 'Pick-up',
    end: 'Return',
    duration: 'Duration',
    pickup: 'Pick-up location',
    atAgency: 'Bahnik My Car branch — Kenitra',
    atAirport: 'Airport',
    atStation: 'Train station',
    elsewhere: 'Another address',
    where: 'Location given',
    noStart: 'Pick-up date: to be confirmed',
    noEnd: 'Return date: to be confirmed',
    day: 'day(s)',
    source: 'From the page',
    freeDelivery: 'Free delivery in Kenitra, at airports and at train stations in Morocco',
    arrivalAsk: 'My arrival time, to be confirmed',
    caution: 'Please confirm availability, the final rate and the rental terms (including the deposit).',
    question: 'A question:',
    aboutVehicle: ' about the',
  },
  ar: {
    head: 'السلام عليكم Bahnik My Car، أود حجز سيارة.',
    vehicle: 'السيارة المطلوبة',
    undecided: 'السيارة المطلوبة: للتأكيد حسب التوفر',
    start: 'الانطلاق',
    end: 'الإرجاع',
    duration: 'المدة',
    pickup: 'مكان الاستلام',
    atAgency: 'وكالة Bahnik My Car — القنيطرة',
    atAirport: 'المطار',
    atStation: 'محطة القطار',
    elsewhere: 'عنوان آخر',
    where: 'المكان المحدد',
    noStart: 'تاريخ الانطلاق: للتأكيد',
    noEnd: 'تاريخ الإرجاع: للتأكيد',
    day: 'يوم',
    source: 'من الصفحة',
    freeDelivery: 'التوصيل مجاني بالقنيطرة، وفي المطارات ومحطات القطار بالمغرب',
    arrivalAsk: 'وقت الوصول: للتأكيد',
    caution: 'يرجى تأكيد التوفر والسعر النهائي وشروط الكراء (بما فيها الضمان).',
    question: 'لدي سؤال:',
    aboutVehicle: ' بخصوص',
  },
} as const;

export function formatDate(iso: string, lang: Lang): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-GB' : 'fr-MA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(Date.UTC(y, m - 1, d)));
  } catch {
    return iso;
  }
}

/**
 * Message fragments, exported so the browser-side booking form can build the
 * exact same payload the build-time links use. One source of truth, two
 * runtimes.
 */
export const BUILD_STRINGS = STRINGS;

/** Whole days between two ISO dates, or 0 when unknown. */
export function nightsBetween(start?: string, end?: string): number {
  if (!start || !end) return 0;
  const a = Date.parse(`${start}T00:00:00Z`);
  const b = Date.parse(`${end}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  const diff = Math.round((b - a) / 86_400_000);
  return diff > 0 ? diff : 0;
}

/**
 * Build the pre-filled WhatsApp message.
 * Mirrors exactly what the client-side form produces, so links generated at
 * build time (vehicle cards) and links built in the browser are consistent.
 *
 * The airport and station cases repeat the free-delivery promise on purpose:
 * it is the answer to the question the customer is asking when they type their
 * terminal name, and it is confirmed per booking rather than assumed.
 */
export function buildMessage(input: BookingInput): string {
  const s = STRINGS[input.lang] ?? STRINGS.fr;
  const vehicle = input.vehicle ? getVehicle(input.vehicle) : undefined;
  const lines: string[] = [s.head];

  lines.push(`${s.vehicle} : ${vehicle ? vehicle.model : s.undecided}`);

  lines.push(`${s.start} : ${input.start ? formatDate(input.start, input.lang) : s.noStart}`);
  lines.push(`${s.end} : ${input.end ? formatDate(input.end, input.lang) : s.noEnd}`);

  const days = nightsBetween(input.start, input.end);
  if (days) lines.push(`${s.duration} : ${days} ${s.day}`);

  const pickup = input.pickup ?? PICKUP.agency;
  const where = input.location?.trim();

  if (pickup === PICKUP.other) {
    lines.push(`${s.pickup} : ${where || s.elsewhere}`);
  } else if (pickup === PICKUP.airport || pickup === PICKUP.station) {
    const label = pickup === PICKUP.airport ? s.atAirport : s.atStation;
    lines.push(`${s.pickup} : ${where || label}`);
    lines.push(s.freeDelivery);
    lines.push(s.arrivalAsk);
  } else {
    lines.push(`${s.pickup} : ${s.atAgency}`);
  }

  if (input.source) lines.push(`${s.source} : ${input.source}`);

  lines.push(s.caution);
  return lines.join('\n');
}

/** Full wa.me URL for a booking request. */
export function bookingLink(input: BookingInput): string {
  return waLink(buildMessage(input));
}

/** Shorter link used by vehicle CTAs, which pre-fill the vehicle only. */
export function vehicleLink(slug: string, lang: Lang, source?: string): string {
  return bookingLink({ vehicle: slug, lang, source });
}

/** Generic contact link with no pre-filled form data. */
export function contactLink(lang: Lang, subject?: string): string {
  const s = STRINGS[lang] ?? STRINGS.fr;
  const body = subject ? `${s.question} ${subject}` : s.head;
  return waLink(body);
}

export { BUSINESS };
