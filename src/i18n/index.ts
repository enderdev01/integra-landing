import { en } from './en';
import { es } from './es';
import type { Dictionary } from './types';

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

/** Language tags: `lang` for <html>/hreflang, `og` for Open Graph, `name` for the switcher */
export const LOCALE_META: Record<Locale, { lang: string; og: string; name: string }> = {
  es: { lang: 'es', og: 'es_US', name: 'Español' },
  en: { lang: 'en', og: 'en_US', name: 'English' },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };
export const useTranslations = (locale: Locale) => dictionaries[locale];

/** Cookie set by the language switcher; vercel.json skips auto-detection when it exists */
export const LANG_COOKIE = 'lang';

export type RouteKey = 'home' | 'services' | 'schedule' | 'contact';

const ROUTES: Record<RouteKey, Record<Locale, string>> = {
  home: { es: '/', en: '/en' },
  services: { es: '/servicios', en: '/en/services' },
  schedule: { es: '/agendar', en: '/en/schedule' },
  contact: { es: '/contacto', en: '/en/contact' },
};

const LEGAL_PREFIX: Record<Locale, string> = { es: '/legal', en: '/en/legal' };

/** Query-string keys for the preselection links (the pages read both, whatever the language) */
export const PARAMS: Record<Locale, { service: string; industry: string }> = {
  es: { service: 'servicio', industry: 'industria' },
  en: { service: 'service', industry: 'industry' },
};

export const localeFromPath = (pathname: string): Locale =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';

export const getLocale = (url: URL): Locale => localeFromPath(url.pathname);

export const routePath = (key: RouteKey, locale: Locale) => ROUTES[key][locale];
export const legalPath = (slug: string, locale: Locale) => `${LEGAL_PREFIX[locale]}/${slug}`;

const stripSlash = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname);

/** The same page in another language; unknown paths (404) fall back to that language's home */
export function alternatePath(pathname: string, target: Locale): string {
  const path = stripSlash(pathname);
  for (const paths of Object.values(ROUTES)) {
    if (Object.values(paths).includes(path)) return paths[target];
  }
  for (const prefix of Object.values(LEGAL_PREFIX)) {
    if (path.startsWith(`${prefix}/`)) return `${LEGAL_PREFIX[target]}/${path.slice(prefix.length + 1)}`;
  }
  return ROUTES.home[target];
}

/** Localized paths of one page, for hreflang and the sitemap. Empty when the page has no twin. */
export function alternates(pathname: string): { locale: Locale; path: string }[] {
  const path = stripSlash(pathname);
  const known =
    Object.values(ROUTES).some((paths) => Object.values(paths).includes(path)) ||
    Object.values(LEGAL_PREFIX).some((prefix) => path.startsWith(`${prefix}/`));
  return known ? LOCALES.map((locale) => ({ locale, path: alternatePath(path, locale) })) : [];
}

/** `/agendar?servicio=ventas` in the visitor's language */
export function bookingHref(locale: Locale, service?: string) {
  const base = routePath('schedule', locale);
  return service ? `${base}?${PARAMS[locale].service}=${encodeURIComponent(service)}` : base;
}

export const contactHref = (locale: Locale, params?: { service?: string; industry?: string }) => {
  const query = new URLSearchParams();
  if (params?.service) query.set(PARAMS[locale].service, params.service);
  if (params?.industry) query.set(PARAMS[locale].industry, params.industry);
  const qs = query.toString();
  return qs ? `${routePath('contact', locale)}?${qs}` : routePath('contact', locale);
};

export const servicesHref = (locale: Locale, anchor?: string) =>
  anchor ? `${routePath('services', locale)}#${anchor}` : routePath('services', locale);

/** `{name}`-style placeholders in dictionary strings */
export const format = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
