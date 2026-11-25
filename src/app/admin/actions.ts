"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import enMessages from "../../../messages/en.json";
import arMessages from "../../../messages/ar.json";
import { editableSiteSettings } from "@/lib/site";
import { requireSiteAdmin } from "@/lib/admin-auth";
import { backendRequest, ownerBackendRequest } from "@/lib/backend-api";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/session-cookie";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (value && typeof value === "object") {
    return Object.values(value).every(isJsonValue);
  }
  return false;
}

function matchesShape(value: unknown, template: unknown): value is JsonValue {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return false;
    if (template.length === 0) return value.every(isJsonValue);
    return value.every((item) => template.some((example) => matchesShape(item, example)));
  }

  if (template && typeof template === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const valueRecord = value as Record<string, unknown>;
    const templateRecord = template as Record<string, unknown>;
    const valueKeys = Object.keys(valueRecord).sort();
    const templateKeys = Object.keys(templateRecord).sort();

    return (
      valueKeys.length === templateKeys.length &&
      valueKeys.every((key, index) => key === templateKeys[index] && matchesShape(valueRecord[key], templateRecord[key]))
    );
  }

  return typeof value === typeof template;
}

function parseJson(formData: FormData, name: string, returnTo: string) {
  try {
    return JSON.parse(String(formData.get(name) ?? "")) as unknown;
  } catch {
    redirect(`${returnTo}&error=invalid-json`);
  }
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const response = await backendRequest("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  if (!response) redirect("/admin/login?setup=required");
  if (response.status === 403) redirect("/admin/login?unauthorized=1");
  if (!response.ok) redirect("/admin/login?error=credentials");

  const { token } = await response.json();
  (await cookies()).set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

  redirect("/admin");
}

export async function signOutAction() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

export async function saveLocaleSectionAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");
  const section = String(formData.get("section") ?? "");

  if (locale !== "en" && locale !== "ar") {
    redirect("/admin?error=invalid-locale");
  }

  const baseline = locale === "ar" ? arMessages : enMessages;
  const returnTo = `/admin?locale=${locale}&section=${encodeURIComponent(section)}`;
  const sectionValue = parseJson(formData, "content", returnTo);

  if (!Object.hasOwn(baseline, section) || !matchesShape(sectionValue, baseline[section as keyof typeof baseline])) {
    redirect(`${returnTo}&error=invalid-content`);
  }

  await requireSiteAdmin();
  const response = await ownerBackendRequest(`/api/admin/content/${locale}`, {
    method: "PUT",
    body: JSON.stringify({ section, content: sectionValue }),
  }).catch(() => null);

  if (!response?.ok) {
    redirect(`${returnTo}&error=save-failed`);
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
  revalidateTag(`site-content-${locale}`);
  redirect(`${returnTo}&saved=content`);
}

export async function saveSiteSettingsAction(formData: FormData) {
  const returnTo = "/admin?mode=settings";
  const settings = parseJson(formData, "settings", returnTo);

  if (!matchesShape(settings, editableSiteSettings)) {
    redirect(`${returnTo}&error=invalid-settings`);
  }

  await requireSiteAdmin();
  const response = await ownerBackendRequest("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  }).catch(() => null);

  if (!response?.ok) {
    redirect(`${returnTo}&error=save-failed`);
  }

  revalidatePath("/[locale]", "layout");
  revalidateTag("site-settings");
  redirect(`${returnTo}&saved=settings`);
}

export async function autoSaveLocaleSectionAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "");
  const section = String(formData.get("section") ?? "");
  const contentJson = String(formData.get("content") ?? "");

  if (locale !== "en" && locale !== "ar") {
    return { ok: false as const, error: "invalid-locale" };
  }

  const baseline = locale === "ar" ? arMessages : enMessages;
  let sectionValue: unknown;
  try {
    sectionValue = JSON.parse(contentJson) as unknown;
  } catch {
    return { ok: false as const, error: "invalid-json" };
  }

  if (!Object.hasOwn(baseline, section) || !matchesShape(sectionValue, baseline[section as keyof typeof baseline])) {
    return { ok: false as const, error: "invalid-content" };
  }

  await requireSiteAdmin();
  const response = await ownerBackendRequest(`/api/admin/content/${locale}`, {
    method: "PUT",
    body: JSON.stringify({ section, content: sectionValue }),
  }).catch(() => null);

  if (!response?.ok) {
    return { ok: false as const, error: "save-failed" };
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
  revalidateTag(`site-content-${locale}`);
  return { ok: true as const, saved: true };
}

export async function autoSaveSiteSettingsAction(formData: FormData) {
  const settingsJson = String(formData.get("settings") ?? "");

  let settings: unknown;
  try {
    settings = JSON.parse(settingsJson) as unknown;
  } catch {
    return { ok: false as const, error: "invalid-json" };
  }

  if (!matchesShape(settings, editableSiteSettings)) {
    return { ok: false as const, error: "invalid-settings" };
  }

  await requireSiteAdmin();
  const response = await ownerBackendRequest("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  }).catch(() => null);

  if (!response?.ok) {
    return { ok: false as const, error: "save-failed" };
  }

  revalidatePath("/[locale]", "layout");
  revalidateTag("site-settings");
  return { ok: true as const, saved: true };
}