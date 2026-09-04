import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";

const stats = [
  { key: "years", value: "10+" },
  { key: "students", value: "500+" },
  { key: "countries", value: "25+" },
  { key: "lessons", value: "20,000+" },
] as const;

export function TrustBar() {
  const t = useTranslations("trustBar");

  return (
    <section className="border-b border-border bg-cream-50" aria-label="Statistics">
      <Container className="grid grid-cols-2 gap-y-8 py-10 min-[320px]:grid-cols-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="font-display text-3xl font-bold text-sage-700 sm:text-4xl">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {t(stat.key)}
            </span>
          </div>
        ))}
      </Container>
    </section>
  );
}