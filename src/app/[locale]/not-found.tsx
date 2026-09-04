"use client";

import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { RubElHizb } from "@/components/rub-el-hizb";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 text-center sm:px-6">
        <RubElHizb className="h-14 w-14 text-terracotta-500" />
        <h1 className="mt-6 font-display text-4xl font-bold text-brown-600 sm:text-5xl">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("text")}</p>
        <div className="mt-8">
          <ButtonLink href="/" variant="primary">
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}