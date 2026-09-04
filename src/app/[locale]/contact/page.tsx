import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { TrialForm } from "@/components/forms/trial-form";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { whatsappLink } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata({ params }: Props): Metadata {
  return buildMetadata({
    title: "Contact Us — Book a Free Trial | Rawdat ul-Huda Quran Academy",
    description:
      "Contact Rawdat ul-Huda Quran Academy to book your free trial class. Message us on WhatsApp or use the form — no payment required upfront.",
    path: "/contact",
    locale: "en",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <PageHero eyebrow="Contact" title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <div className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8">
                <h2 className="font-display text-xl font-semibold text-brown-600">
                  {t("whatsappTitle")}
                </h2>
                <p className="mt-2 text-base text-muted-foreground">{t("whatsappText")}</p>
                <a
                  href={whatsappLink("")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2.5 rounded-md bg-sage-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-sage-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {t("whatsappCta")}
                </a>
              </div>

              <div className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8">
                <h2 className="font-display text-xl font-semibold text-brown-600">
                  {t("formTitle")}
                </h2>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-terracotta-500/40 bg-terracotta-500/10 p-7 sm:p-8 lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-2xl font-semibold text-brown-600">
                {t("trialTitle")}
              </h2>
              <p className="mt-2 text-base text-muted-foreground">{t("trialSubtitle")}</p>
              <div className="mt-6">
                <TrialForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}