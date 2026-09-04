import type { Metadata } from "next";
import { site } from "./site";

type SeoArgs = {
  title: string;
  description: string;
  path: string;
  locale: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  locale,
  type = "website",
  image = "/og-image.png",
  publishedTime,
}: SeoArgs): Metadata {
  const otherLocale = locale === "en" ? "ar" : "en";
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: path,
      languages: {
        en: locale === "en" ? path : `/${otherLocale}${path}`,
        ar: locale === "ar" ? path : `/${otherLocale}${path}`,
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

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
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
      "@type": "Organization",
      name: site.name,
      sameAs: site.url,
    },
    courseMode: "Online",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT30M",
    },
    url: `${site.url}${path}`,
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

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function blogPostingSchema({
  title,
  description,
  path,
  publishedTime,
  author,
}: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: `${site.url}/og-image.png`,
    datePublished: publishedTime,
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}${path}`,
  };
}