import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "lucide-react";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata({ params }: Props): Metadata {
  return buildMetadata({
    title: "Blog — Learn Quran, Tajweed & Arabic | Rawdat ul-Huda Quran Academy",
    description:
      "Guides and insights: how long Tajweed takes, rules for beginners, learning Quran as an adult, and Quranic Arabic vs conversational Arabic.",
    path: "/blog",
    locale: "en",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const posts = t.raw("posts") as {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
  }[];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <PageHero eyebrow="Blog" title={t("title")} subtitle={t("subtitle")} />

      <section className="bg-background py-16 sm:py-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-lg text-muted-foreground">{t("noPosts")}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  prefetch
                  className={
                    i === 0
                      ? "group flex flex-col rounded-2xl border-2 border-sage-600 bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 md:col-span-2"
                      : "group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                  }
                >
                  {i === 0 && (
                    <span className="mb-4 inline-flex w-fit items-center rounded-full bg-ochre-100 px-3 py-1 text-xs font-semibold text-ochre-700">
                      ✦ {t("publishedOn")}
                    </span>
                  )}
                  <h2 className="font-display text-xl font-semibold text-brown-600 transition-colors group-hover:text-sage-700 sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 flex-1 text-base leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-600">
                    {t("readMore")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}