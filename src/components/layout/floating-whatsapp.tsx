import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { whatsappLink } from "@/lib/site";

export function FloatingWhatsApp() {
  const t = useTranslations("whatsapp");
  const siteT = useTranslations("site");

  return (
    <a
      href={whatsappLink(t("message"), siteT("whatsappNumber"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("floating")}
      className="group fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-lg shadow-terracotta-900/25 transition-all duration-200 hover:scale-105 hover:bg-terracotta-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute end-full me-3 whitespace-nowrap rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        {t("floating")}
      </span>
    </a>
  );
}