import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata({ params }: Props): Metadata {
  return buildMetadata({
    title: "Privacy Policy | Rawdat ul-Huda Quran Academy",
    description: "How Rawdat ul-Huda Quran Academy collects, uses and protects your personal information.",
    path: "/privacy-policy",
    locale: "en",
  });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sections = [
    {
      title: locale === "ar" ? "المعلومات التي نجمعها" : "Information We Collect",
      body:
        locale === "ar"
          ? "نجمع فقط المعلومات التي تقدمها لنا طواعية: اسمك وبريدك الإلكتروني ورقم واتساب والرسائل التي ترسلها عبر نماذج الموقع أو واتساب."
          : "We only collect information you provide voluntarily: your name, email address, WhatsApp number, and messages you send through our site forms or WhatsApp.",
    },
    {
      title: locale === "ar" ? "كيف نستخدم معلوماتك" : "How We Use Your Information",
      body:
        locale === "ar"
          ? "نستخدم معلوماتك حصريًا للتواصل معك بخصوص الدروس التجريبية والدروس المستمرة وتحسين خدماتنا. لا نبيع معلوماتك لأي طرف ثالث أبدًا."
          : "We use your information exclusively to contact you about trial classes, ongoing lessons, and to improve our services. We never sell your information to any third party.",
    },
    {
      title: locale === "ar" ? "الأمان" : "Security",
      body:
        locale === "ar"
          ? "نتخذ إجراءات معقولة لحماية معلوماتك الشخصية. تُستخدم البيانات الحساسة فقط للغرض المقصود منها."
          : "We take reasonable measures to protect your personal information. Sensitive data is used only for its intended purpose.",
    },
    {
      title: locale === "ar" ? "حقوقك" : "Your Rights",
      body:
        locale === "ar"
          ? "يمكنك طلب الاطلاع على معلوماتك أو تصحيحها أو حذفها في أي وقت بالتواصل معنا عبر البريد الإلكتروني hello@moddakir.com."
          : "You may request access to, correction of, or deletion of your information at any time by contacting us at hello@moddakir.com.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
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