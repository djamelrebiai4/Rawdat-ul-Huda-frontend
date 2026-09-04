import { cn } from "@/lib/utils";
import { RubElHizb } from "@/components/rub-el-hizb";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]",
            tone === "dark" ? "text-terracotta-500" : "text-terracotta-300"
          )}
        >
          <RubElHizb className="h-4 w-4" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl",
          tone === "dark" ? "text-brown-600" : "text-cream-50"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-brown-500" : "text-sage-100/80"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}