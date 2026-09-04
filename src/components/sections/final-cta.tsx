import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { RubElHizb } from "@/components/rub-el-hizb";
import { IslamicPattern } from "@/components/islamic-pattern";

export function FinalCta() {
  const t = useTranslations("finalCta");

  return (
    <section className="relative overflow-hidden bg-brown-900 py-20 sm:py-28">
      <IslamicPattern className="pointer-events-none absolute inset-0 h-full w-full text-ochre-100/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown-900/70 via-transparent to-brown-900/70" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <RubElHizb className="h-10 w-10 text-ochre-400" />
        <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-xl text-lg text-sage-100/80">{t("subtitle")}</p>
        <div className="mt-9">
          <ButtonLink href="/contact" variant="accent" size="lg" className="px-10">
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}