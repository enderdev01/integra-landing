import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'astro/zod';

// Astro's virtual imports are supplied explicitly; no real credentials or network are used.
function load(file, imports = {}, globals = {}) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports, URL, URLSearchParams, AbortSignal, Response, TextDecoder,
    require(id) {
      assert.ok(Object.hasOwn(imports, id), `Unexpected import: ${id}`);
      return imports[id];
    },
    ...globals,
  }, { filename: file });
  return module.exports;
}

const dictionary = load('../src/i18n/es.ts');
const contactEmail = load('../src/lib/contact-email.ts', { '../i18n/es': dictionary });
const newsletterEmail = load('../src/lib/newsletter-email.ts');
const lead = { name: 'Audit User', email: 'audit@example.test', company: 'Audit Co', service: 'ventas', consent: true };

function actions({ env = {}, verify = async () => Response.json({ success: true, action: 'newsletter' }), respond = async () => new Response(null, { status: 200 }) } = {}) {
  const requests = [];
  const errors = [];
  const serverEnv = { GHL_NEWSLETTER_WEBHOOK_URL: 'https://ghl.example.test/newsletter', RESEND_API_KEY: 'test-key', TURNSTILE_SECRET_KEY: 'test-secret', ...env };
  const globals = {
    console: { error: (...args) => errors.push(args) },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (url.includes('siteverify')) return verify(url, options);
      return respond(url, options);
    },
  };
  const delivery = load('../src/lib/newsletter-delivery.ts', {
    'node:buffer': { Buffer },
    'node:crypto': { createHash, createHmac, timingSafeEqual },
    'astro:env/server': serverEnv,
    'astro/zod': { z },
    '../config/site': { SITE: { email: 'team@example.test' } },
    './newsletter-email': newsletterEmail,
  }, globals);
  const callback = load('../src/pages/api/newsletter-welcome.ts', {
    'astro:env/server': serverEnv,
    '../../lib/newsletter-delivery': delivery,
  }, globals);
  const { server, contactSchema } = load('../src/actions/index.ts', {
    'astro:actions': {
      defineAction: (definition) => definition,
      ActionError: class extends Error {
        constructor({ code, message }) { super(message); this.code = code; }
      },
    },
    'astro:env/client': { PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key', ...env },
    'astro:env/server': serverEnv,
    'astro/zod': { z },
    '../config/site': { SITE: { email: 'team@example.test' } },
    '../content/industries': { getIndustries: () => [{ slug: 'salud' }] },
    '../lib/contact-email': contactEmail,
    '../lib/newsletter-delivery': delivery,
  }, globals);
  return {
    requests, errors, contactSchema, delivery,
    callback: (body, headers = { 'Content-Type': 'application/json' }) => callback.POST({
      request: new Request('https://integrasgp.com/api/newsletter-welcome', { method: 'POST', headers, body }),
      site: new URL('https://integrasgp.com'),
    }),
    contact: (input = lead) => server.contact.handler(server.contact.input.parse({ 'cf-turnstile-response': 'contact-token', ...input }), {}),
    newsletter: (input = {}) => server.newsletter.handler(server.newsletter.input.parse({ email: lead.email, locale: 'en', 'cf-turnstile-response': 'newsletter-token', ...input }), {}),
  };
}

test('newsletter rejects missing GHL even when email is configured', async () => {
  const app = actions({ env: { GHL_NEWSLETTER_WEBHOOK_URL: undefined } });
  await assert.rejects(app.newsletter(), { code: 'INTERNAL_SERVER_ERROR' });
  assert.equal(app.requests.length, 0);
});

test('newsletter failure never sends a welcome or returns success', async () => {
  for (const respond of [async () => new Response(null, { status: 503 }), async () => { throw new Error('network'); }]) {
    const app = actions({ respond });
    await assert.rejects(app.newsletter(), { code: 'BAD_GATEWAY' });
    assert.equal(app.requests.length, 2);
    assert.equal(app.requests[1].url, 'https://ghl.example.test/newsletter');
  }
});

test('newsletter sends the welcome only after GHL accepts the signup', async () => {
  const app = actions();
  assert.equal((await app.newsletter()).ok, true);
  assert.deepEqual(app.requests.map(({ url }) => url), ['https://challenges.cloudflare.com/turnstile/v0/siteverify', 'https://ghl.example.test/newsletter', 'https://api.resend.com/emails']);
  const message = JSON.parse(app.requests[2].options.body);
  assert.equal(message.to[0], lead.email);
  assert.match(message.text, /\/en\/schedule/);
});

test('welcome failure does not turn an accepted signup into a retry', async () => {
  const app = actions({ respond: async (url) => new Response(null, { status: url.includes('resend') ? 503 : 200 }) });
  assert.equal((await app.newsletter()).ok, true);
  assert.equal(app.errors.length, 1);
  assert.ok(!JSON.stringify(app.errors).includes(lead.email));
});

test('newsletter can register without a welcome email provider', async () => {
  const app = actions({ env: { RESEND_API_KEY: undefined } });
  assert.equal((await app.newsletter()).ok, true);
  assert.equal(app.requests.length, 2);
});

test('honeypots and link-stuffed messages do not reach providers', async () => {
  const app = actions();
  await app.newsletter({ email: lead.email, website: 'spam' });
  await app.contact({ ...lead, website: 'spam' });
  await app.contact({ ...lead, message: 'https://one.test https://two.test www.three.test' });
  assert.equal(app.requests.length, 0);
});

test('contact requires consent and bounds user input', () => {
  const { contactSchema } = actions();
  for (const invalid of [{ consent: false }, { name: ' ' }, { name: 'a'.repeat(121) }, { email: 'invalid' }, { service: 'unknown' }, { message: 'a'.repeat(2001) }]) {
    assert.equal(contactSchema.safeParse({ ...lead, ...invalid }).success, false);
  }
});

test('contact keeps its independent delivery fallback', async () => {
  const app = actions({ env: { GHL_WEBHOOK_URL: 'https://ghl.example.test/contact' }, respond: async (url) => new Response(null, { status: url.includes('resend') ? 503 : 200 }) });
  assert.equal((await app.contact()).ok, true);
  const failed = actions({ respond: async () => new Response(null, { status: 503 }) });
  await assert.rejects(failed.contact(), { code: 'BAD_GATEWAY' });
});

test('contact rejects a missing or invalid configured challenge', async () => {
  const app = actions({ verify: async () => Response.json({ success: false }) });
  await assert.rejects(app.contact({ ...lead, 'cf-turnstile-response': undefined }), { code: 'FORBIDDEN' });
  assert.equal(app.requests.length, 0);
  await assert.rejects(app.contact({ ...lead, 'cf-turnstile-response': 'invalid' }), { code: 'FORBIDDEN' });
  assert.equal(app.requests.length, 1);
  assert.match(app.requests[0].url, /siteverify$/);
});

test('newsletter cannot run with either challenge key missing', async () => {
  for (const env of [{ TURNSTILE_SECRET_KEY: undefined }, { PUBLIC_TURNSTILE_SITE_KEY: undefined }]) {
    const app = actions({ env });
    await assert.rejects(app.newsletter(), { code: 'INTERNAL_SERVER_ERROR' });
    assert.equal(app.requests.length, 0);
  }
});

test('newsletter rejects missing, invalid, wrong-action and unverifiable tokens', async () => {
  const missing = actions();
  await assert.rejects(missing.newsletter({ 'cf-turnstile-response': undefined }), { code: 'FORBIDDEN' });
  assert.equal(missing.requests.length, 0);
  for (const verify of [
    async () => Response.json({ success: false }),
    async () => Response.json({ success: true, action: 'contact' }),
    async () => Response.json({ success: true }),
    async () => new Response(null, { status: 503 }),
    async () => new Response('invalid JSON'),
    async () => { throw new Error('Cloudflare unavailable'); },
  ]) {
    const app = actions({ verify });
    await assert.rejects(app.newsletter(), { code: 'FORBIDDEN' });
    assert.equal(app.requests.length, 1);
    assert.match(app.requests[0].url, /siteverify$/);
  }
});

test('a replayed challenge never reaches the signup providers again', async () => {
  let used = false;
  const app = actions({ verify: async () => {
    const success = !used;
    used = true;
    return Response.json({ success, action: 'newsletter' });
  } });
  await app.newsletter();
  await assert.rejects(app.newsletter(), { code: 'FORBIDDEN' });
  assert.equal(app.requests.filter(({ url }) => url.includes('resend')).length, 1);
});

test('contact preserves its documented fallback during challenge outages', async () => {
  const app = actions({ verify: async () => { throw new Error('Cloudflare unavailable'); } });
  assert.equal((await app.contact()).ok, true);
});

test('concurrent signups across instances use the same provider idempotency key', async () => {
  const delivered = new Set();
  const respond = async (url, options) => {
    if (url.includes('resend')) delivered.add(options.headers['Idempotency-Key']);
    return new Response(null, { status: 200 });
  };
  const first = actions({ respond });
  const second = actions({ respond });
  await Promise.all([
    first.newsletter({ email: '  AUDIT@example.test  ', 'cf-turnstile-response': 'first-token' }),
    second.newsletter({ email: lead.email, 'cf-turnstile-response': 'second-token' }),
  ]);
  assert.equal(delivered.size, 1);
  const request = first.requests.find(({ url }) => url.includes('resend'));
  assert.equal(JSON.parse(request.options.body).to[0], lead.email);
  assert.match(request.options.headers['Idempotency-Key'], /^newsletter-welcome\/[a-f0-9]{64}$/);
  assert.ok(!request.options.headers['Idempotency-Key'].includes(lead.email));
  await second.newsletter({ email: 'another@example.test' });
  assert.equal(delivered.size, 2);
});

test('contact email escapes visitor HTML and strips subject line breaks', () => {
  const email = contactEmail.buildContactEmail({ ...lead, name: '<b>Alice</b>\r\nBcc: someone', company: 'A & B', message: '<script>alert(1)</script>\nNext line' });
  assert.ok(!email.html.includes('<script>'));
  assert.match(email.html, /&lt;script&gt;/);
  assert.match(email.html, /A &amp; B/);
  assert.match(email.html, /<br>Next line/);
  assert.doesNotMatch(email.subject, /[\r\n]/);
});

const callbackSecret = 'test-only-newsletter-secret-at-least-32-characters';

test('callback mode registers a signed token without sending a second direct welcome', async () => {
  const app = actions({ env: { NEWSLETTER_WELCOME_SECRET: callbackSecret } });
  await app.newsletter({ email: '  AUDIT@example.test  ' });
  assert.equal(app.requests.length, 2);
  const payload = JSON.parse(app.requests[1].options.body);
  const welcome = app.delivery.verifyWelcomeToken(payload.welcome_token, callbackSecret);
  assert.equal(welcome.email, lead.email);
  assert.equal(welcome.locale, 'en');
  assert.ok(!app.requests[1].options.body.includes(callbackSecret));
  assert.ok(!app.requests[1].options.body.includes('test-key'));
});

test('callback mode fails closed on an incomplete sender configuration', async () => {
  for (const env of [{ NEWSLETTER_WELCOME_SECRET: 'short' }, { NEWSLETTER_WELCOME_SECRET: callbackSecret, RESEND_API_KEY: undefined }]) {
    const app = actions({ env });
    await assert.rejects(app.newsletter(), { code: 'INTERNAL_SERVER_ERROR' });
    assert.equal(app.requests.length, 0);
    assert.equal((await app.callback('{}')).status, 503);
  }
  assert.equal((await actions().callback('{}')).status, 503);
});

test('callback rejects unsigned, modified, expired, future and malformed tokens without sending', async () => {
  const app = actions({ env: { NEWSLETTER_WELCOME_SECRET: callbackSecret } });
  const token = app.delivery.createWelcomeToken(lead.email, 'en', callbackSecret);
  const [payload, signature] = token.split('.');
  const modified = Buffer.from(JSON.stringify({ email: 'other@example.test', locale: 'en', issuedAt: Date.now() })).toString('base64url');
  for (const invalid of [undefined, null, 3, '', 'x'.repeat(1200), `${modified}.${signature}`, `${payload}.${'x'.repeat(43)}`,
    app.delivery.createWelcomeToken(lead.email, 'en', 'different-secret'),
    app.delivery.createWelcomeToken(lead.email, 'en', callbackSecret, Date.now() - 20 * 60 * 60 * 1000),
    app.delivery.createWelcomeToken(lead.email, 'en', callbackSecret, Date.now() + 60_000),
    app.delivery.createWelcomeToken('not-an-email', 'en', callbackSecret),
    app.delivery.createWelcomeToken(lead.email, 'unknown', callbackSecret),
  ]) {
    assert.equal((await app.callback(JSON.stringify({ token: invalid }))).status, 401);
  }
  assert.equal(app.requests.length, 0);
});

test('callback limits bytes and rejects malformed bodies before sending', async () => {
  const app = actions({ env: { NEWSLETTER_WELCOME_SECRET: callbackSecret } });
  assert.equal((await app.callback('{}', { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await app.callback('not JSON')).status, 400);
  assert.equal((await app.callback('null')).status, 400);
  assert.equal((await app.callback(' '.repeat(2049))).status, 413);
  assert.equal((await app.callback('é'.repeat(1025))).status, 413);
  assert.equal(app.requests.length, 0);
});

test('callback preserves ES/EN content, ignores unsigned fields and acknowledges provider acceptance', async () => {
  for (const locale of ['es', 'en']) {
    const app = actions({ env: { NEWSLETTER_WELCOME_SECRET: callbackSecret, CONTACT_FROM_EMAIL: 'Integra <sender@example.test>' } });
    const token = app.delivery.createWelcomeToken(lead.email, locale, callbackSecret);
    const result = await app.callback(JSON.stringify({ token, email: 'attacker@example.test', locale: 'unknown' }));
    assert.equal(result.status, 204);
    assert.equal(result.headers.get('cache-control'), 'no-store');
    assert.equal(app.requests.length, 1);
    const message = JSON.parse(app.requests[0].options.body);
    assert.equal(message.to[0], lead.email);
    assert.equal(message.from, 'Integra <sender@example.test>');
    assert.equal(message.reply_to, 'team@example.test');
    assert.match(message.html, locale === 'es' ? /\/agendar/ : /\/en\/schedule/);
  }
});

test('concurrent callback retries across instances reuse the email idempotency key', async () => {
  const env = { NEWSLETTER_WELCOME_SECRET: callbackSecret };
  const first = actions({ env });
  const second = actions({ env });
  const body = JSON.stringify({ token: first.delivery.createWelcomeToken(lead.email, 'en', callbackSecret) });
  await Promise.all([first.callback(body), second.callback(body)]);
  assert.equal(first.requests[0].options.headers['Idempotency-Key'], second.requests[0].options.headers['Idempotency-Key']);
  assert.equal(first.requests[0].options.body, second.requests[0].options.body);
  assert.match(first.requests[0].options.headers['Idempotency-Key'], /^newsletter-welcome\/[a-f0-9]{64}$/);
});

test('callback exposes provider failures for workflow retries without logging subscriber data', async () => {
  for (const respond of [async () => new Response(null, { status: 503 }), async () => { throw new Error('network'); }]) {
    const app = actions({ env: { NEWSLETTER_WELCOME_SECRET: callbackSecret }, respond });
    const token = app.delivery.createWelcomeToken(lead.email, 'en', callbackSecret);
    assert.equal((await app.callback(JSON.stringify({ token }))).status, 502);
    assert.equal(app.errors.length, 1);
    assert.ok(!JSON.stringify(app.errors).includes(lead.email));
  }
});
