import type { ArtworkName } from '../components/ui/artwork';
import { useTranslations, type Locale } from '../i18n';
import type { IndustryCopy } from '../i18n/types';

export interface Industry extends IndustryCopy {
  /** Anchor on /servicios and value of the industry query parameter on /contacto. Same in every language. */
  slug: string;
  /** Decorative pictogram from the v3 artwork */
  icon: ArtworkName;
}

// Language-independent data; every piece of text lives in src/i18n
const BASE: { slug: string; icon: ArtworkName }[] = [
  { slug: 'bienes-raices', icon: 'industry-real-estate' },
  { slug: 'saas', icon: 'industry-saas' },
  { slug: 'firmas-legales', icon: 'industry-legal' },
  { slug: 'salud', icon: 'industry-health' },
];

export const getIndustries = (locale: Locale): Industry[] => {
  const copy = useTranslations(locale).industries;
  return BASE.map((base) => ({ ...base, ...copy[base.slug] }));
};
