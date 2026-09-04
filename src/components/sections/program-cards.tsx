import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, Sparkles, BookText } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const programs = [
  {
    key: "hifdh",
    href: "/hifdh",
    icon: BookText,
    tone: "bg-sage-600",
  },
  {
    key: "arabic",
    href: "/arabic-course",
    icon: BookOpen,
    tone: "bg-sage-500",
  },
  {
    key: "tajweed",
    href: "/tajweed-course",
    icon: Sparkles,
    tone: "bg-sage-700",
  },
] as const;

export function ProgramCards() {
  const t = useTranslations("programs");

  return (
    <section className="bg-background py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Programs"
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-12 grid gap-6 grid-cols-1 min-[320px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = program.icon;
            const tProgram = t.raw(program.key) as {
              title: string;
              description: string;
              cta: string;
            };
            return (
              <Link
                key={program.key}
                href={program.href}
                prefetch
                className="group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:-translate-y-0.5 active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${program.tone} text-cream-50`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-brown-600">
                  {tProgram.title}
                </h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-brown-500">
                  {tProgram.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-600 transition-colors group-hover:text-sage-700">
                  {tProgram.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}