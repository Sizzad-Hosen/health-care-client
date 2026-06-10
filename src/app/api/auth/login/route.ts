import { NextResponse } from "next/server";
import { createFakeToken, mockUsers } from "@/lib/auth";
import { LoginRequest } from "@/types/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginRequest;
  const user = mockUsers.find(
    (item) => item.email === body.email && item.password === body.password,
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 },
    );
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return NextResponse.json({
    user: safeUser,
    accessToken: createFakeToken(safeUser),
  });
}
