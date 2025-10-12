import { NextResponse } from "next/server";
import { applyAuthCookie } from "@/lib/auth/cookies";

type LoginPayload = {
  token: string;
};

export async function POST(req: Request) {
  const { token }: LoginPayload = await req.json();
  console.log('token')
  console.log(token)
  const response = NextResponse.json({ success: true });

  // applyAuthCookie should set the cookie correctly
  return applyAuthCookie(response, token);
} 