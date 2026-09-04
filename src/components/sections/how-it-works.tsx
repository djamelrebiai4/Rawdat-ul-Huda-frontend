import { useTranslations, useLocale } from "next-intl";
import { MessageCircle, GraduationCap, CalendarCheck, Rocket } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const icons = [MessageCircle, GraduationCap, CalendarCheck, Rocket];

function formatStepNumber(n: number, locale: string) {
  if (locale === "ar") {
    return n.toLocaleString("ar-EG", { minimumIntegerDigits: 2, useGrouping: false });
  }
  return String(n).padStart(2, "0");
}

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <section className="bg-cream-50 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <ol className="mt-14 grid gap-10 grid-cols-1 min-[320px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <li key={i} className="relative flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-terracotta-500/30 bg-terracotta-500/10 text-sage-700">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="mt-4 font-display text-2xl font-bold text-ochre-500/60">
                  {formatStepNumber(i + 1, locale)}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-brown-600">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-brown-500">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-8 hidden h-px w-[calc(100%-4rem)] -start-[calc(50%+2rem)] bg-gradient-to-r from-transparent via-terracotta-500/40 to-transparent lg:block"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}