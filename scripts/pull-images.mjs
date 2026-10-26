// Runs before `astro build`: copies photos uploaded through /admin from R2 over the committed ones in
// src/assets/img, so astro:assets keeps optimizing them. Without R2 credentials, or on any error,
// the committed photos are used and the build continues.
import { readdir, writeFile } from 'node:fs/promises';
import { AwsClient } from 'aws4fetch';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
if (!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET)) {
  console.log('[pull-images] R2 not configured, using committed images.');
  process.exit(0);
}

const dir = new URL('../src/assets/img/', import.meta.url);
const client = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: 's3', region: 'auto' });
const bucket = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;
const get = (path) => client.fetch(`${bucket}${path}`, { signal: AbortSignal.timeout(20000) });

try {
  const known = new Set(await readdir(dir));
  const list = await get('?list-type=2&prefix=img/');
  if (!list.ok) throw new Error(`list ${list.status}`);
  const keys = [...(await list.text()).matchAll(/<Key>img\/([^<]+)<\/Key>/g)].map(([, file]) => file);
  for (const file of keys.filter((name) => known.has(name))) {
    const image = await get(`/img/${file}`);
    if (!image.ok) throw new Error(`${file} ${image.status}`);
    await writeFile(new URL(file, dir), Buffer.from(await image.arrayBuffer()));
    console.log(`[pull-images] ${file} replaced from R2.`);
  }
} catch (error) {
  console.warn(`[pull-images] skipped, using committed images (${error.message}).`);
}
