import { routePath, servicesHref, useTranslations, type Locale, type RouteKey } from '../i18n';

export type PageId = 'inicio' | 'servicios' | 'industrias' | 'agendar' | 'contacto';
export type SeoPageId = Exclude<PageId, 'industrias'>;

export const SITE = {
  name: 'Integra',
  legalName: 'Integra Inc.',
  address: {
    street: '2651 Queen St',
    city: 'Los Angeles',
    region: 'CA',
    postalCode: '90039',
    country: 'US',
    display: ['2651 Queen St', 'Los Angeles, CA 90039', 'United States'],
  },
  /** Public contact inbox; also receives the contact form submissions. */
  email: 'hello@integrasgp.com',
  /** The only contact number */
  phone: { display: '+1 415 816 6406', href: 'tel:+14158166406' },
  // Footer links to Integra's real profiles.
  social: [
    { label: 'Facebook', href: 'https://www.facebook.com/share/1HbZjYG2Bs/?mibextid=wwXIfr', icon: 'facebook' },
    { label: 'Instagram', href: 'https://www.instagram.com/integra.bpo', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/integra-growth-partner/', icon: 'linkedin' },
  ],
  /** Real social profile URLs for schema.org `sameAs` */
  profiles: [
    'https://www.facebook.com/share/1HbZjYG2Bs/?mibextid=wwXIfr',
    'https://www.instagram.com/integra.bpo',
    'https://www.linkedin.com/company/integra-growth-partner/',
  ] as string[],
  /** Slugs of the legal pages; labels come from the dictionary */
  legal: ['refund-policy', 'privacy-policy', 'terms-of-service', 'purchase-order-terms'],
} as const;

const NAV_ITEMS: { id: PageId; label: 'home' | 'services' | 'industries' | 'schedule'; href: (locale: Locale) => string }[] = [
  { id: 'inicio', label: 'home', href: (locale) => routePath('home', locale) },
  { id: 'servicios', label: 'services', href: (locale) => routePath('services', locale) },
  { id: 'industrias', label: 'industries', href: (locale) => servicesHref(locale, 'industrias') },
  { id: 'agendar', label: 'schedule', href: (locale) => routePath('schedule', locale) },
];

export const getNav = (locale: Locale) => {
  const { nav } = useTranslations(locale);
  return NAV_ITEMS.map((item) => ({ id: item.id, label: nav[item.label], href: item.href(locale) }));
};

const SEO_KEY: Record<SeoPageId, RouteKey> = { inicio: 'home', servicios: 'services', agendar: 'schedule', contacto: 'contact' };

export const getSeo = (page: SeoPageId, locale: Locale) => useTranslations(locale).seo[SEO_KEY[page]];
