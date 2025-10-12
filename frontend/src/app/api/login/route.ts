import { NextResponse } from "next/server";

import { applyAuthCookie } from "@/lib/auth/cookies";
import { createMockToken } from "@/lib/auth/token";

type LoginPayload = {
    token: string
};

export async function POST(req: Request){
    const { token }: LoginPayload = await req.json();

    const response = NextResponse.json({
        success: true,
        token: token,
    });

    return applyAuthCookie(response, token);
}
