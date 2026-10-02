# Oskar Wichtowski - Personal Website

Personal website and portfolio for Oskar Wichtowski.

This site is built with Next.js 16, React 19, TypeScript, Tailwind CSS, and `vinext`. It presents a bilingual portfolio experience, project case studies, articles, development contributions, and contact details in a single place.

## What's inside

- Landing page with a custom hero section
- Portfolio pages backed by MDX content
- Articles section with MDX posts in English and Polish
- Contributions page with live public GitHub API data and development profiles
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
- `/contributions` - development activity dashboard and profiles
- `/contact` - contact page

## Getting Started

Install dependencies:

```bash
bun install
```

Run the local Vinext/Vite dev server:

```bash
bun run dev
```

Open the site at `http://localhost:3001`.
Local development runs in Node without generating Wrangler config, starting the Workers emulator, or accessing Cloudflare KV.

Optional environment variable:

- `GITHUB_TOKEN` - increases GitHub API rate limits for the live activity page

## Scripts

- `bun run dev` - start the local Vinext dev server on port 3001
- `bun run lint` - run ESLint
- `bun run lint:fix` - run ESLint with autofix
- `bun run format` - format the codebase with Prettier
- `bun run format:check` - check formatting without writing
- `bun run typecheck` - run TypeScript checks
- `bun test` - run tests
- `bun run build:vinext` - build with Vinext for Node
- `bun run start:vinext` - start the Vinext production server
- `bun run deploy` - build and deploy to Cloudflare Workers
- `bun run deploy:preview` - build and deploy a Cloudflare preview

## Content Structure

- `src/content/projects` - project case studies in MDX
- `src/content/blog` - article content in MDX
- `src/locales/dictionary.ts` - translation strings
- `src/components` - reusable UI sections
- `src/app` - route definitions and layout

## Deployment

Production runs on Cloudflare Workers.
The deploy scripts generate Wrangler config and enable the Cloudflare plugin and KV cache adapter through `WRANGLER_CONFIG_PATH`.
GitHub Actions deploys pushes to `main`.

## Notes

- The root layout is defined in `src/app/layout.tsx`
- Metadata is configured there as well
- The default language is English, with Polish available from the UI
- The `/contributions` page can work without a token, but `GITHUB_TOKEN` is recommended for better API limits
