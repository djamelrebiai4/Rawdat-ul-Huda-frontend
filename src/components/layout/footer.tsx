import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { whatsappLink } from "@/lib/site";

const programs = [
  { key: "hifdh", href: "/hifdh" },
  { key: "arabic", href: "/arabic-course" },
  { key: "tajweed", href: "/tajweed-course" },
] as const;

const company = [
  { key: "about", href: "/about" },
  { key: "pricing", href: "/pricing" },
  { key: "faq", href: "/faq" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const siteT = useTranslations("site");

  return (
    <footer className="border-t border-border bg-muted">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Link href="/" prefetch className="inline-flex items-center gap-2.5" aria-label="Rawdat ul-Huda Quran Academy">
              <Image
                src="/logo.png"
                alt="Rawdat ul-Huda Quran Academy"
                width={1254}
                height={1254}
                className="h-9 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <nav aria-label={t("programs")}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-brown-600">
              {t("programs")}
            </h3>
            <ul className="flex flex-col gap-2">
              {programs.map((p) => (
                <li key={p.key}>
                  <Link
                    href={p.href}
                    prefetch
                    className="text-sm text-muted-foreground transition-colors hover:text-sage-600"
                  >
                    {nav(p.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("company")}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-brown-600">
              {t("company")}
            </h3>
            <ul className="flex flex-col gap-2">
              {company.map((p) => (
                <li key={p.key}>
                  <Link
                    href={p.href}
                    prefetch
                    className="text-sm text-muted-foreground transition-colors hover:text-sage-600"
                  >
                    {nav(p.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-brown-600">
              {t("legal")}
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/privacy-policy"
                  prefetch
                  className="text-sm text-muted-foreground transition-colors hover:text-sage-600"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  prefetch
                  className="text-sm text-muted-foreground transition-colors hover:text-sage-600"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <a
                  href={whatsappLink("", siteT("whatsappNumber"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-sage-600"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rawdat ul-Huda Quran Academy. {t("rights")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("madeWith")}{" "}
            <span className="text-terracotta-500" aria-hidden="true">
              ۞
            </span>{" "}
            {siteT("name")}
          </p>
        </div>
      </Container>
    </footer>
  );
}