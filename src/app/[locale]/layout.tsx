import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Amiri, Fraunces, Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { buildMetadata, buildPageMetadata, organizationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return buildPageMetadata({
    pageKey: "home",
    fallbackTitle: "Online Quran Classes | Rawdat ul-Huda Quran Academy",
    fallbackDescription:
      "Learn Quran recitation, Tajweed, and Arabic online with qualified teachers. Get one-to-one lessons for all ages, flexible schedules, and a free trial class.",
    path: "/",
    locale,
  });
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon-32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${amiri.variable} bg-background font-body text-foreground antialiased`}
      >
        <JsonLd data={organizationSchema()} />
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}