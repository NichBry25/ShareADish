import { randomUUID } from 'crypto';

export function createMockToken(username: string): string {
  const payload = {
    sub: username,
    jti: randomUUID(),
    iat: Date.now(),
  };

  const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
