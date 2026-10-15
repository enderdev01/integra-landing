// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Public URL used for canonical links, Open Graph and the sitemap.
// Confirm the final domain with the client and set SITE_URL in Vercel.
const site = process.env.SITE_URL ?? 'https://integrasgp.com';

export default defineConfig({
  site,
  trailingSlash: 'never',
  adapter: vercel(),
  // Legal placeholders are noindex until the client provides the final texts
  integrations: [sitemap({ filter: (page) => !page.includes('/legal/') })],
  env: {
    schema: {
      // GoHighLevel inbound webhook that receives the contact form (never exposed to the browser)
      GHL_CONTACT_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true, url: true }),
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
  ],
});
