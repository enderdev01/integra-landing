import { AwsClient } from 'aws4fetch';
import { R2_ACCESS_KEY_ID, R2_ACCOUNT_ID, R2_BUCKET, R2_SECRET_ACCESS_KEY } from 'astro:env/server';

export const r2Configured = () => Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET);

// Only called after r2Configured(); the bucket stays private, every read goes through signed requests.
const request = (path: string, init?: RequestInit) =>
  new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID!, secretAccessKey: R2_SECRET_ACCESS_KEY!, service: 's3', region: 'auto' }).fetch(
    `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}${path}`,
    { signal: AbortSignal.timeout(15000), ...init },
  );

export const r2Get = (file: string) => request(`/img/${file}`);
export const r2Put = (file: string, body: ArrayBuffer) =>
  request(`/img/${file}`, { method: 'PUT', body, headers: { 'Content-Type': 'image/webp' } });
export const r2Delete = (file: string) => request(`/img/${file}`, { method: 'DELETE' });

/** Files currently overridden in the bucket, with their last upload time. */
export const r2List = async (): Promise<{ file: string; modified: string }[]> => {
  const response = await request('?list-type=2&prefix=img/');
  if (!response.ok) throw new Error(`R2 list failed: ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<Key>img\/([^<]+)<\/Key>[\s\S]*?<LastModified>([^<]+)<\/LastModified>/g)].map(([, file, modified]) => ({ file, modified }));
};
