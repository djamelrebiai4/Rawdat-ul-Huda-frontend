import type { MetadataRoute } from "next";

const baseUrl = "https://moddakir.com";

const paths = [
  "",
  "/tajweed-course",
  "/arabic-course",
  "/noorani-qaida",
  "/about",
  "/pricing",
  "/faq",
  "/locations",
  "/locations/usa",
  "/locations/uk",
  "/locations/canada",
  "/locations/pakistan",
  "/blog",
  "/blog/how-long-to-learn-tajweed",
  "/blog/tajweed-rules-for-beginners",
  "/blog/can-adults-learn-quran-from-scratch",
  "/blog/quranic-arabic-vs-conversational-arabic",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ["en", "ar"].flatMap((locale) =>
    paths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }))
  );
}
