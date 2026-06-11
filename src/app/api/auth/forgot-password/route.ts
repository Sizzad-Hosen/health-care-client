import { NextResponse } from "next/server";
import { BackendApiError, backendRequest } from "@/lib/server/backend";
import { ForgotPasswordRequest } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ForgotPasswordRequest;
    const result = await backendRequest<null>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json({
      success: result.success ?? true,
      message: result.message ?? "Please check your email for a reset link.",
    });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Unable to send reset link.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
