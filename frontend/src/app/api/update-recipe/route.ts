import { NextResponse } from "next/server";
import api from "@/lib/axios";
import { cookies } from "next/headers";


export async function PUT(req: Request) {
  const payload = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  console.log('payload')
  console.log(payload)

  const res = await api.put(`/recipe/${payload.id}`, payload, {
    headers: {
      Cookie: `access_token=${token}`
    }
  });

  return NextResponse.json(await res.data);
}