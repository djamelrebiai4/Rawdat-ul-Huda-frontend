"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { LanguageSwitcher } from "../language-switcher";
import { ButtonLink } from "@/components/ui/button-link";

const PROGRAMS = ["hifdh", "arabic", "tajweed"] as const;
const NAV_KEYS = [...PROGRAMS, "pricing", "about", "faq", "blog"] as const;

const HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  hifdh: "/hifdh",
  arabic: "/arabic-course",
  tajweed: "/tajweed-course",
  pricing: "/pricing",
  about: "/about",
  faq: "/faq",
  blog: "/blog",
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onClick(e: MouseEvent) {
      const menu = menuRef.current;
      if (menu && !menu.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      id="mobile-menu"
      className={cn("mobile-menu absolute left-0 right-0 p-6 rounded-3xl flex flex-col gap-4 md:hidden", "top-[calc(var(--navbar-height)+1.5rem)]")}
      role="dialog"
      aria-label="Mobile menu"
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/50 border border-white/10 text-zinc-400 hover:bg-zinc-800 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <LanguageSwitcher className="w-fit mb-2" />

      <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
        {NAV_KEYS.map((key) => {
          const href = HREFS[key];
          const active = pathname === href;
          return (
            <Link
              key={key}
              href={href}
              prefetch
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "nav-link py-2",
                active && "text-green-500"
              )}
            >
              {t(key)}
            </Link>
          );
        })}
        <Link
          href="/contact"
          prefetch
          onClick={onClose}
          className="nav-link py-2"
        >
          {t("contact")}
        </Link>
      </nav>

      <ButtonLink href="/contact" variant="nav-cta" fullWidth onClick={onClose}>
        {t("bookTrialShort")}
      </ButtonLink>
    </div>
  );
}