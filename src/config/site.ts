export type PageId = 'inicio' | 'servicios' | 'agendar' | 'contacto';

export const SITE = {
  name: 'Integra',
  legalName: 'Integra Inc.',
  locale: 'es_US',
  lang: 'es',
  address: {
    street: 'NW 79th Avenue',
    city: 'Doral',
    region: 'FL',
    postalCode: '33122',
    country: 'US',
    display: ['NW 79th Avenue', 'Doral, Florida 33122, USA'],
  },
  // Placeholders from the client design — replace with real numbers before launch.
  phone: { display: '+0 000 000 0000', href: 'tel:+00000000000' },
  tollFree: { display: '+0 000 000 0000', href: 'tel:+00000000000' },
  // Footer links. Replace with Integra's real profiles; only `profiles` below feed the structured data.
  social: [
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { label: 'X', href: 'https://x.com', icon: 'x' },
  ],
  /** Real social profile URLs for schema.org `sameAs` (leave empty until confirmed) */
  profiles: [] as string[],
  legal: [
    { label: 'Refund policy', href: '/legal/refund-policy' },
    { label: 'Privacy policy', href: '/legal/privacy-policy' },
    { label: 'Terms of service', href: '/legal/terms-of-service' },
    { label: 'Purchase order terms & conditions', href: '/legal/purchase-order-terms' },
  ],
} as const;

export const NAV: { id: PageId; label: string; href: string }[] = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'servicios', label: 'Servicios', href: '/servicios' },
  { id: 'agendar', label: 'Agendar', href: '/agendar' },
  { id: 'contacto', label: 'Contacto', href: '/contacto' },
];

export const SEO: Record<PageId, { title: string; description: string }> = {
  inicio: {
    title: 'Integra | Equipos remotos de ventas, soporte y back office',
    description:
      'Construimos equipos remotos de ventas, customer support y back office para que tu negocio crezca con estructura, calidad y flexibilidad.',
  },
  servicios: {
    title: 'Servicios de ventas, soporte, web y marketing | Integra',
    description:
      'SDRs e inside sales, customer support, diseño web y marketing digital que se integran a tu operación con el mismo acompañamiento.',
  },
  agendar: {
    title: 'Agenda una llamada con Integra',
    description:
      'Elige el servicio —ventas, customer support, diseño web o marketing— y reserva tu cita con el especialista indicado.',
  },
  contacto: {
    title: 'Contacto | Solicita una propuesta — Integra',
    description:
      'Cuéntanos dónde necesitas apoyo y te ayudamos a definir el talento, la estructura y el siguiente paso para tu equipo.',
  },
};
