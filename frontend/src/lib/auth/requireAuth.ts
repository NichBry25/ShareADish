import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_COOKIE_NAME } from './constants';

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  console.log('token')
  console.log(token)
  if (!token) {
    redirect('/login');
  }

  return token;
}
