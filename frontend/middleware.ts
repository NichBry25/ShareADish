/**
 * THE IMPLEMENTATION BELOW IS ONLY FOR THE FRONTEND. TO CONNECT TO BACKEND, REFER TO ACTUAL IMPLEMENTATION CODE.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME } from "./src/lib/auth/constants";

export function middleware(req: NextRequest){
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    const protectedPaths = ['/your-account', '/create-recipe', '/create-recipe/manual', '/create-recipe/generate-ai'];

    if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))){
        if (!token){
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    return NextResponse.next();
}
