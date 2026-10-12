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
  /** GoHighLevel calendar ID (public, embedded in the booking page) */
  calendarId: string | undefined;
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
    calendarId: import.meta.env.PUBLIC_GHL_CALENDAR_VENTAS,
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
    calendarId: import.meta.env.PUBLIC_GHL_CALENDAR_SUPPORT,
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
    calendarId: import.meta.env.PUBLIC_GHL_CALENDAR_WEB,
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
    calendarId: import.meta.env.PUBLIC_GHL_CALENDAR_MARKETING,
  },
];

export const serviceBySlug = (slug: string | null | undefined) =>
  SERVICES.find((service) => service.slug === slug);
