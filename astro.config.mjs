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
      // Resend sends the contact form by email (never exposed to the browser)
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Inbox that receives the contact form
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
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
