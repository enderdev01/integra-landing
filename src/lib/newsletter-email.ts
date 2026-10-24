export type NewsletterLocale = 'es' | 'en';

// Subscriber-facing copy lives here (not in the i18n dictionaries) so the server bundle stays small.
const COPY = {
  es: {
    lang: 'es',
    subject: 'Bienvenido al newsletter de Integra',
    preheader: 'Gracias por suscribirte. Esto es lo que vas a recibir.',
    kicker: 'Newsletter',
    title: '¡Gracias por suscribirte!',
    lead: 'Ya eres parte de la lista de Integra. Una vez al mes te escribiremos con ideas prácticas para hacer crecer tu operación con estructura y calidad.',
    expectTitle: 'Qué vas a recibir',
    expect: [
      ['Equipos remotos', 'Cómo sumar ventas, soporte y back office sin cargar tu operación.'],
      ['Ventas y marketing', 'Tácticas para generar y dar seguimiento a oportunidades.'],
      ['Casos y novedades', 'Lo que estamos construyendo con negocios como el tuyo.'],
    ],
    ctaLead: '¿Prefieres hablar ahora? Agenda una llamada y cuéntanos qué necesitas.',
    cta: 'Agendar una llamada',
    footer: 'Recibes este correo porque te suscribiste al newsletter en integrasgp.com. Para darte de baja, responde a este correo con la palabra «baja».',
    textIntro: 'Gracias por suscribirte al newsletter de Integra.',
    textCta: 'Agenda una llamada:',
    textFooter: 'Para darte de baja, responde a este correo con la palabra «baja».',
    schedulePath: '/agendar',
  },
  en: {
    lang: 'en',
    subject: 'Welcome to the Integra newsletter',
    preheader: 'Thanks for subscribing. Here is what to expect.',
    kicker: 'Newsletter',
    title: 'Thanks for subscribing!',
    lead: 'You are now on the Integra list. Once a month we will send you practical ideas to grow your operation with structure and quality.',
    expectTitle: 'What you will get',
    expect: [
      ['Remote teams', 'How to add sales, support and back office without overloading your operation.'],
      ['Sales and marketing', 'Tactics to generate and follow up on opportunities.'],
      ['Stories and news', 'What we are building with businesses like yours.'],
    ],
    ctaLead: 'Prefer to talk now? Book a call and tell us what you need.',
    cta: 'Book a call',
    footer: 'You are receiving this email because you subscribed to the newsletter at integrasgp.com. To unsubscribe, reply to this email with the word "unsubscribe".',
    textIntro: 'Thanks for subscribing to the Integra newsletter.',
    textCta: 'Book a call:',
    textFooter: 'To unsubscribe, reply to this email with the word "unsubscribe".',
    schedulePath: '/en/schedule',
  },
} as const;

// Email clients ignore external CSS and custom fonts, so everything is table layout + inline styles
// with the brand palette from global.css (same as the contact email).
const COLOR = {
  blue: '#005b94',
  navy: '#00385c',
  lime: '#a3c622',
  limeSoft: '#f3f8e2',
  ink: '#1b2a41',
  body: '#2b3440',
  muted: '#6b7682',
  mist: '#f4f7f9',
  line: '#dce3ea',
};
const FONT = "Roboto, 'Helvetica Neue', Arial, sans-serif";

const bullet = ([heading, text]: readonly [string, string]) => `
  <tr>
    <td style="width:12px;padding:6px 14px 14px 0;vertical-align:top;"><span style="display:block;width:10px;height:10px;margin-top:6px;border-radius:50%;background:${COLOR.lime};font-size:0;line-height:0;">&nbsp;</span></td>
    <td style="padding:0 0 14px;vertical-align:top;font:400 15px/1.55 ${FONT};color:${COLOR.body};"><strong style="color:${COLOR.ink};">${heading}.</strong> ${text}</td>
  </tr>`;

export function buildWelcomeEmail(locale: NewsletterLocale, siteUrl: string) {
  const copy = COPY[locale];
  const base = siteUrl.replace(/\/$/, '');
  const scheduleUrl = `${base}${copy.schedulePath}`;

  const html = `<!doctype html>
<html lang="${copy.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${copy.subject}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.mist};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${copy.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.mist};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:${COLOR.blue};padding:28px 36px;">
              <a href="${base}" style="font:700 30px/1 ${FONT};letter-spacing:-0.02em;color:${COLOR.lime};text-decoration:none;">integra</a>
            </td>
          </tr>
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:${COLOR.lime};">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 36px 8px;">
              <p style="margin:0 0 8px;font:600 12px/1.4 ${FONT};letter-spacing:0.08em;text-transform:uppercase;color:${COLOR.muted};">${copy.kicker}</p>
              <h1 style="margin:0;font:700 28px/1.25 ${FONT};color:${COLOR.blue};">${copy.title}</h1>
              <p style="margin:14px 0 0;font:400 16px/1.65 ${FONT};color:${COLOR.body};">${copy.lead}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 4px;">
              <div style="padding:22px 24px 8px;border-radius:12px;background:${COLOR.limeSoft};">
                <p style="margin:0 0 14px;font:700 13px/1.4 ${FONT};letter-spacing:0.06em;text-transform:uppercase;color:${COLOR.navy};">${copy.expectTitle}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${copy.expect.map(bullet).join('')}
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 8px;">
              <p style="margin:0;font:400 16px/1.65 ${FONT};color:${COLOR.body};">${copy.ctaLead}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px 40px;">
              <a href="${scheduleUrl}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:${COLOR.lime};font:700 16px/1 ${FONT};color:${COLOR.navy};text-decoration:none;">${copy.cta}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px;background:${COLOR.navy};font:400 13px/1.6 ${FONT};color:#c9d6e0;">${copy.footer}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    copy.textIntro,
    '',
    copy.lead,
    '',
    `${copy.expectTitle}:`,
    ...copy.expect.map(([heading, line]) => `- ${heading}. ${line}`),
    '',
    `${copy.textCta} ${scheduleUrl}`,
    '',
    copy.textFooter,
  ].join('\n');

  return { subject: copy.subject, html, text };
}
