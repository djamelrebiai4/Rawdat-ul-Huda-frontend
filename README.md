# Moddakir — Quranic Education Website

Modern rebuild of moddakir.com: a conversion-focused site for 1-on-1 Tajweed, Arabic and Noorani Qaida classes.

## Tech Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (CSS-first `@theme` configuration)
- **next-intl** (Arabic RTL + English LTR, locale-prefixed routing `/en`, `/ar`)
- **lucide-react** icons
- **Separate API:** Express service in `../backend`; the frontend does not connect to Supabase directly.

## Getting Started

Run these commands from the shared `web/` workspace root. Start the API from one terminal:

```bash
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:4000
```

Set `BACKEND_API_URL=http://localhost:4000` in `frontend/.env.local`, then start the website from another terminal:

```bash
cd frontend
pnpm install
pnpm dev           # http://localhost:3000
pnpm build
pnpm start
```

## Structure

```
web/
├── backend/            # Express REST API; owns authentication and all Supabase access
├── supabase/migrations/# database schema and owner membership policies
└── frontend/
	├── messages/        # en.json + ar.json fallback content
	├── src/
	│   ├── app/[locale]/ # Localized public pages
	│   ├── components/  # Layout, page sections, forms, and UI controls
	│   ├── lib/         # API client, fallback site details, SEO helpers
	│   └── i18n/        # next-intl routing and request config
	├── next-intl.config.ts
	└── public/          # favicon.svg, og-image.png, logo.png
```

## Site Owner Management

The owner signs in at `/admin/login`. Page content, pricing, and public contact details are saved through the separate API. Translation JSON files remain the fallback defaults when no override has been saved.

Run the SQL migration in `../supabase/migrations/20261012000000_owner_cms.sql`, create the owner's account in Supabase Auth, then add that account's user ID to `public.site_admins`. Set Supabase credentials and `SESSION_SECRET` only in `backend/.env`. Never put the service-role key or session secret in the frontend environment.

## Before Launch — Replace Placeholders

1. Confirm the site details, prices, testimonials, and teacher information in `/admin`.
2. `public/og-image.png` — replace with branded image containing your photo/logo.
3. Confirm `site.url` in `src/lib/site.ts` matches the production domain.

## SEO

- Public pages are server-rendered and localized pages are prerendered where possible. New CMS blog slugs render on demand.
- Edit page titles and descriptions in the **SEO** section of `/admin`; edit each post's SEO title, meta description, and URL slug in **Blog posts and article SEO**.
- The sitemap includes public routes and published blog slugs from localized site content. `robots.txt` points to it and disallows `/admin` and `/api/`.
- Canonical URLs and English/Arabic `hreflang` alternates are generated per localized route.
- JSON-LD includes EducationalOrganization, Course, FAQPage, BlogPosting, and BreadcrumbList data where applicable.
- Public CMS reads are cached for five minutes and invalidated when an owner publishes changes. Images use Next.js optimization with AVIF/WebP output; local fonts use `font-display: swap`.

## Deployment

Deploy `frontend/` and `backend/` as separate Node services. Set `BACKEND_API_URL` in the frontend and set `FRONTEND_ORIGINS`, Supabase credentials, and `SESSION_SECRET` in the backend.