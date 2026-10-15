import { ActionError, defineAction } from 'astro:actions';
import { GHL_CONTACT_WEBHOOK_URL } from 'astro:env/server';
import { z } from 'astro/zod';

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
    handler: async ({ website, consent, ...lead }) => {
      if (website) return { ok: true };

      if (!GHL_CONTACT_WEBHOOK_URL) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'El formulario no está configurado. Escríbenos o agenda una llamada.',
        });
      }

      const response = await fetch(GHL_CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          consent,
          source: 'web-contacto',
          submittedAt: new Date().toISOString(),
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
