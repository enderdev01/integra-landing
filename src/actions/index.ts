import { ActionError, defineAction } from 'astro:actions';
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { z } from 'astro/zod';
import { buildContactEmail } from '../lib/contact-email';

const SERVICE_VALUES = ['ventas', 'virtual-assistance', 'diseno-web', 'marketing'] as const;

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

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactSchema,
    handler: async ({ website, ...lead }) => {
      if (website) return { ok: true };

      if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
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
          to: [CONTACT_TO_EMAIL],
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
};
