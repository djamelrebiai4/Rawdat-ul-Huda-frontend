import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "lucide-react";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

const countries = [
  { slug: "usa", flag: "🇺🇸" },
  { slug: "uk", flag: "🇬🇧" },
  { slug: "canada", flag: "🇨🇦" },
  { slug: "pakistan", flag: "🇵🇰" },
];

export function generateMetadata({ params }: Props): Metadata {
  return buildMetadata({
    title: "Online Quran & Arabic Classes by Country | Rawdat ul-Huda Quran Academy",
    description:
      "1-on-1 Tajweed, Arabic and Noorani Qaida classes scheduled around your timezone — serving students in the USA, UK, Canada, Pakistan and worldwide.",
    path: "/locations",
    locale: "en",
  });
}

export default async function LocationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("locations");

  const items = t.raw("items") as { country: string; note: string }[];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
          ]),
        ]}
      />
      <PageHero eyebrow="Locations" title={t("indexTitle")} subtitle={t("indexSubtitle")} />

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((item, i) => {
              const flag = countries[i]?.flag ?? "🌍";
              return (
                <Link
                  key={i}
                  href={`/locations/${countries[i]?.slug ?? ""}`}
                  prefetch
                  className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                >
                  <span className="text-4xl" aria-hidden="true">
                    {flag}
                  </span>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-semibold text-brown-600">
                      {item.country}
                    </h2>
                    <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                      {item.note}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-600">
                      {t("timezoneNote")}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}