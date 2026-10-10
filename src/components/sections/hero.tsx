import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { RubElHizb } from "@/components/rub-el-hizb";
import { IslamicPattern } from "@/components/islamic-pattern";
import { Floating3D } from "@/components/sections/floating-3d";
import { ShimmerText } from "@/components/ui/shimmer-text";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-brown-900">
      <IslamicPattern className="pointer-events-none absolute inset-0 h-full w-full text-sage-900/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brown-900/60 via-transparent to-brown-900" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-16 sm:px-6 sm:pb-20 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-24" style={{ paddingTop: 'var(--navbar-height)' } as React.CSSProperties}>
        <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-terracotta-500/40 bg-terracotta-500/10 px-4 py-1.5 text-sm font-semibold text-terracotta-300 relative">
            <RubElHizb className="h-4 w-4" />
            {t("badge")}
          </span>

          <h1 className="mt-6 max-w-xl text-balance font-display text-4xl font-bold leading-tight text-cream-50 sm:text-5xl relative hero-lightning-sweep">
            <ShimmerText className="font-display">{t("title")}</ShimmerText>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-sage-100/85 relative hero-lightning-sweep" style={{ animationDelay: '1.2s' }}>
            {t("subtitle")}
          </p>

          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row lg:items-start">
            <ButtonLink href="/contact" variant="accent" size="lg" className="w-full sm:w-auto">
              {t("ctaPrimary")}
            </ButtonLink>
            <ButtonLink
              href="/tajweed-course"
              variant="white"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t("ctaSecondary")}
            </ButtonLink>
          </div>

          <p className="mt-7 text-sm text-sage-100/60">{t("trustedBy")}</p>
        </div>

        <Floating3D />
      </div>
    </section>
  );
}