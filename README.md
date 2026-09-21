# PixelPress

Free image tools that process everything locally in your browser.

## Stack

- Astro 5 (SSG) + TypeScript + React islands for interactive tools
- Cloudflare Pages (auto-deploy on push to `main` via GitHub Actions)
- SEO: per-tool URLs, sitemap.xml, robots.txt, canonical, Open Graph, Schema.org (WebApplication, BreadcrumbList, FAQPage)

## Develop

```bash
npm install
npm run dev
npm run build
npm test
```

## Add a tool

1. Add an entry to `src/data/tools.ts` (slug, SEO fields, intro, howTo, examples, faqs, related, component).
2. Create the interactive component in `src/tools/` (React) if no existing one fits.
3. Mark `implemented: true`. The page, sitemap entry, search index and cards are generated automatically.

## Privacy

All tool processing is client-side. No user input is sent to any server.
