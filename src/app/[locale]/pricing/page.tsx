import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Check, ShieldCheck, PauseCircle, RefreshCcw, CalendarX } from "lucide-react";
import { buildPageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    pageKey: "pricing",
    fallbackTitle: "Online Quran Class Pricing | Rawdat ul-Huda",
    fallbackDescription:
      "Compare transparent monthly plans for one-to-one Quran and Arabic lessons. No hidden fees, with flexible cancellation and pause options.",
    path: "/pricing",
    locale,
  });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  const tiers = t.raw("tiers") as {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
  }[];

  const policies = [
    { icon: CalendarX, text: t("policies.cancellation") },
    { icon: PauseCircle, text: t("policies.pause") },
    { icon: RefreshCcw, text: t("policies.makeup") },
    { icon: ShieldCheck, text: t("policies.moneyBack") },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ], locale),
        ]}
      />
      <PageHero eyebrow="Pricing" title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <p className="mx-auto mb-12 max-w-xl text-center text-sm text-muted-foreground">
            {t("currencyNote")}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className={
                  tier.popular
                    ? "relative flex flex-col rounded-2xl border-2 border-terracotta-500 bg-card p-7 shadow-lg"
                    : "relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
                }
              >
                {tier.popular && (
                  <Badge
                    variant="terracotta"
                    className="absolute -top-3 start-1/2 -translate-x-1/2 whitespace-nowrap rtl:translate-x-1/2"
                  >
                    {t("popular")}
                  </Badge>
                )}
                <h3 className="font-display text-lg font-semibold text-brown-600">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-sage-700">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" aria-hidden="true" />
                      <span className="text-sm text-brown-500">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <ButtonLink
                    href="/contact"
                    variant={tier.popular ? "accent" : "outline"}
                    fullWidth
                  >
                    {tier.cta}
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Policies" title={t("policies.title")} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {policies.map((policy, i) => {
                const Icon = policy.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-50 text-sage-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm leading-relaxed text-brown-500">{policy.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}