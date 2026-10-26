import assert from 'node:assert/strict';
import { createHash, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Astro's virtual imports and R2 are stubbed; no credentials or network are used.
function load(file, imports = {}, globals = {}) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports, Response, Request, URL, TextDecoder, Uint8Array, Number, Math,
    require(id) {
      assert.ok(Object.hasOwn(imports, id), `Unexpected import: ${id}`);
      return imports[id];
    },
    ...globals,
  }, { filename: file });
  return module.exports;
}

const PASSWORD = 'a-very-long-admin-password';
const auth = load('../src/lib/admin-auth.ts', { 'node:crypto': { createHash, timingSafeEqual } });
const slots = load('../src/lib/image-slots.ts');

function route({ configured = true } = {}) {
  const stored = [];
  const r2 = {
    r2Configured: () => configured,
    r2Put: async (file, body) => (stored.push({ file, size: body.byteLength }), new Response(null, { status: 200 })),
    r2Delete: async () => new Response(null, { status: 204 }),
    r2Get: async () => new Response('x', { status: 404 }),
    r2List: async () => [{ file: 'hero-office.webp', modified: '2026-10-25T00:00:00Z' }],
  };
  const handlers = load('../src/pages/api/admin/images.ts', {
    'astro:env/server': { ADMIN_PASSWORD: PASSWORD },
    '../../../lib/admin-auth': auth,
    '../../../lib/image-slots': slots,
    '../../../lib/r2': r2,
  });
  return { handlers, stored };
}

const webp = (size = 64) => {
  const bytes = new Uint8Array(size);
  bytes.set([...'RIFF'].map((c) => c.charCodeAt(0)), 0);
  bytes.set([...'WEBP'].map((c) => c.charCodeAt(0)), 8);
  return bytes;
};
const call = (handler, { file = 'hero-office.webp', password = PASSWORD, method = 'PUT', body } = {}) => {
  const url = new URL(`https://site.test/api/admin/images${file ? `?file=${file}` : ''}`);
  const headers = password ? { Authorization: `Bearer ${password}` } : {};
  return handler({ request: new Request(url, { method, headers, body }), url });
};

test('isAdmin requires the exact password and ignores passwords under 16 chars', () => {
  const request = (token) => new Request('https://site.test', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  assert.equal(auth.isAdmin(request(PASSWORD), PASSWORD), true);
  assert.equal(auth.isAdmin(request('wrong'), PASSWORD), false);
  assert.equal(auth.isAdmin(request(), PASSWORD), false);
  assert.equal(auth.isAdmin(request('short'), 'short'), false);
  assert.equal(auth.isAdmin(request(PASSWORD), undefined), false);
});

test('upload stores a valid webp for a known slot', async () => {
  const { handlers, stored } = route();
  const response = await call(handlers.PUT, { body: webp() });
  assert.equal(response.status, 204);
  assert.deepEqual(stored, [{ file: 'hero-office.webp', size: 64 }]);
});

test('upload rejects bad auth, unknown slots, non-webp and oversize files without storing', async () => {
  const { handlers, stored } = route();
  assert.equal((await call(handlers.PUT, { password: 'nope', body: webp() })).status, 401);
  assert.equal((await call(handlers.PUT, { file: '../../etc/passwd', body: webp() })).status, 400);
  assert.equal((await call(handlers.PUT, { body: new Uint8Array(64) })).status, 415);
  assert.equal((await call(handlers.PUT, { body: webp(4_000_001) })).status, 413);
  assert.equal(stored.length, 0);
});

test('reports 503 when R2 is not configured, only after the caller is authenticated', async () => {
  const { handlers } = route({ configured: false });
  assert.equal((await call(handlers.GET, { file: null, method: 'GET' })).status, 503);
  assert.equal((await call(handlers.GET, { file: null, method: 'GET', password: null })).status, 401);
});

test('list returns the current overrides', async () => {
  const { handlers } = route();
  const response = await call(handlers.GET, { file: null, method: 'GET' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { overrides: [{ file: 'hero-office.webp', modified: '2026-10-25T00:00:00Z' }] });
});
