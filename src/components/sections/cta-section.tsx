import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { RubElHizb } from "@/components/rub-el-hizb";
import { IslamicPattern } from "@/components/islamic-pattern";

export function CtaSection() {
  const t = useTranslations("finalCta");

  return (
    <section className="relative overflow-hidden bg-brown-900 py-16 sm:py-24">
      <IslamicPattern className="pointer-events-none absolute inset-0 h-full w-full text-ochre-100/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown-900/70 via-transparent to-brown-900/70" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-8 text-center sm:px-6">
        <RubElHizb className="h-9 w-9 text-ochre-400" />
        <h2 className="mt-5 text-balance font-display text-2xl font-semibold leading-tight text-cream-50 sm:text-3xl lg:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-xl text-base text-sage-100/80 sm:text-lg">
          {t("subtitle")}
        </p>
        <div className="mt-8">
          <ButtonLink href="/contact" variant="accent" size="lg" className="px-10">
            {t("cta")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}