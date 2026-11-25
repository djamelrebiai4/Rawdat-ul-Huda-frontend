import { editableSiteSettings } from "@/lib/site";
import { requireSiteAdmin } from "@/lib/admin-auth";
import { AdminContentEditor } from "@/components/admin/admin-content-editor";
import { backendRequest, ownerBackendRequest } from "@/lib/backend-api";
import { mergeMessageDefaults } from "@/lib/site-content";
import enMessages from "../../../messages/en.json";
import arMessages from "../../../messages/ar.json";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: Props) {
  const query = await searchParams;
  const localeValue = query.locale === "ar" ? "ar" : "en";
  const { user } = await requireSiteAdmin();
  const [englishContentResponse, arabicContentResponse, settingsResponse] = await Promise.all([
    ownerBackendRequest("/api/admin/content/en").catch(() => null),
    ownerBackendRequest("/api/admin/content/ar").catch(() => null),
    backendRequest("/api/site/settings").catch(() => null),
  ]);
  const [englishContentPayload, arabicContentPayload] = await Promise.all([
    englishContentResponse?.ok ? englishContentResponse.json().catch(() => null) : null,
    arabicContentResponse?.ok ? arabicContentResponse.json().catch(() => null) : null,
  ]);
  const isValidContentPayload = (payload: unknown) =>
    Boolean(
      payload &&
      typeof payload === "object" &&
      "messages" in payload &&
      (payload.messages === null ||
        (typeof payload.messages === "object" && !Array.isArray(payload.messages))),
    );
  const hasValidContent = localeValue === "ar"
    ? Boolean(arabicContentResponse?.ok && isValidContentPayload(arabicContentPayload))
    : Boolean(englishContentResponse?.ok && isValidContentPayload(englishContentPayload));
  const contentAvailableByLocale = {
    en: Boolean(englishContentResponse?.ok && isValidContentPayload(englishContentPayload)),
    ar: Boolean(arabicContentResponse?.ok && isValidContentPayload(arabicContentPayload)),
  };
  const mergeMessages = (baseline: Record<string, unknown>, payload: unknown) => {
    const storedMessages =
      payload &&
      typeof payload === "object" &&
      "messages" in payload &&
      payload.messages &&
      typeof payload.messages === "object"
        ? payload.messages
        : {};
    const editableMessages = mergeMessageDefaults(baseline, storedMessages) as Record<string, unknown>;
    delete editableMessages.site;
    return editableMessages;
  };
  const messagesByLocale = {
    en: mergeMessages(enMessages, englishContentPayload),
    ar: mergeMessages(arMessages, arabicContentPayload),
  };
  const settingsPayload = settingsResponse?.ok
    ? await settingsResponse.json().catch(() => null)
    : null;
  const settingsUnavailable = !settingsResponse?.ok || !settingsPayload;
  const editableMessages = messagesByLocale[localeValue];
  const requestedSection = typeof query.section === "string" ? query.section : "";
  const initialSection =
    requestedSection in editableMessages && requestedSection !== "meta"
      ? requestedSection
      : "pricing";
  const initialMode = query.mode === "settings" ? "settings" : "content";
  const settings = {
    ...editableSiteSettings,
    ...(settingsPayload?.settings && typeof settingsPayload.settings === "object"
      ? settingsPayload.settings
      : {}),
  };

  return (
    <AdminContentEditor
      locale={localeValue}
      messagesByLocale={messagesByLocale}
      contentAvailableByLocale={contentAvailableByLocale}
      settings={settings}
      initialSection={initialSection}
      initialMode={initialMode}
      userEmail={user.email ?? "Owner"}
      saved={typeof query.saved === "string" ? query.saved : undefined}
      error={
        typeof query.error === "string"
          ? query.error
          : settingsUnavailable
            ? "load-failed"
            : !hasValidContent
              ? "content-load-failed"
              : undefined
      }
    />
  );
}