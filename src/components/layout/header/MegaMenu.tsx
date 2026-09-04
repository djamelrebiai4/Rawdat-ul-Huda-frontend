"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { BookText, BookOpen, Sparkles } from "lucide-react";
import { createPortal } from "react-dom";

const PROGRAMS = [
  {
    key: "hifdh",
    href: "/hifdh",
    icon: BookText,
  },
  {
    key: "arabic",
    href: "/arabic-course",
    icon: BookOpen,
  },
  {
    key: "tajweed",
    href: "/tajweed-course",
    icon: Sparkles,
  },
] as const;

type MegaMenuProps = {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export function MegaMenu({ isOpen, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const t = useTranslations("nav");

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      id="mega-menu-portal"
      className={cn("mega-menu-portal", isOpen && "is-open")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="menu"
      aria-label="Programs"
    >
      <div className="mega-grid">
        {PROGRAMS.map((program) => {
          const Icon = program.icon;
          const tProgram = t.raw(program.key) as {
            title: string;
            description: string;
          };
          return (
            <Link
              key={program.key}
              href={program.href}
              prefetch
              className="cursor-pointer group mega-menu-item"
              role="menuitem"
            >
              <div className="mega-menu-icon">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h4 className="nav-font text-[11px] font-bold uppercase tracking-wider mega-menu-title mb-1">
                  {tProgram.title}
                </h4>
                <p className="text-[11px] leading-snug mega-menu-desc m-0">
                  {tProgram.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>,
    document.body
  );
}