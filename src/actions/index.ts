import { ActionError, defineAction } from 'astro:actions';
import { CONTACT_FROM_EMAIL, GHL_WEBHOOK_URL, RESEND_API_KEY } from 'astro:env/server';
import { z } from 'astro/zod';
import { SITE } from '../config/site';
import { buildContactEmail } from '../lib/contact-email';

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

type Lead = Omit<z.infer<typeof contactSchema>, 'website'>;

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
      reply_to: lead.email,
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok);
};

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactSchema,
    handler: async ({ website, ...lead }) => {
      if (website) return { ok: true };

      // GoHighLevel is the primary destination; the Resend email is the fallback so a lead is never lost
      const sentToGhl = GHL_WEBHOOK_URL ? await sendToGhl(GHL_WEBHOOK_URL, lead) : false;
      if (sentToGhl) return { ok: true };

      const sentByEmail = RESEND_API_KEY ? await sendByEmail(RESEND_API_KEY, lead) : false;
      if (!sentByEmail) {
        throw new ActionError(
          GHL_WEBHOOK_URL || RESEND_API_KEY
            ? { code: 'BAD_GATEWAY', message: 'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.' }
            : { code: 'INTERNAL_SERVER_ERROR', message: 'El formulario no está configurado. Escríbenos o agenda una llamada.' },
        );
      }

      return { ok: true };
    },
  }),
};
