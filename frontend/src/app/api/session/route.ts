import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json({
            success: true,
            authenticated: false,
            token: null,
        });
    }

    return NextResponse.json({
        success: true,
        authenticated: true,
        token,
    });
}
