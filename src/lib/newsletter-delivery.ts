import { Buffer } from 'node:buffer';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { CONTACT_FROM_EMAIL } from 'astro:env/server';
import { z } from 'astro/zod';
import { SITE } from '../config/site';
import { buildWelcomeEmail, type NewsletterLocale } from './newsletter-email';

const welcomeTokenSchema = z.object({
  email: z.email().max(160),
  locale: z.enum(['es', 'en']),
  issuedAt: z.number().int().nonnegative(),
});

// Expire before Resend's 24h deduplication window; late workflow replays need manual review.
const TOKEN_LIFETIME_MS = 20 * 60 * 60 * 1000;

export function createWelcomeToken(email: string, locale: NewsletterLocale, secret: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ email, locale, issuedAt: now })).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyWelcomeToken(token: unknown, secret: string, now = Date.now()) {
  if (typeof token !== 'string') return null;
  const match = /^([A-Za-z0-9_-]{1,1024})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return null;
  const signature = createHmac('sha256', secret).update(match[1]).digest('base64url');
  if (!timingSafeEqual(Buffer.from(match[2]), Buffer.from(signature))) return null;
  try {
    const parsed = welcomeTokenSchema.safeParse(JSON.parse(Buffer.from(match[1], 'base64url').toString('utf8')));
    if (!parsed.success || parsed.data.issuedAt > now + 30_000 || now - parsed.data.issuedAt >= TOKEN_LIFETIME_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export async function sendWelcome(apiKey: string, email: string, locale: NewsletterLocale, site: URL) {
  const { subject, html, text } = buildWelcomeEmail(locale, site.origin);
  // GHL controls one-time enrollment; this key also covers concurrent callback retries for 24h.
  const idempotencyKey = `newsletter-welcome/${createHash('sha256').update(email).digest('hex')}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL ?? 'Integra Web <onboarding@resend.dev>',
      to: [email],
      reply_to: SITE.email,
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return Boolean(response?.ok);
}
