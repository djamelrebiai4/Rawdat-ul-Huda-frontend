import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { buildPageMetadata, courseSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    pageKey: "hifdh",
    fallbackTitle: "Online Quran Memorization (Hifdh) | Rawdat ul-Huda",
    fallbackDescription:
      "Memorize the Quran with one-to-one Hifdh lessons, structured revision, qualified teachers, and a pace tailored to you. Book a free trial class.",
    path: "/hifdh",
    locale,
  });
}

export default async function HifdhPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hifdh");

  const whoFor = t.raw("whoFor.items") as { title: string; text: string }[];
  const levels = t.raw("curriculum.levels") as {
    name: string;
    duration: string;
    topics: string[];
  }[];
  const formatItems = t.raw("format.items") as { title: string; text: string }[];

  return (
    <>
      <JsonLd
        data={[
          courseSchema({
            name: t("title"),
            description: t("subtitle"),
            locale,
            path: "/hifdh",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Hifdh Program", path: "/hifdh" },
          ], locale),
        ]}
      />
      <PageHero eyebrow="Program" title={t("title")} subtitle={t("subtitle")} tall />

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Introduction" title={t("whatIs.title")} align="start" />
          <p className="mt-6 text-lg leading-relaxed text-brown-500">{t("whatIs.text")}</p>
          <div className="mt-8 rounded-2xl border-s-4 border-terracotta-500 bg-terracotta-500/10 p-6">
            <p className="text-base leading-relaxed text-brown-500">{t("whatIs.why")}</p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Audience" title={t("whoFor.title")} />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {whoFor.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-sage-600 text-sm font-bold text-cream-50">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-brown-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Curriculum" title={t("curriculum.title")} />
          <div className="mt-12 flex flex-col gap-8">
            {levels.map((level, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-muted p-7 sm:p-9"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-600 font-display text-lg font-bold text-cream-50">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-brown-600">
                        {level.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{level.duration}</p>
                    </div>
                  </div>
                  <Badge variant="terracotta">{level.duration}</Badge>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {level.topics.map((topic, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-sage-600"
                        aria-hidden="true"
                      />
                      <span className="text-base text-brown-500">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brown-800 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Format"
            title={t("format.title")}
            tone="light"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {formatItems.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-sage-700/50 bg-brown-900/40 p-6"
              >
                <h3 className="font-display text-lg font-semibold text-ochre-300">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sage-100/80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}