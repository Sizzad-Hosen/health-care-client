import { NextResponse } from "next/server";
import { BackendApiError, backendRequest } from "@/lib/server/backend";
import { ResetPasswordRequest } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordRequest;
    const result = await backendRequest<null>("/api/v1/auth/reset-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${body.token}`,
      },
      body: JSON.stringify({
        password: body.password,
      }),
    });

    return NextResponse.json({
      success: result.success ?? true,
      message: result.message ?? "Password reset successfully.",
    });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Unable to reset password.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
