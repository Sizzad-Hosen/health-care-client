import { NextResponse } from "next/server";
import { createFakeToken } from "@/lib/auth";
import { RegisterRequest } from "@/types/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterRequest;
  const user = {
    id: `user-${crypto.randomUUID()}`,
    name: body.name,
    email: body.email,
    role: body.role,
  };

  return NextResponse.json({
    user,
    accessToken: createFakeToken(user),
  });
}
