import { NextRequest, NextResponse } from "next/server";
import {
  authenticatedBackendRequest,
  BackendApiError,
} from "@/lib/server/backend";

const ALLOWED_PREFIXES = [
  "/api/v1/tasks",
  "/api/v1/user",
  "/api/v1/admin",
  "/api/v1/doctor",
  "/api/v1/patient",
  "/api/v1/schedules",
  "/api/v1/doctorSchedules",
  "/api/v1/appointments",
  "/api/v1/payments",
  "/api/v1/prescriptions",
  "/api/v1/reviews",
  "/api/v1/specalties",
  "/api/v1/meta",
];

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

async function proxy(request: NextRequest, context: RouteContext) {
  const params = await context.params;
  const routePath = `/${params.path?.join("/") ?? ""}`;
  const path = `${routePath}${request.nextUrl.search}`;

  if (!ALLOWED_PREFIXES.some((prefix) => routePath.startsWith(prefix))) {
    return NextResponse.json({ message: "Route is not allowed" }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : isMultipart
        ? await request.formData()
        : await request.text();

  try {
    const headers: HeadersInit = {};

    if (!isMultipart) {
      headers["Content-Type"] = contentType || "application/json";
    }

    const response = await authenticatedBackendRequest(path, {
      method: request.method,
      body,
      headers,
    });

    return NextResponse.json(response);
  } catch (error) {
    const status = error instanceof BackendApiError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Backend request failed.";

    return NextResponse.json(
      { message },
      { status: status > 0 ? status : 500 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
