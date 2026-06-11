import { NextResponse } from "next/server";
import {
  BackendApiError,
  backendRequest,
  setAuthCookies,
} from "@/lib/server/backend";
import { toAuthUser } from "@/lib/auth";
import { RegisterRequest } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequest;
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        password: body.password,
        patient: {
          name: body.name,
          email: body.email,
          contactNumber: body.contactNumber,
          address: body.address,
        },
      }),
    );

    await backendRequest("/api/v1/user/create-patient", {
      method: "POST",
      body: formData,
    });

    const login = await backendRequest<{
      accessToken: string;
      refreshToken?: string;
    }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const accessToken = login.data?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Account created, but automatic sign in failed." },
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

    return NextResponse.json({ user: toAuthUser(profile.data ?? {}) });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Unable to create account.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
