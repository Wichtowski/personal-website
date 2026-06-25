# Oskar Wichtowski - Personal Website

Personal website and portfolio for Oskar Wichtowski.

This site is built with Next.js 16, React 19, TypeScript, Tailwind CSS, and `vinext`. It presents a bilingual portfolio experience, project case studies, articles, GitHub activity, and contact details in a single place.

## What's inside

- Landing page with a custom hero section
- Portfolio pages backed by MDX content
- Articles section with MDX posts in English and Polish
- GitHub activity page with live public API data
- Contact page and downloadable resume
- Light/dark theme support
- English and Polish localization

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- `vinext` for the Vite-based development/build flow
- Tailwind CSS 4
- MDX for portfolio and article content
- GitHub public API integration

## Routes

- `/` - home
- `/portfolio` - portfolio index
- `/portfolio/[slug]` - individual project case studies
- `/articles` - articles index
- `/blog/[slug]` - article pages
- `/github` - GitHub activity dashboard
- `/contact` - contact page

## Getting Started

Install dependencies:

```bash
bun install
```

Run the default Next.js dev server:

```bash
bun run dev
```

Run the `vinext` dev server:

```bash
bun run dev:vinext
```

Open the site at `http://localhost:3000` for `next dev`, or `http://localhost:3001` for `vinext dev`.

Optional environment variable:

- `GITHUB_TOKEN` - increases GitHub API rate limits for the live activity page

## Scripts

- `bun run dev` - start the Next.js dev server
- `bun run build` - build the app
- `bun run start` - start the production Next.js server
- `bun run lint` - run ESLint
- `bun run lint:fix` - run ESLint with autofix
- `bun run format` - format the codebase with Prettier
- `bun run format:check` - check formatting without writing
- `bun run dev:vinext` - start the Vinext dev server on port 3001
- `bun run build:vinext` - build with Vinext
- `bun run start:vinext` - start the Vinext production server

## Content Structure

- `src/content/projects` - project case studies in MDX
- `src/content/blog` - article content in MDX
- `src/locales/dictionary.ts` - translation strings
- `src/components` - reusable UI sections
- `src/app` - route definitions and layout

## Deployment

The site is set up to work well with Cloudflare Pages-style static hosting. The `public/_headers` file defines long-lived caching rules for static assets, and the app is organized so the build output can be deployed without extra runtime infrastructure.

## Notes

- The root layout is defined in `src/app/layout.tsx`
- Metadata is configured there as well
- The default language is English, with Polish available from the UI
- The `/github` page can work without a token, but `GITHUB_TOKEN` is recommended for better API limits
