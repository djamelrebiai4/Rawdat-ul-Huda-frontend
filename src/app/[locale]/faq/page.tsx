import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { whatsappLink } from "@/lib/site";
import { buildMetadata, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata({ params }: Props): Metadata {
  return buildMetadata({
    title: "FAQ — Everything You Need to Know | Rawdat ul-Huda Quran Academy",
    description:
      "Answers to common questions about our online Tajweed, Arabic and Noorani Qaida classes: requirements, platforms, schedules, and policies.",
    path: "/faq",
    locale: "en",
  });
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  const items = t.raw("items") as { question: string; answer: string }[];

  return (
    <>
      <JsonLd
        data={[
          faqSchema(items),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />
      <PageHero eyebrow="FAQ" title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-background py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Accordion items={items} defaultOpen={0} />

          <div className="mt-12 rounded-2xl border border-terracotta-500/40 bg-terracotta-500/10 p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-brown-600 sm:text-2xl">
              {t("contactCta")}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">{t("contactCtaText")}</p>
            <a
              href={whatsappLink("")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-md bg-sage-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-sage-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}