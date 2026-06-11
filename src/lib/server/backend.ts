import "server-only";

import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "hc_access_token";
export const REFRESH_TOKEN_COOKIE = "hc_refresh_token";

const API_VERSION_PREFIX = "/api/v1";

export class BackendApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "BackendApiError";
    this.status = status;
    this.payload = payload;
  }
}

export type BackendEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

export function getBackendBaseUrl() {
  const configuredUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!configuredUrl) {
    throw new BackendApiError(
      "API_BASE_URL is not configured. Add it to .env.local.",
      0,
    );
  }

  return configuredUrl.replace(/\/$/, "");
}

export function buildBackendUrl(path: string) {
  const baseUrl = getBackendBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (
    baseUrl.endsWith(API_VERSION_PREFIX) &&
    normalizedPath.startsWith(API_VERSION_PREFIX)
  ) {
    return `${baseUrl}${normalizedPath.slice(API_VERSION_PREFIX.length)}`;
  }

  return `${baseUrl}${normalizedPath}`;
}

export async function backendRequest<T>(
  path: string,
  options: RequestInit = {},
) {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildBackendUrl(path), {
    ...options,
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      payload && typeof payload.message === "string"
        ? payload.message
        : `Backend request failed with status ${response.status}`;

    throw new BackendApiError(message, response.status, payload);
  }

  return payload as BackendEnvelope<T>;
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function setAuthCookies(tokens: {
  accessToken: string;
  refreshToken?: string;
}) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60,
  });

  if (tokens.refreshToken) {
    cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function authenticatedBackendRequest<T>(
  path: string,
  options: RequestInit = {},
) {
  const token = await getAccessToken();

  if (!token) {
    throw new BackendApiError("Unauthorized", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return backendRequest<T>(path, {
    ...options,
    headers,
  });
}

export async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new BackendApiError("Refresh token is missing", 401);
  }

  const refresh = await backendRequest<{
    accessToken: string;
    refreshToken?: string;
  }>("/api/v1/auth/refreshtoken", {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  const accessToken = refresh.data?.accessToken;

  if (!accessToken) {
    throw new BackendApiError("Refresh did not return an access token", 502);
  }

  await setAuthCookies({
    accessToken,
    refreshToken: refresh.data?.refreshToken,
  });

  return accessToken;
}
