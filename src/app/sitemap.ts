import type { MetadataRoute } from "next";
import { loadSiteMessages, type SiteLocale } from "@/lib/site-content";
import { site } from "@/lib/site";

const locales: SiteLocale[] = ["en", "ar"];
const staticPaths = [
  "",
  "/tajweed-course",
  "/arabic-course",
  "/hifdh",
  "/about",
  "/pricing",
  "/faq",
  "/locations",
  "/blog",
  "/contact",
  "/privacy-policy",
  "/terms",
];

const countries = ["usa", "uk", "canada", "pakistan"];

function blogSlugs(messages: unknown): string[] {
  if (!messages || typeof messages !== "object" || !("blog" in messages)) return [];
  const blog = messages.blog;
  if (!blog || typeof blog !== "object" || !("posts" in blog) || !Array.isArray(blog.posts)) {
    return [];
  }

  return blog.posts.flatMap((post) =>
    post && typeof post === "object" && "slug" in post && typeof post.slug === "string"
      ? [post.slug]
      : [],
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const messages = await Promise.all(locales.map((locale) => loadSiteMessages(locale)));
  const entries: MetadataRoute.Sitemap = [];

  for (const [localeIndex, locale] of locales.entries()) {
    const paths = [
      ...staticPaths,
      ...countries.map((country) => `/locations/${country}`),
      ...blogSlugs(messages[localeIndex]).map((slug) => `/blog/${slug}`),
    ];

    for (const path of paths) {
      entries.push({
        url: `${site.url}/${locale}${path}`,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
