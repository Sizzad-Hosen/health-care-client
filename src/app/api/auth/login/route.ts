import { NextResponse } from "next/server";
import {
  BackendApiError,
  backendRequest,
  setAuthCookies,
} from "@/lib/server/backend";
import { toAuthUser } from "@/lib/auth";
import { LoginRequest } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;
    const login = await backendRequest<{
      accessToken: string;
      refreshToken?: string;
    }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const accessToken = login.data?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Login did not return an access token." },
        { status: 502 },
      );
    }

    await setAuthCookies({
      accessToken,
      refreshToken: login.data?.refreshToken,
    });

    const profile = await backendRequest<Record<string, unknown>>(
      "/api/v1/user/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const user = toAuthUser(profile.data ?? {});

    return NextResponse.json({ user });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Unable to sign in right now.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
