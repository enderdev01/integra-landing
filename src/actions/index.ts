import { ActionError, defineAction } from 'astro:actions';
import { PUBLIC_TURNSTILE_SITE_KEY } from 'astro:env/client';
import { CONTACT_CC_EMAILS, CONTACT_FROM_EMAIL, GHL_NEWSLETTER_WEBHOOK_URL, GHL_WEBHOOK_URL, NEWSLETTER_WELCOME_SECRET, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { z } from 'astro/zod';
import { SITE } from '../config/site';
import { getIndustries } from '../content/industries';
import { buildContactEmail } from '../lib/contact-email';
import { createWelcomeToken, sendWelcome } from '../lib/newsletter-delivery';

const SERVICE_VALUES = ['ventas', 'virtual-assistance', 'diseno-web', 'marketing', 'direct-hire'] as const;

// Industry slugs are identical in every language; 'otra' is the form's "other" option
const INDUSTRY_VALUES = ['otra', ...getIndustries('es').map(({ slug }) => slug)] as [string, ...string[]];
const MAX_LINKS = 2;
const countLinks = (text: string) => text.match(/https?:\/\/|www\./gi)?.length ?? 0;

export const contactSchema = z.object({
  name: z.string().trim().min(3, 'Escribe tu nombre y apellido.').max(120),
  email: z.email('Usa un correo válido, por ejemplo nombre@empresa.com.').max(160),
  company: z.string().trim().min(2, 'Escribe el nombre de tu empresa.').max(160),
  service: z.enum(SERVICE_VALUES, { error: 'Elige un servicio.' }),
  industry: z.union([z.enum(INDUSTRY_VALUES), z.literal('')]).optional(),
  message: z.string().trim().max(2000, 'Usa como máximo 2000 caracteres.').optional(),
  consent: z.boolean().refine((value) => value, 'Acepta la política para continuar.'),
  // Honeypot: real people never see or fill this field. Accept any value so a
  // filled one reaches the handler's silent success instead of a rejection.
  website: z.string().optional(),
  // Injected by the Turnstile widget; only checked when TURNSTILE_SECRET_KEY is set
  'cf-turnstile-response': z.string().optional(),
});

// Team members copied on every contact email; kept in an env var because this repository is public
const contactCc = (CONTACT_CC_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);

type Lead = Omit<z.infer<typeof contactSchema>, 'website' | 'cf-turnstile-response'>;

// A null result is an outage: contact preserves its fallback, newsletter rejects it.
const passesTurnstile = async (secret: string, token: string | undefined, ip: string | undefined, action?: string) => {
  if (!token) return false;
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, ...(ip && { remoteip: ip }) }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => null);
  if (!response?.ok) return null;
  const result = (await response.json().catch(() => null)) as { success?: boolean; action?: string } | null;
  return result ? result.success === true && (!action || result.action === action) : null;
};

const sendToGhl = async (url: string, lead: Lead) => {
  const [firstName, ...rest] = lead.name.split(/\s+/);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: lead.name,
      firstName,
      lastName: rest.join(' '),
      email: lead.email,
      companyName: lead.company,
      service: lead.service,
      industry: lead.industry ?? '',
      message: lead.message ?? '',
      source: 'Integra website contact form',
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok);
};

const sendByEmail = async (apiKey: string, lead: Lead) => {
  const { subject, html, text } = buildContactEmail(lead);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL ?? 'Integra Web <onboarding@resend.dev>',
      to: [SITE.email],
      ...(contactCc.length > 0 && { cc: contactCc }),
      reply_to: lead.email,
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok);
};

const SITE_FALLBACK = new URL('https://integrasgp.com');

const sendSubscriberToGhl = async (url: string, email: string, locale: 'es' | 'en') => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email, language: locale, tags: ['newsletter'], source: 'Integra website newsletter',
      ...(NEWSLETTER_WELCOME_SECRET && { welcome_token: createWelcomeToken(email, locale, NEWSLETTER_WELCOME_SECRET) }),
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok);
};

export const newsletterSchema = z.object({
  email: z.string().trim().pipe(z.email('Usa un correo válido, por ejemplo nombre@empresa.com.').max(160)).transform((email) => email.toLowerCase()),
  locale: z.enum(['es', 'en']).catch('es'),
  // Honeypot, same as the contact form: a filled one gets a silent success
  website: z.string().optional(),
  'cf-turnstile-response': z.string().max(2048).optional(),
});

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactSchema,
    handler: async ({ website, 'cf-turnstile-response': turnstileToken, ...lead }, context) => {
      if (website) return { ok: true };
      // Link-stuffed messages are spam: pretend success so the bot learns nothing
      if (countLinks(lead.message ?? '') > MAX_LINKS) return { ok: true };

      if (TURNSTILE_SECRET_KEY && (await passesTurnstile(TURNSTILE_SECRET_KEY, turnstileToken, context.clientAddress)) === false) {
        throw new ActionError({ code: 'FORBIDDEN', message: 'No pudimos verificar que eres una persona. Inténtalo de nuevo.' });
      }

      // Every lead goes to GoHighLevel (contact + automations) and to Integra's inbox (full details,
      // including service, industry and message). Either one reaching its destination keeps the lead.
      const [sentToGhl, sentByEmail] = await Promise.all([
        GHL_WEBHOOK_URL ? sendToGhl(GHL_WEBHOOK_URL, lead) : false,
        RESEND_API_KEY ? sendByEmail(RESEND_API_KEY, lead) : false,
      ]);
      if (!sentToGhl && !sentByEmail) {
        throw new ActionError(
          GHL_WEBHOOK_URL || RESEND_API_KEY
            ? { code: 'BAD_GATEWAY', message: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.' }
            : { code: 'INTERNAL_SERVER_ERROR', message: 'El formulario no está configurado. Escríbenos o agenda una llamada.' },
        );
      }

      return { ok: true };
    },
  }),
  newsletter: defineAction({
    accept: 'form',
    input: newsletterSchema,
    handler: async ({ website, email, locale, 'cf-turnstile-response': turnstileToken }, context) => {
      if (website) return { ok: true };

      if (!GHL_NEWSLETTER_WEBHOOK_URL || !TURNSTILE_SECRET_KEY || !PUBLIC_TURNSTILE_SITE_KEY ||
          (NEWSLETTER_WELCOME_SECRET && (NEWSLETTER_WELCOME_SECRET.length < 32 || !RESEND_API_KEY))) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'La suscripción no está configurada. Escríbenos y te sumamos a mano.',
        });
      }

      if ((await passesTurnstile(TURNSTILE_SECRET_KEY, turnstileToken, context.clientAddress, 'newsletter')) !== true) {
        throw new ActionError({ code: 'FORBIDDEN', message: 'No pudimos verificar que eres una persona. Inténtalo de nuevo.' });
      }

      // GHL owns the subscriber list; a welcome email alone is not a subscription.
      if (!(await sendSubscriberToGhl(GHL_NEWSLETTER_WEBHOOK_URL, email, locale))) {
        throw new ActionError({
          code: 'BAD_GATEWAY',
          message: 'No pudimos completar tu suscripción. Inténtalo de nuevo en unos minutos.',
        });
      }

      // Without the callback secret, preserve the existing sender until the GHL cutover is ready.
      if (!NEWSLETTER_WELCOME_SECRET && RESEND_API_KEY && !(await sendWelcome(RESEND_API_KEY, email, locale, context.site ?? SITE_FALLBACK))) {
        console.error('Newsletter signup accepted by GHL, but welcome email delivery failed.');
      }

      return { ok: true };
    },
  }),
};
