import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { buildPageMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string; country: string }>;
};

const countries = ["usa", "uk", "canada", "pakistan"] as const;

const flags: Record<string, string> = {
  usa: "🇺🇸",
  uk: "🇬🇧",
  canada: "🇨🇦",
  pakistan: "🇵🇰",
};

export function generateStaticParams() {
  return ["en", "ar"].flatMap((locale) =>
    countries.map((country) => ({ locale, country }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params;
  const t = await getTranslations("locations");

  if (!countries.includes(country as (typeof countries)[number])) {
    notFound();
  }

  const page = t.raw(`countryPages.${country}`) as {
    title: string;
    text: string;
    timezoneNote: string;
  };

  return buildPageMetadata({
    pageKey: `locationPages.${country}`,
    fallbackTitle: `${page.title} | Rawdat ul-Huda`,
    fallbackDescription: page.text,
    path: `/locations/${country}`,
    locale,
  });
}

export default async function CountryPage({ params }: Props) {
  const { locale, country } = await params;
  setRequestLocale(locale);

  if (!countries.includes(country as (typeof countries)[number])) {
    notFound();
  }

  const t = await getTranslations("locations");
  const page = t.raw(`countryPages.${country}`) as {
    title: string;
    text: string;
    timezoneNote: string;
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: page.title, path: `/locations/${country}` },
          ], locale),
        ]}
      />
      <PageHero
        eyebrow={`${flags[country] ?? ""} ${country.toUpperCase()}`}
        title={page.title}
        subtitle={t("subtitle")}
      />

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-lg leading-relaxed text-brown-500">{page.text}</p>

          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-terracotta-500/40 bg-terracotta-500/10 p-6">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta-500 text-cream-50">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-base font-medium leading-relaxed text-brown-600">
              {page.timezoneNote}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-brown-600 sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Badge variant="sage">{t("items.0.country")}</Badge>
            <Badge variant="sage">{t("items.1.country")}</Badge>
            <Badge variant="sage">{t("items.2.country")}</Badge>
            <Badge variant="sage">{t("items.3.country")}</Badge>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}