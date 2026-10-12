// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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
  integrations: [sitemap()],
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
