import { redirect } from "next/navigation";
import { ownerBackendRequest } from "@/lib/backend-api";

export async function requireSiteAdmin() {
  const response = await ownerBackendRequest("/api/admin/me").catch(() => null);
  if (!response?.ok) redirect("/admin/login");

  const { user } = await response.json();
  return { user };
}