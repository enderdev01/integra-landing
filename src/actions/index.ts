import { ActionError, defineAction } from 'astro:actions';
import { CONTACT_FROM_EMAIL, GHL_NEWSLETTER_WEBHOOK_URL, GHL_WEBHOOK_URL, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { z } from 'astro/zod';
import { SITE } from '../config/site';
import { getIndustries } from '../content/industries';
import { buildContactEmail } from '../lib/contact-email';
import { buildWelcomeEmail } from '../lib/newsletter-email';

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

const CONTACT_CC_EMAILS = ['m.meza@integrasgp.com', 'g.tellez@integrasgp.com', 'r.roiz@integrasgp.com'];

type Lead = Omit<z.infer<typeof contactSchema>, 'website' | 'cf-turnstile-response'>;

// Fails open when Cloudflare is unreachable so a Turnstile outage never costs a real lead
const passesTurnstile = async (secret: string, token: string | undefined, ip: string | undefined) => {
  if (!token) return false;
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, ...(ip && { remoteip: ip }) }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => null);
  if (!response?.ok) return true;
  const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
  return result ? result.success === true : true;
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
      cc: CONTACT_CC_EMAILS,
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

const sendSubscriberToGhl = async (url: string, email: string, locale: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, language: locale, tags: ['newsletter'], source: 'Integra website newsletter' }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok);
};

// With no GoHighLevel webhook the inbox gets a blind copy, so the team still has a record of the signup
const sendWelcome = async (apiKey: string, email: string, locale: 'es' | 'en', site: URL, copyInbox: boolean) => {
  const { subject, html, text } = buildWelcomeEmail(locale, site.origin);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL ?? 'Integra Web <onboarding@resend.dev>',
      to: [email],
      ...(copyInbox && { bcc: [SITE.email] }),
      reply_to: SITE.email,
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok);
};

export const newsletterSchema = z.object({
  email: z.email('Usa un correo válido, por ejemplo nombre@empresa.com.').max(160),
  locale: z.enum(['es', 'en']).catch('es'),
  // Honeypot, same as the contact form: a filled one gets a silent success
  website: z.string().optional(),
});

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactSchema,
    handler: async ({ website, 'cf-turnstile-response': turnstileToken, ...lead }, context) => {
      if (website) return { ok: true };
      // Link-stuffed messages are spam: pretend success so the bot learns nothing
      if (countLinks(lead.message ?? '') > MAX_LINKS) return { ok: true };

      if (TURNSTILE_SECRET_KEY && !(await passesTurnstile(TURNSTILE_SECRET_KEY, turnstileToken, context.clientAddress))) {
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
    handler: async ({ website, email, locale }, context) => {
      if (website) return { ok: true };

      if (!GHL_NEWSLETTER_WEBHOOK_URL && !RESEND_API_KEY) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'La suscripción no está configurada. Escríbenos y te sumamos a mano.',
        });
      }

      // The subscriber lands in GoHighLevel (contact + tag + automations) and gets the designed welcome
      // email. Either one working keeps the signup; both failing is the only error shown to the visitor.
      const [sentToGhl, sentWelcome] = await Promise.all([
        GHL_NEWSLETTER_WEBHOOK_URL ? sendSubscriberToGhl(GHL_NEWSLETTER_WEBHOOK_URL, email, locale) : false,
        RESEND_API_KEY ? sendWelcome(RESEND_API_KEY, email, locale, context.site ?? SITE_FALLBACK, !GHL_NEWSLETTER_WEBHOOK_URL) : false,
      ]);

      if (!sentToGhl && !sentWelcome) {
        throw new ActionError({
          code: 'BAD_GATEWAY',
          message: 'No pudimos completar tu suscripción. Inténtalo de nuevo en unos minutos.',
        });
      }

      return { ok: true };
    },
  }),
};
