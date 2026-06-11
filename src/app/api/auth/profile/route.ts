import { NextResponse } from "next/server";
import { toUserProfile } from "@/lib/auth";
import {
  authenticatedBackendRequest,
  BackendApiError,
} from "@/lib/server/backend";

export async function GET() {
  try {
    const profile = await authenticatedBackendRequest<Record<string, unknown>>(
      "/api/v1/user/me",
    );

    return NextResponse.json({ user: toUserProfile(profile.data ?? {}) });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unable to load profile.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const incoming = await request.formData();
    const data = incoming.get("data");
    const file = incoming.get("file");
    const formData = new FormData();

    if (typeof data !== "string") {
      return NextResponse.json(
        { message: "Profile data is required." },
        { status: 400 },
      );
    }

    formData.append("data", data);

    if (file instanceof File) {
      formData.append("file", file);
    }

    const updatedProfile = await authenticatedBackendRequest<Record<string, unknown>>(
      "/api/v1/user/update-my-profile",
      {
        method: "PATCH",
        body: formData,
      },
    );
    const profile = await authenticatedBackendRequest<Record<string, unknown>>(
      "/api/v1/user/me",
    );

    return NextResponse.json({
      message: updatedProfile.message ?? "Profile updated successfully.",
      user: toUserProfile(profile.data ?? {}),
    });
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Unable to update profile.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}
