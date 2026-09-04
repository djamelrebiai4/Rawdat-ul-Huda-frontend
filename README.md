# Moddakir — Quranic Education Website

Modern rebuild of moddakir.com: a conversion-focused site for 1-on-1 Tajweed, Arabic and Noorani Qaida classes.

## Tech Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (CSS-first `@theme` configuration)
- **next-intl** (Arabic RTL + English LTR, locale-prefixed routing `/en`, `/ar`)
- **lucide-react** icons

## Getting Started

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (45 static pages)
npm run start      # serve production build
```

## Structure

```
web/
├── messages/            # en.json + ar.json translation files (all site content)
├── src/
│   ├── app/[locale]/    # Pages: home, tajweed-course, arabic-course, noorani-qaida,
│   │                    #   about, pricing, faq, locations/[country], blog/[slug],
│   │                    #   contact, privacy-policy, terms
│   ├── components/
│   │   ├── ui/          # Button, ButtonLink, Accordion, Badge, Input, Select, Textarea...
│   │   ├── layout/      # Header (with mobile nav), Footer, LanguageSwitcher, FloatingWhatsApp
│   │   ├── sections/    # Hero, TrustBar, ProgramCards, HowItWorks, Testimonials, CTA...
│   │   └── forms/       # ContactForm, TrialForm (submit via WhatsApp deep link)
│   ├── lib/
│   │   ├── site.ts      # ⚠️ EDIT ME: WhatsApp number, email, socials
│   │   └── seo.ts       # Metadata + JSON-LD schema builders
│   └── i18n/            # next-intl routing/navigation/request config
├── next-intl.config.ts  # Locale configuration
└── public/              # favicon.svg, og-image.png, logo.png
```

## Editing Content

All site copy lives in `messages/en.json` and `messages/ar.json`. Add or edit any page text there — keys are namespaced per page (e.g. `tajweed.curriculum.levels`).

## Before Launch — Replace Placeholders

1. `src/lib/site.ts` — WhatsApp number, email, social URLs
2. `messages/*.json` — trust bar stats (10+ years, 500+ students, etc.), testimonials, pricing tiers, teacher credentials/journey on About page
3. `public/og-image.png` — replace with branded image containing your photo/logo
4. `sitemap.ts` + `robots.ts` — domain is already set to `https://moddakir.com`

## SEO

- Per-page meta titles/descriptions (unique per page + locale)
- JSON-LD: Organization (all pages), Course (3 course pages), FAQPage (/faq), BlogPosting (blog posts), BreadcrumbList (all pages)
- Canonical + hreflang alternates for en/ar
- Static sitemap.xml and robots.txt at `/sitemap.xml` and `/robots.txt`
- Next.js `<Image>`-free static site — all pages SSG prerendered

## Deployment

Deploy `web/` to Vercel (or any Node host). Set env if needed for custom domain.

```bash
vercel          # from web/ directory
```