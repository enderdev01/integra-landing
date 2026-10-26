import type { APIRoute } from 'astro';
import { ADMIN_PASSWORD } from 'astro:env/server';
import { isAdmin } from '../../../lib/admin-auth';
import { isImageSlot } from '../../../lib/image-slots';
import { r2Configured, r2Delete, r2Get, r2List, r2Put } from '../../../lib/r2';

export const prerender = false;

// Vercel rejects request bodies over 4.5 MB; the admin page resizes in the browser well below this.
const MAX_BYTES = 4_000_000;

const reply = (status: number, body?: unknown) =>
  body === undefined ? new Response(null, { status, headers: { 'Cache-Control': 'no-store' } }) : Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

const guard = (request: Request) => {
  if (!isAdmin(request, ADMIN_PASSWORD)) return reply(401, { error: 'unauthorized' });
  if (!r2Configured()) return reply(503, { error: 'storage_not_configured' });
  return null;
};

const fileOf = ({ url }: { url: URL }) => {
  const file = url.searchParams.get('file');
  return isImageSlot(file) ? file : null;
};

export const GET: APIRoute = async ({ request, url }) => {
  const denied = guard(request);
  if (denied) return denied;
  try {
    if (!url.searchParams.has('file')) return reply(200, { overrides: await r2List() });
    const file = fileOf({ url });
    if (!file) return reply(400, { error: 'unknown_slot' });
    const stored = await r2Get(file);
    if (!stored.ok) return reply(404, { error: 'not_found' });
    return new Response(stored.body, { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'no-store' } });
  } catch {
    return reply(502, { error: 'storage_unreachable' });
  }
};

export const PUT: APIRoute = async ({ request, url }) => {
  const denied = guard(request);
  if (denied) return denied;
  const file = fileOf({ url });
  if (!file) return reply(400, { error: 'unknown_slot' });
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return reply(413, { error: 'too_large' });

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_BYTES) return reply(413, { error: 'too_large' });
  const head = new TextDecoder('latin1').decode(new Uint8Array(bytes, 0, Math.min(12, bytes.byteLength)));
  if (!(head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP')) return reply(415, { error: 'not_webp' });

  try {
    return reply((await r2Put(file, bytes)).ok ? 204 : 502);
  } catch {
    return reply(502, { error: 'storage_unreachable' });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  const denied = guard(request);
  if (denied) return denied;
  const file = fileOf({ url });
  if (!file) return reply(400, { error: 'unknown_slot' });
  try {
    return reply((await r2Delete(file)).ok ? 204 : 502);
  } catch {
    return reply(502, { error: 'storage_unreachable' });
  }
};
