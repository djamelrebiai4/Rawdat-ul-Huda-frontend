import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/session-cookie";

const backendUrl = (process.env.BACKEND_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export async function backendRequest(path: string, init: RequestInit = {}) {
  return fetch(`${backendUrl}${path}`, {
    ...init,
    cache: init.cache ?? "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

export async function ownerBackendRequest(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return backendRequest(path, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}