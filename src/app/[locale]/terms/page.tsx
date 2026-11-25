import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    pageKey: "terms",
    fallbackTitle: "Terms & Conditions | Rawdat ul-Huda",
    fallbackDescription:
      "Review the terms for Rawdat ul-Huda online Quran, Tajweed, and Arabic classes, including payments, cancellations, rescheduling, and refunds.",
    path: "/terms",
    locale,
  });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sections = [
    {
      title: locale === "ar" ? "الخدمات" : "Services",
      body:
        locale === "ar"
          ? "نقدم دروسًا فردية عبر الإنترنت في التجويد والعربية والقاعدة النورانية. تُعقد الدروس عبر منصات الفيديو المتفق عليها."
          : "We provide one-on-one online classes in Tajweed, Arabic and Noorani Qaida. Classes are held via agreed video platforms.",
    },
    {
      title: locale === "ar" ? "الدفع والإلغاء" : "Payment and Cancellation",
      body:
        locale === "ar"
          ? "تُدفع الرسوم شهريًا مقدمًا. يمكنك إلغاء اشتراكك في أي وقت بدون رسوم إلغاء، أو إيقافه مؤقتًا حتى ثلاثة أشهر."
          : "Fees are paid monthly in advance. You may cancel your subscription at any time with no cancellation fees, or pause it for up to three months.",
    },
    {
      title: locale === "ar" ? "إعادة الجدولة" : "Rescheduling",
      body:
        locale === "ar"
          ? "يمكنك إعادة جدولة الدروس خلال ٢٤ ساعة من موعد الدرس المحدد دون أي رسوم إضافية."
          : "You may reschedule lessons up to 24 hours before the scheduled time at no additional cost.",
    },
    {
      title: locale === "ar" ? "الاسترداد" : "Refunds",
      body:
        locale === "ar"
          ? "غير راضٍ عن أول جلستين مدفوعتين؟ يمكنك طلب استرداد كامل خلال ١٤ يومًا من الاشتراك."
          : "Not satisfied after your first two paid sessions? You may request a full refund within 14 days of subscribing.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
      />
      <section className="bg-background py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-display text-xl font-semibold text-brown-600">
                  {section.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-brown-500">
                  {section.body}
                </p>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              {locale === "ar"
                ? "آخر تحديث: يناير ٢٠٢٦"
                : "Last updated: January 2026"}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}