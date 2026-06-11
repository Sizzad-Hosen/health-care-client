import { NextResponse } from "next/server";
import {
  authenticatedBackendRequest,
  BackendApiError,
} from "@/lib/server/backend";
import { ChangePasswordRequest } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChangePasswordRequest;
    const result = await authenticatedBackendRequest<{ message?: string }>(
      "/api/v1/auth/change-password",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

    return NextResponse.json({
      success: result.success ?? true,
      message: result.message ?? "Password changed successfully.",
    });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Unable to change password.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
