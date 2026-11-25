import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { loadSiteMessages, type SiteLocale } from "@/lib/site-content";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadSiteMessages(locale as SiteLocale),
  };
});