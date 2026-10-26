import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (value: string) => createHash('sha256').update(value).digest();

/** Bearer token must equal ADMIN_PASSWORD; a short or missing password disables the admin. */
export const isAdmin = (request: Request, password: string | undefined) => {
  if (!password || password.length < 16) return false;
  const given = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  return timingSafeEqual(digest(given), digest(password));
};
