import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";

export function FaqTeaser() {
  const t = useTranslations("faqTeaser");
  const items = t.raw("items") as { question: string; answer: string }[];

  return (
    <section className="bg-background py-20 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-10">
          <Accordion items={items} defaultOpen={0} />
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/faq" variant="outline">
            {t("cta")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}