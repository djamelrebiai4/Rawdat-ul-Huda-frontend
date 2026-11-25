import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "./site";

type SeoArgs = {
  title: string;
  description: string;
  path: string;
  locale: string;
  alternatePaths?: Partial<Record<"en" | "ar", string>>;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
};

type PageSeoArgs = Omit<SeoArgs, "title" | "description"> & {
  pageKey: string;
  fallbackTitle: string;
  fallbackDescription: string;
};

function localizedPath(path: string, locale: string) {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

export function buildMetadata({
  title,
  description,
  path,
  locale,
  alternatePaths,
  type = "website",
  image = "/og-image.png",
  publishedTime,
}: SeoArgs): Metadata {
  const canonicalPath = localizedPath(path, locale);
  const url = `${site.url}${canonicalPath}`;

  return {
    title,
    description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: url,
      languages: {
        en: `${site.url}${localizedPath(alternatePaths?.en ?? path, "en")}`,
        ar: `${site.url}${localizedPath(alternatePaths?.ar ?? path, "ar")}`,
        "x-default": `${site.url}${localizedPath(alternatePaths?.en ?? path, "en")}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: locale === "en" ? "en_US" : "ar_AR",
      alternateLocale: locale === "en" ? "ar_AR" : "en_US",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export async function buildPageMetadata({
  pageKey,
  fallbackTitle,
  fallbackDescription,
  ...metadataArgs
}: PageSeoArgs): Promise<Metadata> {
  const translations = await getTranslations({
    locale: metadataArgs.locale,
    namespace: "seo",
  });
  const translationKey = pageKey.startsWith("locationPages.")
    ? pageKey
    : `pages.${pageKey}`;
  const page = translations.raw(translationKey) as
    | { title?: unknown; description?: unknown }
    | undefined;

  return buildMetadata({
    ...metadataArgs,
    title:
      typeof page?.title === "string" && page.title.trim()
        ? page.title
        : fallbackTitle,
    description:
      typeof page?.description === "string" && page.description.trim()
        ? page.description
        : fallbackDescription,
  });
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    email: site.email,
    telephone: site.whatsappNumber,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: site.email,
      telephone: site.whatsappNumber,
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [site.facebook, site.twitter],
  };
}

export function courseSchema({
  name,
  description,
  locale,
  path,
}: {
  name: string;
  description: string;
  locale: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    inLanguage: locale === "en" ? "en" : "ar",
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      url: site.url,
      sameAs: [site.facebook, site.twitter],
    },
    courseMode: "Online",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT30M",
    },
    url: `${site.url}${localizedPath(path, locale)}`,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
  locale: string,
) {
  const arabicNames: Record<string, string> = {
    Home: "الرئيسية",
    Tajweed: "التجويد",
    "Arabic Course": "دورة العربية",
    "Hifdh Program": "برنامج الحفظ",
    About: "من نحن",
    Blog: "المدونة",
    Contact: "تواصل معنا",
    FAQ: "الأسئلة الشائعة",
    Pricing: "الأسعار",
    Locations: "الدول",
    USA: "الولايات المتحدة",
    UK: "المملكة المتحدة",
    CANADA: "كندا",
    PAKISTAN: "باكستان",
  };

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: locale === "ar" ? arabicNames[item.name] ?? item.name : item.name,
      item: `${site.url}${localizedPath(item.path, locale)}`,
    })),
  };
}

export function blogPostingSchema({
  title,
  description,
  path,
  publishedTime,
  author,
  locale,
}: {
  title: string;
  description: string;
  path: string;
  publishedTime?: string;
  author: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: `${site.url}/og-image.png`,
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    author: { "@type": "Organization", name: author, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
    mainEntityOfPage: `${site.url}${localizedPath(path, locale)}`,
  };
}