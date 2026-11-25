import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquareText, CheckCircle2 } from "lucide-react";
import { buildPageMetadata, courseSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    pageKey: "arabic",
    fallbackTitle: "Online Arabic Classes: Quranic & Spoken | Rawdat ul-Huda",
    fallbackDescription:
      "Choose one-to-one online Quranic Arabic or conversational Arabic classes. Follow a personal learning plan and book a free trial lesson.",
    path: "/arabic-course",
    locale,
  });
}

export default async function ArabicCoursePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("arabic");

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
            path: "/arabic-course",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Arabic Course", path: "/arabic-course" },
          ], locale),
        ]}
      />
      <PageHero eyebrow="Course" title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-cream-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Tracks" title={t("distinction.title")} />
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-brown-500">
            {t("distinction.text")}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-sage-500/25 bg-sage-50 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sage-600 text-cream-50">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-brown-600">
                {t("distinction.quranic.title")}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-brown-500">
                {t("distinction.quranic.text")}
              </p>
            </div>
            <div className="rounded-2xl border border-terracotta-500/40 bg-terracotta-500/10 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-500 text-cream-50">
                <MessageSquareText className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-brown-600">
                {t("distinction.conversational.title")}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-brown-500">
                {t("distinction.conversational.text")}
              </p>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-muted p-5 text-center text-base text-muted-foreground">
            {t("note")}
          </p>
        </Container>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Curriculum" title={t("curriculum.title")} />
          <div className="mt-12 flex flex-col gap-8">
            {levels.map((level, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-7 sm:p-9"
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
                  <Badge variant="sage">{level.duration}</Badge>
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

      <section className="bg-brown-800 flex min-h-[75vh] sm:min-h-auto items-center py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Format" title={t("format.title")} tone="light" />
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