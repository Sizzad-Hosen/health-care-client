import { NextResponse } from "next/server";
import { toAuthUser } from "@/lib/auth";
import {
  authenticatedBackendRequest,
  BackendApiError,
} from "@/lib/server/backend";

export async function GET() {
  try {
    const profile = await authenticatedBackendRequest<Record<string, unknown>>(
      "/api/v1/user/me",
    );

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
