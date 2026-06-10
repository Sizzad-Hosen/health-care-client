import { NextRequest, NextResponse } from "next/server";
import { userFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = userFromToken(token);

  if (!user) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
