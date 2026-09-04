import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { RubElHizb } from "@/components/rub-el-hizb";
import { ArrowRight, CalendarDays } from "lucide-react";
import { buildMetadata, breadcrumbSchema, blogPostingSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const postDates: Record<string, string> = {
  "how-long-to-learn-tajweed": "2026-01-15",
  "tajweed-rules-for-beginners": "2026-01-22",
  "can-adults-learn-quran-from-scratch": "2026-02-05",
  "quranic-arabic-vs-conversational-arabic": "2026-02-12",
};

export function generateStaticParams() {
  const slugs = Object.keys(postDates);
  return ["en", "ar"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations("blog");
  const posts = t.raw("posts") as { slug: string; title: string; excerpt: string }[];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    locale,
    type: "article",
    publishedTime: postDates[slug],
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const posts = t.raw("posts") as {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
  }[];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split("\n").filter((p) => p.trim() !== "");
  const related = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article>
      <JsonLd
        data={[
          blogPostingSchema({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${slug}`,
            publishedTime: postDates[slug],
            author: "Rawdat ul-Huda Quran Academy",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <section className="relative overflow-hidden bg-brown-900 py-16 sm:py-20">
        <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            prefetch
            className="inline-flex items-center gap-2 text-sm font-semibold text-ochre-300 transition-colors hover:text-ochre-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400"
          >
            <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" aria-hidden="true" />
            {t("backToBlog")}
          </Link>
          <h1 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-sage-100/70">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {t("publishedOn")} {new Date(postDates[slug]).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-14 sm:py-16">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-6">
            {paragraphs.map((paragraph, i) => {
              const isHeading =
                /^\d+\./.test(paragraph) ||
                /^[A-Z][^:]{3,40}:$/.test(paragraph) ||
                (paragraph === paragraph.toUpperCase() && paragraph.length > 8);
              return isHeading ? (
                <h2
                  key={i}
                  className="mt-4 font-display text-xl font-semibold text-brown-600 sm:text-2xl"
                >
                  {paragraph.replace(/:$/, "")}
                </h2>
              ) : (
                <p key={i} className="text-lg leading-relaxed text-brown-500">
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-terracotta-500/40 bg-terracotta-500/10 p-8 text-center">
            <RubElHizb className="mx-auto h-8 w-8 text-terracotta-500" />
            <p className="mt-4 font-display text-xl font-semibold text-brown-600">
              {t("title")}
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="accent">
                Book Free Trial
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-background py-14 sm:py-16">
          <Container className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-brown-600">
              {t("related")}
            </h2>
            <div className="mt-6 flex flex-col gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  prefetch
                  className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-sage-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                >
                  <h3 className="font-display text-lg font-semibold text-brown-600">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}