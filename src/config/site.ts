export type PageId = 'inicio' | 'servicios' | 'industrias' | 'agendar' | 'contacto';
export type SeoPageId = Exclude<PageId, 'industrias'>;

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
    { label: 'Política de reembolso', href: '/legal/refund-policy' },
    { label: 'Política de privacidad', href: '/legal/privacy-policy' },
    { label: 'Términos del servicio', href: '/legal/terms-of-service' },
    { label: 'Términos de órdenes de compra', href: '/legal/purchase-order-terms' },
  ],
} as const;

export const NAV: { id: PageId; label: string; href: string }[] = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'servicios', label: 'Servicios', href: '/servicios' },
  { id: 'industrias', label: 'Industrias', href: '/servicios#industrias' },
  { id: 'agendar', label: 'Agendar', href: '/agendar' },
];

export const SEO: Record<SeoPageId, { title: string; description: string }> = {
  inicio: {
    title: 'Integra | Equipos remotos de ventas y Virtual Assistance',
    description:
      'Equipos remotos de ventas, Virtual Assistance, diseño web y marketing para bienes raíces, SaaS, firmas legales y salud. Crece con estructura y calidad.',
  },
  servicios: {
    title: 'Ventas, Virtual Assistance, diseño web y marketing | Integra',
    description:
      'Ventas, Virtual Assistance, diseño web y marketing que se integran a tu operación. Apoyo para bienes raíces, SaaS, firmas legales y salud.',
  },
  agendar: {
    title: 'Agenda una llamada con Integra',
    description:
      'Elige el servicio —ventas, Virtual Assistance, diseño web o marketing— y reserva tu cita con el especialista indicado.',
  },
  contacto: {
    title: 'Contacto | Solicita una propuesta — Integra',
    description:
      'Cuéntanos dónde quieres apoyo y te ayudamos a definir el talento, la estructura y el siguiente paso para tu equipo.',
  },
};
