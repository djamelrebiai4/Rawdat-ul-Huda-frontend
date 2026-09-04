import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { buildMetadata, courseSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata({ params }: Props): Metadata {
  return buildMetadata({
    title: "Tajweed — Learn to Read Quran from Zero | Rawdat ul-Huda Quran Academy",
    description:
      "Learn to read the Quran with zero Arabic background. Tajweed foundations classes 1-on-1 online. 3-6 months to reading. Book a free trial.",
    path: "/tajweed-course",
    locale: "en",
  });
}

export default async function TajweedCoursePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tajweed");

  const highlights = t.raw("whatIs.highlights") as string[];
  const curriculum = t.raw("curriculum.items") as { level: string; text: string }[];

  return (
    <>
      <JsonLd
        data={[
          courseSchema({
            name: "Tajweed",
            description:
              "Beginner course to learn reading Arabic and the Quran from absolute zero.",
            locale,
            path: "/tajweed-course",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tajweed", path: "/tajweed-course" },
          ]),
        ]}
      />
      <PageHero eyebrow="Beginner" title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Introduction" title={t("whatIs.title")} align="start" />
          <p className="mt-6 text-lg leading-relaxed text-brown-500">{t("whatIs.text")}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage-600" aria-hidden="true" />
                <span className="text-base text-brown-500">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-brown-900 flex min-h-[75vh] sm:min-h-auto items-center py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Curriculum" title={t("curriculum.title")} tone="light" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {curriculum.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-sage-700/50 bg-brown-800/50 p-6"
              >
                <span className="font-display text-2xl font-bold text-ochre-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-cream-50">
                  {item.level}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sage-100/75">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="rounded-2xl border border-terracotta-500/40 bg-terracotta-500/10 p-8 text-center sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-brown-600 sm:text-3xl">
              {t("timeline.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brown-500">{t("timeline.text")}</p>
            <p className="mt-4 rounded-lg bg-cream-50/70 p-4 text-base font-medium text-brown-900">
              {t("timeline.note")}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-600 text-cream-50">
            <GraduationCap className="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-display text-2xl font-semibold text-brown-600 sm:text-3xl">
            {t("afterTajweed.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t("afterTajweed.text")}
          </p>
          <div className="mt-8">
            <ButtonLink href="/contact" variant="accent" size="lg">
              {t("afterTajweed.cta")}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}