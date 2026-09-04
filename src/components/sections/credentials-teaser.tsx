import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";

export function CredentialsTeaser() {
  const t = useTranslations("credentials");

  return (
    <section className="bg-brown-800 py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-start">
          <div className="flex max-w-2xl flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-6 lg:text-start">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-ochre-500/40 bg-ochre-500/10 text-ochre-400">
              <GraduationCap className="h-8 w-8" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
                {t("title")}
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-sage-100/80">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <ButtonLink href="/about" variant="white" size="lg" className="shrink-0">
            {t("cta")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}