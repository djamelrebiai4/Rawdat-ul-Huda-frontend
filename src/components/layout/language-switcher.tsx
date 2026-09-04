"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={locale === "en" ? "التبديل إلى العربية" : "Switch to English"}
      className={`inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-white/10 bg-zinc-900/50 px-3 text-sm font-semibold text-zinc-400 transition-colors hover:border-green-500 hover:text-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${className ?? ""}`}
    >
      <span className="text-xs font-semibold tracking-wider">
        {locale === "en" ? "AR" : "EN"}
      </span>
    </button>
  );
}