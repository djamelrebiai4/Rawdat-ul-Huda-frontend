import { RubElHizb } from "@/components/rub-el-hizb";
import { IslamicPattern } from "@/components/islamic-pattern";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tall?: boolean;
};

export function PageHero({ eyebrow, title, subtitle, tall = false }: PageHeroProps) {
  const paddingClass = tall 
    ? "pb-28 md:pb-36" 
    : "pb-16 sm:pb-20 lg:pb-24";
  
  return (
    <section className="relative overflow-hidden bg-brown-900">
      <IslamicPattern className="pointer-events-none absolute inset-0 h-full w-full text-sage-900/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brown-900/50 via-transparent to-brown-900" />
      <div className={`relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 ${paddingClass} text-center sm:px-6 mt-10`} style={{ paddingTop: 'var(--navbar-height)' } as React.CSSProperties}>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-terracotta-500/40 bg-terracotta-500/10 px-4 py-1.5 text-sm font-semibold text-terracotta-300">
            <RubElHizb className="h-4 w-4" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-sage-100/85 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}