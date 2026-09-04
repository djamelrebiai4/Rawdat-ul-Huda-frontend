import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as { name: string; location: string; text: string }[];

  return (
    <section className="bg-muted py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-12 grid gap-6 grid-cols-1 min-[320px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <Quote
                className="h-8 w-8 text-ochre-500/50 rtl:-scale-x-100"
                aria-hidden="true"
              />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-brown-500">
                {item.text}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-600 font-display text-base font-bold text-cream-50">
                  {item.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brown-600">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}