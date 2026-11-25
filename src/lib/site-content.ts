import { site } from "@/lib/site";
import { backendRequest } from "@/lib/backend-api";

export type SiteLocale = "en" | "ar";
export type SiteMessages = import("next-intl").AbstractIntlMessages;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function mergeMessageDefaults(defaults: unknown, content: unknown): unknown {
  if (Array.isArray(content)) {
    const defaultItems = Array.isArray(defaults) ? defaults : [];
    return content.map((item, index) => {
      const itemSlug =
        isRecord(item) && typeof item.slug === "string" ? item.slug : undefined;
      const matchingDefault = itemSlug
        ? defaultItems.find(
            (candidate) =>
              isRecord(candidate) && candidate.slug === itemSlug,
          )
        : defaultItems[index];
      return mergeMessageDefaults(matchingDefault, item);
    });
  }

  if (isRecord(defaults) && isRecord(content)) {
    return Object.fromEntries(
      [...new Set([...Object.keys(defaults), ...Object.keys(content)])].map((key) => [
        key,
        key in content
          ? mergeMessageDefaults(defaults[key], content[key])
          : defaults[key],
      ]),
    );
  }

  return content;
}

export async function loadSiteMessages(locale: SiteLocale): Promise<SiteMessages> {
  const fallback =
    locale === "ar"
      ? (await import("../../messages/ar.json")).default
      : (await import("../../messages/en.json")).default;
  const [contentResult, settingsResult] = await Promise.all([
    backendRequest(`/api/site/content/${locale}`, {
      cache: "force-cache",
      next: { revalidate: 300, tags: [`site-content-${locale}`] },
    }).catch(() => null),
    backendRequest("/api/site/settings", {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["site-settings"] },
    }).catch(() => null),
  ]);
  const contentPayload = contentResult?.ok ? await contentResult.json().catch(() => null) : null;
  const settingsPayload = settingsResult?.ok ? await settingsResult.json().catch(() => null) : null;

  const messages = contentPayload?.messages && typeof contentPayload.messages === "object"
    ? mergeMessageDefaults(fallback, contentPayload.messages) as Record<string, unknown>
    : fallback;
  const settings = settingsPayload?.settings && typeof settingsPayload.settings === "object"
    ? settingsPayload.settings
    : {};

  return { ...messages, site: { ...site, ...settings } } as unknown as SiteMessages;
}