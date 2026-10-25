import type { APIRoute } from 'astro';
import { NEWSLETTER_WELCOME_SECRET, RESEND_API_KEY } from 'astro:env/server';
import { sendWelcome, verifyWelcomeToken } from '../../lib/newsletter-delivery';

export const prerender = false;

export const POST: APIRoute = async ({ request, site }) => {
  const reply = (status: number) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
  if (!NEWSLETTER_WELCOME_SECRET || NEWSLETTER_WELCOME_SECRET.length < 32 || !RESEND_API_KEY) return reply(503);
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply(415);

  const reader = request.body?.getReader();
  if (!reader) return reply(400);
  let body = '';
  let size = 0;
  const decoder = new TextDecoder();
  let token: unknown;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) {
        await reader.cancel();
        return reply(413);
      }
      body += decoder.decode(value, { stream: true });
    }
    token = JSON.parse(body + decoder.decode()).token;
  } catch {
    return reply(400);
  } finally {
    reader.releaseLock();
  }

  const welcome = verifyWelcomeToken(token, NEWSLETTER_WELCOME_SECRET);
  if (!welcome) return reply(401);
  const accepted = await sendWelcome(RESEND_API_KEY, welcome.email, welcome.locale, site ?? new URL('https://integrasgp.com'));
  if (!accepted) console.error('Newsletter welcome callback was not accepted by the email provider.');
  return reply(accepted ? 204 : 502);
};
