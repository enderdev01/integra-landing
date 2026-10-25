async page => {
  const base = 'http://127.0.0.1:4321';
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.context().route('**/*', route => route.request().url().startsWith(`${base}/`) ? route.continue() : route.abort());

  for (const path of ['/legal/privacy-policy/', '/legal/terms-of-service/']) {
    await page.goto(`${base}${path}`);
    const language = await page.locator('main h2').first().evaluate(el => el.closest('[lang]').lang);
    check(language === 'en', `${path}: English legal text must use lang=en`);
  }

  await page.route('**/_actions/contact*', route => route.abort());
  await page.goto(`${base}/en/contact/`);
  check(await page.locator('[data-submit]').isEnabled(), 'JavaScript must enable contact submission');
  await page.evaluate(() => {
    window.auditResets = 0;
    window.turnstile = { reset: () => window.auditResets++ };
  });
  await page.locator('#f-name').fill('Audit User');
  await page.locator('#f-email').fill('audit@example.test');
  await page.locator('#f-company').fill('Audit Co');
  await page.locator('#f-service').selectOption('ventas');
  await page.locator('#f-consent').check();
  await page.locator('[data-submit]').click();
  await page.locator('[data-summary]').waitFor({ state: 'visible' });
  check(await page.evaluate(() => window.auditResets) === 1, 'Network errors must reset Turnstile');
  check(await page.locator('[data-submit]').isEnabled(), 'Network errors must allow another attempt');

  const context = await page.context().browser().newContext({ javaScriptEnabled: false });
  try {
    await context.route('**/*', route => route.request().url().startsWith(`${base}/`) ? route.continue() : route.abort());
    const nojs = await context.newPage();
    for (const path of ['/contacto/', '/en/contact/']) {
      await nojs.goto(`${base}${path}`);
      check(await nojs.locator('[data-submit]').isDisabled(), 'Contact must not submit before its JavaScript handler is ready');
      check(await nojs.locator('noscript').isVisible(), 'Contact must explain its JavaScript requirement');
      const method = await nojs.locator('[data-contact-form]').evaluate(form => form.method);
      check(method === 'post', 'Contact must never send private fields via GET');
      await nojs.locator('#f-name').fill('Private inquiry');
      await nojs.locator('#f-name').press('Enter');
      check(!nojs.url().includes('?'), 'Implicit submission must not leak contact data into the URL');
    }
  } finally {
    await context.close();
  }

  // This script replaces Cloudflare, not just the response token: no live challenge is contacted.
  await page.context().route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({
    contentType: 'application/javascript',
    body: `
      window.auditChallenge = { renders: 0, resets: 0 };
      window.turnstile = {
        render(container, options) {
          window.auditChallenge.renders++;
          window.auditChallenge.renderedWhileOpen = container.closest('dialog').open;
          window.auditChallenge.options = options;
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'cf-turnstile-response';
          container.append(input);
          window.auditChallenge.solve = () => { input.value = 'test-token'; options.callback(input.value); };
          window.auditChallenge.solve();
          return 'newsletter-widget';
        },
        reset(id) {
          if (id !== 'newsletter-widget') throw new Error('Wrong widget reset');
          window.auditChallenge.resets++;
          document.querySelector('[name="cf-turnstile-response"]').value = '';
        }
      };
    `,
  }));
  for (const path of ['/', '/en/']) {
    await page.route('**/_actions/newsletter*', route => route.abort());
    await page.goto(`${base}${path}`);
    const button = page.locator('[data-newsletter-submit]');
    if (await page.locator('[data-newsletter-turnstile]').count() === 0) {
      check(await button.isDisabled(), 'Missing site key must disable newsletter submission');
      check(await page.locator('[data-newsletter-error]').isVisible(), 'Missing site key must show an explanation');
      continue;
    }
    await button.waitFor({ state: 'visible' });
    await page.waitForFunction(() => !document.querySelector('[data-newsletter-submit]').disabled);
    check(await page.evaluate(() => window.auditChallenge.renderedWhileOpen), 'Challenge must render after the modal opens');
    check(await page.evaluate(() => window.auditChallenge.options.action) === 'newsletter', 'Challenge must be scoped to newsletter');
    await page.evaluate(() => window.auditChallenge.options['expired-callback']());
    check(await button.isDisabled(), 'Expired challenges must disable submission');
    await page.evaluate(() => window.auditChallenge.solve());
    await page.locator('[data-newsletter-close]').first().click();
    await page.locator('[data-newsletter-launcher]').click();
    check(await page.evaluate(() => window.auditChallenge.renders) === 1, 'Reopening must reuse the widget');

    await page.locator('#nl-email').fill('audit@example.test');
    await button.click();
    await page.waitForFunction(() => window.auditChallenge.resets === 1);
    check(await button.isDisabled(), 'Network errors must require a fresh token');
    check(await page.locator('[data-newsletter-error]').isVisible(), 'Network errors must be visible');
    await page.evaluate(() => window.auditChallenge.solve());

    await page.route('**/_actions/newsletter*', route => route.fulfill({
      status: 403, contentType: 'application/json',
      body: JSON.stringify({ type: 'AstroActionError', code: 'FORBIDDEN', message: 'Rejected challenge' }),
    }));
    await button.click();
    await page.waitForFunction(() => window.auditChallenge.resets === 2);
    check(await button.isDisabled(), 'Server rejection must require a fresh token');
    await page.evaluate(() => window.auditChallenge.solve());

    let finish;
    let requests = 0;
    const ready = new Promise(resolve => { finish = resolve; });
    await page.route('**/_actions/newsletter*', async route => {
      requests++;
      check(route.request().postData().includes('cf-turnstile-response'), 'Signup request must include the challenge field');
      check(route.request().postData().includes('test-token'), 'Signup request must include the verified token');
      await ready;
      await route.fulfill({ status: 204 });
    });
    const requested = page.waitForRequest('**/_actions/newsletter*');
    await button.click();
    await requested;
    await page.locator('[data-newsletter-form]').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    check(await button.isDisabled(), 'Pending requests must disable submission');
    finish();
    await page.locator('[data-newsletter-success]').waitFor({ state: 'visible' });
    check(requests === 1, 'Repeated submit events must not send concurrent signup requests');
    check(await page.locator('[data-newsletter-launcher]').isHidden(), 'Success must hide the launcher');
  }
  const blocked = await page.context().browser().newContext();
  try {
    await blocked.route('**/*', route => route.request().url().startsWith(`${base}/`) ? route.continue() : route.abort());
    const unavailable = await blocked.newPage();
    await unavailable.goto(`${base}/en/`);
    await unavailable.locator('[data-newsletter-error]').waitFor({ state: 'visible' });
    check(await unavailable.locator('[data-newsletter-submit]').isDisabled(), 'A blocked challenge script must not enable signup');
  } finally {
    await blocked.close();
  }
  return 'Contact, legal language, and newsletter challenge/error/retry/success regressions passed.';
}
