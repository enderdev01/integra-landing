import type { ImageMetadata } from 'astro';
import heroOffice from '../assets/img/hero-office.webp';
import svcSales from '../assets/img/svc-sales.webp';
import svcSupport from '../assets/img/svc-support.webp';

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
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'equipos',
    image: heroOffice,
    focus: '60% center',
    lockup: { kicker: 'Equipos', connector: 'remotos que hacen', word: 'crecer', closing: 'tu operación' },
    cta: { label: '¡Agenda una llamada!', href: '/agendar' },
  },
  {
    id: 'ventas',
    image: svcSales,
    focus: '45% 55%',
    lockup: { kicker: 'Ventas', connector: 'que mantienen tus', word: 'leads', closing: 'en movimiento' },
    cta: { label: 'Agenda tu cita de ventas', href: '/agendar?servicio=ventas' },
  },
  {
    id: 'soporte',
    image: svcSupport,
    focus: '65% 40%',
    lockup: { kicker: 'Soporte', connector: 'profesional en', word: 'cada', closing: 'canal de tus clientes' },
    cta: { label: 'Agenda tu cita de soporte', href: '/agendar?servicio=customer-support' },
  },
];

/** Time each slide stays on screen while autoplay runs */
export const HERO_INTERVAL_MS = 6500;
