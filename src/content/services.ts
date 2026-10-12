import {
  PUBLIC_GHL_BOOKING_MARKETING,
  PUBLIC_GHL_BOOKING_SUPPORT,
  PUBLIC_GHL_BOOKING_VENTAS,
  PUBLIC_GHL_BOOKING_WEB,
} from 'astro:env/client';

export type ServiceId = 'ventas' | 'support' | 'web' | 'marketing';

export interface Service {
  id: ServiceId;
  /** Anchor on /servicios and value of the ?servicio= booking parameter */
  slug: string;
  name: string;
  /** One-line summary for menus and booking cards */
  short: string;
  lead: string;
  bullets: string[];
  cta: string;
  /** Lead used in the booking summary */
  bookingLead: string;
  /** GoHighLevel booking widget URL (public, embedded on /agendar) */
  bookingUrl: string | undefined;
}

export const SERVICES: Service[] = [
  {
    id: 'ventas',
    slug: 'ventas',
    name: 'Ventas',
    short: 'SDRs, calificación de leads y pipeline',
    lead: 'Amplía tu capacidad comercial y mantén las oportunidades en movimiento.',
    bullets: ['SDRs / Inside Sales', 'Calificación de leads', 'Appointment setting', 'Seguimiento de pipeline'],
    cta: 'Construir mi equipo de ventas',
    bookingLead: 'Armamos tu equipo comercial para ampliar capacidad y mantener las oportunidades en movimiento.',
    bookingUrl: PUBLIC_GHL_BOOKING_VENTAS,
  },
  {
    id: 'support',
    slug: 'customer-support',
    name: 'Customer Support',
    short: 'Teléfono, email, chat y back office',
    lead: 'Atención profesional en los canales que tus clientes utilizan.',
    bullets: ['Soporte telefónico', 'Email y chat', 'Atención al cliente', 'Administración / back office'],
    cta: 'Construir mi equipo de soporte',
    bookingLead: 'Definimos la atención profesional en los canales que tus clientes utilizan.',
    bookingUrl: PUBLIC_GHL_BOOKING_SUPPORT,
  },
  {
    id: 'web',
    slug: 'diseno-web',
    name: 'Diseño Web',
    short: 'Websites, landing pages y rediseños',
    lead: 'Un website profesional que convierte visitas en oportunidades.',
    bullets: ['Diseño de websites', 'Landing pages', 'Rediseño de sitios', 'Layouts para conversión'],
    cta: 'Crear mi website',
    bookingLead: 'Planificamos un website profesional que convierta visitas en oportunidades.',
    bookingUrl: PUBLIC_GHL_BOOKING_WEB,
  },
  {
    id: 'marketing',
    slug: 'marketing',
    name: 'Marketing Services',
    short: 'Diseño gráfico, redes y contenido',
    lead: 'Soporte creativo y digital alineado con tus objetivos.',
    bullets: ['Diseño gráfico', 'Redes sociales', 'Contenido', 'Ejecución de marketing digital'],
    cta: 'Explora soporte de marketing',
    bookingLead: 'Alineamos el soporte creativo y digital con tus objetivos.',
    bookingUrl: PUBLIC_GHL_BOOKING_MARKETING,
  },
];

export const serviceBySlug = (slug: string | null | undefined) =>
  SERVICES.find((service) => service.slug === slug);
