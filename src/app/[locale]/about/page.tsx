import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RubElHizb } from "@/components/rub-el-hizb";
import { Award, BookOpenCheck, Users } from "lucide-react";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata({ params }: Props): Metadata {
  return buildMetadata({
    title: "About — Your Tajweed Teacher | Rawdat ul-Huda Quran Academy",
    description:
      "Meet your Rawdat ul-Huda Quran Academy teacher: ijazah-certified in Quranic recitation with years of experience teaching students worldwide.",
    path: "/about",
    locale: "en",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const journey = t.raw("journey") as { year: string; title: string; description: string }[];

  const credentials = [
    { icon: Award, text: t("credentials") },
    { icon: BookOpenCheck, text: t("philosophy") },
    { icon: Users, text: t("subtitle") },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <PageHero eyebrow="About" title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-ochre-300/40 to-transparent animate-shimmer blur-xl" aria-hidden="true" />
              {/* White circle with logo + inner edge glow */}
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-cream-50 border-2 border-ochre-300/60 shadow-[0_0_0_1px_rgba(176,141,87,0.15),0_8px_30px_rgba(0,0,0,0.06),inset_0_0_30px_rgba(176,141,87,0.35)]">
                <Image
                  src="/logo.png"
                  alt=""
                  width={1254}
                  height={1254}
                  className="h-24 w-24 drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                  aria-hidden="true"
                />
              </div>
              <span className="absolute -bottom-1 -end-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream-50 bg-sage-600 shadow-lg">
                <Award className="h-5 w-5 text-cream-50" aria-hidden="true" />
              </span>
            </div>

            <h2 className="mt-8 font-display text-2xl font-semibold text-brown-600 sm:text-3xl">
              {t("philosophy")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brown-500">{t("philosophyText")}</p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Credentials" title={t("credentials")} />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {credentials.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-7 text-center shadow-sm"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sage-600 text-cream-50">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="text-base font-medium text-brown-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Timeline" title={t("journeyTitle")} />
          <ol className="relative mt-12 flex flex-col gap-10 border-s-2 border-terracotta-500/30 ps-8">
            {journey.map((item, i) => (
              <li key={i} className="relative">
                <span
                  className="absolute -start-[2.4rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-terracotta-500 bg-cream-50"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-sage-600" />
                </span>
                <span className="font-display text-sm font-bold uppercase tracking-wider text-terracotta-500">
                  {item.year}
                </span>
                <h3 className="mt-1 font-display text-xl font-semibold text-brown-600">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-brown-500">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}