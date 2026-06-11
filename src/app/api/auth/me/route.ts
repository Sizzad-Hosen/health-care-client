import { NextResponse } from "next/server";
import { toAuthUser } from "@/lib/auth";
import {
  authenticatedBackendRequest,
  backendRequest,
  BackendApiError,
  refreshAccessToken,
} from "@/lib/server/backend";

export async function GET() {
  try {
    let profile;

    try {
      profile = await authenticatedBackendRequest<Record<string, unknown>>(
        "/api/v1/user/me",
      );
    } catch (error) {
      if (!(error instanceof BackendApiError) || error.status !== 401) {
        throw error;
      }

      const accessToken = await refreshAccessToken();
      profile = await backendRequest<Record<string, unknown>>("/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return NextResponse.json({ user: toAuthUser(profile.data ?? {}) });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unauthorized";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
