import { ActionError, defineAction } from 'astro:actions';
import { CONTACT_FROM_EMAIL, GHL_NEWSLETTER_WEBHOOK_URL, RESEND_API_KEY } from 'astro:env/server';
import { z } from 'astro/zod';
import { SITE } from '../config/site';
import { buildContactEmail } from '../lib/contact-email';
import { buildWelcomeEmail } from '../lib/newsletter-email';

const SERVICE_VALUES = ['ventas', 'virtual-assistance', 'diseno-web', 'marketing', 'direct-hire'] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(3, 'Escribe tu nombre y apellido.').max(120),
  email: z.email('Usa un correo válido, por ejemplo nombre@empresa.com.').max(160),
  company: z.string().trim().min(2, 'Escribe el nombre de tu empresa.').max(160),
  service: z.enum(SERVICE_VALUES, { error: 'Elige un servicio.' }),
  industry: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000, 'Usa como máximo 2000 caracteres.').optional(),
  consent: z.boolean().refine((value) => value, 'Acepta la política para continuar.'),
  // Honeypot: real people never see or fill this field. Accept any value so a
  // filled one reaches the handler's silent success instead of a rejection.
  website: z.string().optional(),
});

const SITE_FALLBACK = new URL('https://integrasgp.com');

const sendToGhl = async (url: string, email: string, locale: string) => {
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
    handler: async ({ website, ...lead }) => {
      if (website) return { ok: true };

      if (!RESEND_API_KEY) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'El formulario no está configurado. Escríbenos o agenda una llamada.',
        });
      }

      const { subject, html, text } = buildContactEmail(lead);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL ?? 'Integra Web <onboarding@resend.dev>',
          to: [SITE.email],
          reply_to: lead.email,
          subject,
          html,
          text,
        }),
        signal: AbortSignal.timeout(10_000),
      }).catch(() => null);

      if (!response?.ok) {
        throw new ActionError({
          code: 'BAD_GATEWAY',
          message: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.',
        });
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
        GHL_NEWSLETTER_WEBHOOK_URL ? sendToGhl(GHL_NEWSLETTER_WEBHOOK_URL, email, locale) : false,
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
