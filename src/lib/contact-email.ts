import { INDUSTRIES } from '../content/industries';

export interface ContactLead {
  name: string;
  email: string;
  company: string;
  service: string;
  industry?: string;
  message?: string;
}

// Labels for the service slugs accepted by the contact action.
// Kept here (not imported from content/services) so the server bundle never pulls image assets.
const SERVICE_LABELS: Record<string, string> = {
  ventas: 'Ventas',
  'virtual-assistance': 'Virtual Assistance',
  'diseno-web': 'Diseño Web',
  marketing: 'Marketing Services',
};

const serviceLabel = (slug: string) => SERVICE_LABELS[slug] ?? slug;
const industryLabel = (slug?: string) =>
  slug ? (slug === 'otra' ? 'Otra' : (INDUSTRIES.find((industry) => industry.slug === slug)?.name ?? slug)) : '';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Email clients ignore external CSS and custom fonts, so everything is table layout + inline styles
// with the brand palette from global.css.
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

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid ${COLOR.line};width:130px;vertical-align:top;font:600 12px/1.4 ${FONT};letter-spacing:0.06em;text-transform:uppercase;color:${COLOR.muted};">${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid ${COLOR.line};vertical-align:top;font:500 16px/1.5 ${FONT};color:${COLOR.ink};">${value}</td>
  </tr>`;

export function buildContactEmail(lead: ContactLead) {
  const service = serviceLabel(lead.service);
  const industry = industryLabel(lead.industry);
  const subject = `Nueva solicitud (${service}): ${lead.name} - ${lead.company}`.replace(/[\r\n]+/g, ' ');

  const name = escapeHtml(lead.name);
  const email = escapeHtml(lead.email);
  const company = escapeHtml(lead.company);
  const message = lead.message ? escapeHtml(lead.message).replace(/\r?\n/g, '<br>') : '';
  const replyHref = `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent('Re: tu solicitud a Integra')}`;

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.mist};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${name} de ${company} pidió información sobre ${escapeHtml(service)}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.mist};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:${COLOR.blue};padding:28px 36px;">
              <span style="font:700 30px/1 ${FONT};letter-spacing:-0.02em;color:${COLOR.lime};">integra</span>
            </td>
          </tr>
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:${COLOR.lime};">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 36px 8px;">
              <p style="margin:0 0 8px;font:600 12px/1.4 ${FONT};letter-spacing:0.08em;text-transform:uppercase;color:${COLOR.muted};">Formulario de contacto</p>
              <h1 style="margin:0;font:700 26px/1.25 ${FONT};color:${COLOR.blue};">Nueva solicitud de ${name}</h1>
              <p style="margin:12px 0 0;font:400 16px/1.6 ${FONT};color:${COLOR.body};">Alguien pidió una propuesta desde el sitio web. Estos son sus datos:</p>
              <p style="margin:18px 0 0;"><span style="display:inline-block;padding:6px 14px;border-radius:999px;background:${COLOR.limeSoft};font:600 14px/1.4 ${FONT};color:${COLOR.navy};">${escapeHtml(service)}</span></p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${row('Nombre', name)}
                ${row('Correo', `<a href="mailto:${email}" style="color:${COLOR.blue};text-decoration:none;font-weight:600;">${email}</a>`)}
                ${row('Empresa', company)}
                ${row('Servicio', escapeHtml(service))}
                ${industry ? row('Industria', escapeHtml(industry)) : ''}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 8px;">
              <p style="margin:0 0 10px;font:600 12px/1.4 ${FONT};letter-spacing:0.06em;text-transform:uppercase;color:${COLOR.muted};">Mensaje</p>
              <div style="padding:18px 20px;border-radius:12px;border-left:4px solid ${COLOR.lime};background:${COLOR.mist};font:400 16px/1.65 ${FONT};color:${COLOR.body};">${message || `<span style="color:${COLOR.muted};">El visitante no dejó un mensaje.</span>`}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 40px;">
              <a href="${replyHref}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:${COLOR.lime};font:700 16px/1 ${FONT};color:${COLOR.navy};text-decoration:none;">Responder a ${name.split(' ')[0]}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px;background:${COLOR.navy};font:400 13px/1.6 ${FONT};color:#c9d6e0;">
              Enviado desde el formulario de contacto de Integra. Al responder este correo escribes directo a ${email}.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Nueva solicitud de contacto`,
    '',
    `Nombre: ${lead.name}`,
    `Correo: ${lead.email}`,
    `Empresa: ${lead.company}`,
    `Servicio: ${service}`,
    ...(industry ? [`Industria: ${industry}`] : []),
    '',
    'Mensaje:',
    lead.message || '(sin mensaje)',
  ].join('\n');

  return { subject, html, text };
}
