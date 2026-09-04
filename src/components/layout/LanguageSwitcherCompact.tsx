"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcherCompact() {
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
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      className="hidden md:fixed md:top-[calc(var(--navbar-height)+1rem)] md:right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/50 border border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
    >
      <span className="text-xs font-semibold tracking-wider">
        {locale === "en" ? "AR" : "EN"}
      </span>
    </button>
  );
}