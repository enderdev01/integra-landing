import type { ImageMetadata } from 'astro';
import heroOffice from '../assets/img/hero-office.webp';
import heroSales from '../assets/img/hero-sales.webp';
import heroSupport from '../assets/img/hero-support.webp';
import { bookingHref, useTranslations, type Locale } from '../i18n';

export interface HeroSlide {
  id: string;
  image: ImageMetadata;
  /** CSS object-position for the photo */
  focus: string;
  /** Four-part headline lockup from the client design: kicker / connector / big word / closing */
  lockup: { kicker: string; connector: string; word: string; closing: string };
  cta: { label: string; href: string };
}

// Slides 2 and 3 reuse the client's service copy; pending client approval.
const BASE = [
  { id: 'equipos', image: heroOffice, focus: '60% center', service: undefined },
  { id: 'ventas', image: heroSales, focus: '60% 35%', service: 'ventas' },
  { id: 'soporte', image: heroSupport, focus: '65% 35%', service: 'virtual-assistance' },
];

export const getHeroSlides = (locale: Locale): HeroSlide[] => {
  const { slides } = useTranslations(locale).hero;
  return BASE.map(({ service, ...base }, index) => {
    const { cta, ...lockup } = slides[index];
    return { ...base, lockup, cta: { label: cta, href: bookingHref(locale, service) } };
  });
};

/** Time each slide stays on screen while autoplay runs */
export const HERO_INTERVAL_MS = 5000;
