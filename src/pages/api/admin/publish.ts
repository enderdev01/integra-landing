import type { APIRoute } from 'astro';
import { ADMIN_PASSWORD, VERCEL_DEPLOY_HOOK_URL } from 'astro:env/server';
import { isAdmin } from '../../../lib/admin-auth';

export const prerender = false;

/** Rebuilds the site so scripts/pull-images.mjs picks up the new photos. */
export const POST: APIRoute = async ({ request }) => {
  const reply = (status: number) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
  if (!isAdmin(request, ADMIN_PASSWORD)) return reply(401);
  if (!VERCEL_DEPLOY_HOOK_URL) return reply(503);
  try {
    const hook = await fetch(VERCEL_DEPLOY_HOOK_URL, { method: 'POST', signal: AbortSignal.timeout(10000) });
    return reply(hook.ok ? 202 : 502);
  } catch {
    return reply(502);
  }
};
