// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, alternates } from './src/i18n/index.ts';

// Public URL used for canonical links, Open Graph and the sitemap.
// Confirm the final domain with the client and set SITE_URL in Vercel.
const site = process.env.SITE_URL ?? 'https://integrasgp.com';

export default defineConfig({
  site,
  trailingSlash: 'never',
  adapter: vercel(),
  // Spanish lives at the root and English under /en (no prefix for the default language)
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Legal placeholders are noindex until the client provides the final texts
      filter: (page) => !page.includes('/legal/'),
      // Page slugs differ per language, so hreflang pairs come from our own route table
      serialize(item) {
        const pairs = alternates(new URL(item.url).pathname);
        if (pairs.length === 0) return item;
        const links = pairs.map(({ locale, path }) => ({ url: new URL(path, site).href, lang: LOCALE_META[locale].lang }));
        const fallback = links.find((link) => link.lang === LOCALE_META[DEFAULT_LOCALE].lang);
        return { ...item, links: fallback ? [...links, { url: fallback.url, lang: 'x-default' }] : links };
      },
    }),
  ],
  env: {
    schema: {
      // Resend sends the contact form by email (never exposed to the browser)
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Sender; needs a domain verified in Resend. Falls back to Resend's onboarding sender (only delivers to the Resend account owner)
      CONTACT_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Booking widget URL per service, copied from GoHighLevel → Calendars → Share → Embed
      PUBLIC_GHL_BOOKING_VENTAS: envField.string({ context: 'client', access: 'public', optional: true, url: true }),
      PUBLIC_GHL_BOOKING_VA: envField.string({ context: 'client', access: 'public', optional: true, url: true }),
      PUBLIC_GHL_BOOKING_WEB: envField.string({ context: 'client', access: 'public', optional: true, url: true }),
      PUBLIC_GHL_BOOKING_MARKETING: envField.string({ context: 'client', access: 'public', optional: true, url: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      // Provisional stand-in for the brand typeface (Ibrand) until the client
      // provides the web font files and license.
      name: 'Quicksand',
      cssVariable: '--font-quicksand',
      provider: fontProviders.fontsource(),
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Roboto',
      cssVariable: '--font-roboto',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Roboto Slab',
      cssVariable: '--font-roboto-slab',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      // Footer typeface from the client's v3 package (Adobe variable font, wght 300–900, wdth 70–110).
      name: 'Myriad Variable Concept',
      cssVariable: '--font-myriad',
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/MyriadVariableConcept.woff2'],
            weight: '300 900',
            stretch: '70% 110%',
            style: 'normal',
          },
        ],
      },
      fallbacks: ['sans-serif'],
    },
  ],
});
