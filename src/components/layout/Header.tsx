"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button-link";
import { Logo } from "./header/Logo";
import { NavLink } from "./header/NavLink";
import { MobileMenu } from "./header/MobileMenu";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    function onClick(e: MouseEvent) {
      const menu = mobileMenuRef.current;
      const btn = hamburgerRef.current;
      if (menu && !menu.contains(e.target as Node) && btn && !btn.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [mobileOpen]);

  return (
    <>
      {/* Backdrop blur layer */}
      <div className="nav-backdrop-blur" aria-hidden="true" />
      
      {/* Backdrop gradient fade */}
      <div className="nav-backdrop-gradient" aria-hidden="true" />

      <nav
        className="fixed top-0 z-[60] mx-auto w-full max-w-[90rem] px-4 md:px-6"
        aria-label="Main navigation"
      >
        <div className="mt-6 nav-border-beam nav-dark-glass rounded-full">
          <div className="relative px-6 md:px-8 py-3 md:py-4 flex items-center justify-between overflow-visible max-w-full">
            {/* Left links */}
            <div className="flex-1 flex items-center justify-start">
              <div className="hidden xl:flex items-center gap-10 h-full" role="navigation" aria-label="Main">
                <NavLink href="/" isActive={false}>
                  {t("home")}
                </NavLink>

                <NavLink href="/hifdh">{t("hifdh")}</NavLink>
                <NavLink href="/arabic-course">{t("arabic")}</NavLink>
                <NavLink href="/tajweed-course">{t("tajweed")}</NavLink>
                <NavLink href="/about">{t("about")}</NavLink>
              </div>
            </div>

            {/* Center Logo */}
            <Logo />

            {/* Right links - symmetric to left */}
            <div className="flex-1 flex items-center justify-end gap-4">
              <div className="hidden xl:flex items-center gap-10 h-full" role="navigation" aria-label="Secondary">
                <NavLink href="/pricing">{t("pricing")}</NavLink>
                <NavLink href="/faq">{t("faq")}</NavLink>
                <NavLink href="/blog">{t("blog")}</NavLink>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher className="hidden xl:inline-flex" />

              {/* Book Trial CTA - responsive text: "Book Now" on md, "Book Free Trial" on lg+ */}
              <ButtonLink href="/contact" variant="nav-cta" size="md" className="hidden sm:inline-flex">
                <span className="hidden lg:inline">{t("bookTrial")}</span>
                <span className="inline lg:hidden">{t("bookTrialShort")}</span>
              </ButtonLink>

              {/* Mobile hamburger */}
              <button
                ref={hamburgerRef}
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="xl:hidden flex items-center justify-center p-2 text-zinc-500 hover:text-white transition-colors"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </nav>
    </>
  );
}