import { NextResponse } from "next/server";
import { toAuthUser } from "@/lib/auth";
import {
  BackendApiError,
  backendRequest,
  refreshAccessToken,
} from "@/lib/server/backend";

export async function POST() {
  try {
    const accessToken = await refreshAccessToken();
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
      error instanceof Error ? error.message : "Unable to refresh session.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
