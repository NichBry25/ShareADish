import { NextResponse } from "next/server";

import { applyAuthCookie } from "@/lib/auth/cookies";
import { createMockToken } from "@/lib/auth/token";

type SignupPayload = {
    username?: string;
    password?: string;
};

export async function POST(req: Request){
    const { username, password }: SignupPayload = await req.json();

    if (!username || !password){
        return NextResponse.json(
            { success: false, error: 'Please provide both a username and password.' },
            { status: 400 }
        );
    }

    const fakeToken = createMockToken(username);

    const response = NextResponse.json({
        success: true,
        token: fakeToken,
        user: {
            username,
        },
    });

    return applyAuthCookie(response, fakeToken);
}
