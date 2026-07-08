AUDIT:
I audited the uploaded `vinext-context.tar.gz` as a **static code audit**. I did not run Lighthouse against a live deployment, so this is based on the source, routing, metadata, assets, and likely bundle/runtime behavior.

## Verdict

**SEO: needs work.** The content is good, but the app currently hides too much important content behind client components and uses mostly one global metadata object.

**Performance: main risk is over-hydration.** The app renders a slick slider-style experience, but it ships/initializes too many client components for routes that do not need them.

The biggest issue is not your metadata sentence. It is this combination:

```tsx
// src/components/landingpage/LandingPage.tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setTimeout(() => setMounted(true), 0);
}, []);

if (!mounted) return null;
```

This means the homepage’s most important content is not present in the initial server-rendered HTML. That is bad for SEO, perceived performance, and no-JS fallback.

---

## P0 fixes

### 1. Remove the full-page `mounted` gate from `LandingPage`

Current file: `src/components/landingpage/LandingPage.tsx:14-22`

Right now the whole homepage returns `null` until the browser runs JS. Instead, render the hero immediately and only client-gate tiny theme-dependent pieces.

Bad pattern:

```tsx
if (!mounted) return null;
```

Better:

```tsx
export function LandingPage({ nowPlaying }: LandingPageProps) {
  return (
    <section
      id="home"
      className="w-screen h-full overflow-y-auto no-scrollbar flex flex-col justify-start relative overflow-hidden pt-12 pb-4 md:pt-32"
    >
      <div className="max-w-6xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center space-y-8">
        <Hero />
        <div className="w-full flex flex-col gap-12 pt-4">
          <TechStackShowcase />
          <SpotifyNowPlaying nowPlaying={nowPlaying} />
        </div>
      </div>
      <Footer />
    </section>
  );
}
```

Next.js App Router already gives you Server Components by default, and Client Components should be used only where browser interactivity is needed. Your current setup makes too much of the first screen dependent on hydration. ([Next.js][1])

---

### 2. Stop rendering all main pages inside `MainSlider`

Current file: `src/components/layout/MainSlider.tsx:27-46`

This is the biggest performance smell:

```tsx
<div className="w-screen h-full shrink-0">{homeSlide}</div>
<div className="w-screen h-full shrink-0">
  <GithubPageContent initialData={null} />
</div>
<div className="w-screen h-full shrink-0">
  <PortfolioSection projects={projects} />
</div>
<div className="w-screen h-full shrink-0">{articlesSlide}</div>
<div className="w-screen h-full shrink-0">
  <ContactSection />
</div>
```

Every main route loads the home, GitHub, portfolio, articles, and contact sections. That means more DOM, more React work, more Framer Motion, more icons, and more serialized data than needed.

I’d replace this with route-level pages and keep transitions around `children`, not around a manually rendered 5-page carousel.

Better direction:

```tsx
// src/components/layout/AppLayout.tsx
"use client";

import { ReactNode } from "react";
import { PageTransition } from "./PageTransition";

export function AppLayout({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
```

Then let `/`, `/github`, `/portfolio`, `/articles`, and `/contact` render only their own content.

This also reduces duplicate page content across URLs, which can confuse title/snippet generation because Google uses multiple signals including visible headings and prominent page text. ([Google for Developers][2])

---

### 3. Add real per-page metadata

Current global metadata only exists in `src/app/layout.tsx:21-25`.

That means `/articles`, `/portfolio`, `/blog/[slug]`, `/portfolio/[slug]`, `/github`, and `/contact` likely share the same title/description unless overridden.

Next’s Metadata API is specifically meant for route-level SEO and social sharing metadata. ([Next.js][3])

For root layout:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://oskarwichtowski.com"),
  title: {
    default: "Oskar Wichtowski — AI Engineer & Fullstack Developer",
    template: "%s | Oskar Wichtowski",
  },
  description:
    "I build AI-powered applications, LLM integrations, ecommerce automations, and full-stack tools — from PoCs to production-ready systems.",
  openGraph: {
    type: "website",
    siteName: "Oskar Wichtowski",
    title: "Oskar Wichtowski — AI Engineer & Fullstack Developer",
    description:
      "AI-powered applications, LLM integrations, ecommerce automations, and full-stack tools.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oskar Wichtowski — AI Engineer & Fullstack Developer",
    description:
      "AI-powered applications, LLM integrations, ecommerce automations, and full-stack tools.",
  },
  alternates: {
    canonical: "/",
  },
};
```

For blog details:

```tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { getArticleBySlug } from "@lib/mdx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  const { metadata } = article;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: metadata.title,
      description: metadata.description,
      url: `/blog/${slug}`,
      publishedTime: metadata.date,
      authors: ["Oskar Wichtowski"],
      tags: metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
  };
}
```

Do the same for `portfolio/[slug]`.

---

### 4. Add sitemap and robots

I found no `src/app/sitemap.ts`, `src/app/robots.ts`, `robots.txt`, or sitemap file.

For a portfolio/blog site, this is easy and worth doing. Google says sitemaps can be submitted through Search Console or referenced from `robots.txt`; they are a hint, not a guarantee, but they help discovery. ([Google for Developers][4]) Next also supports `robots.txt` through app metadata file conventions. ([Next.js][5])

Example:

```tsx
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getArticles, getProjects } from "@lib/mdx";

const baseUrl = "https://oskarwichtowski.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/github", "/portfolio", "/articles", "/contact", "/explore"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    }),
  );

  const articleRoutes = getArticles().map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
  }));

  const projectRoutes = getProjects().map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.date),
  }));

  return [...staticRoutes, ...articleRoutes, ...projectRoutes];
}
```

```tsx
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://oskarwichtowski.com/sitemap.xml",
  };
}
```

---

### 5. Fix Polish/English SEO

You have English and Polish content files, for example:

```txt
serverless-ai-pipeline-indexed-300k-scientific-papers.mdx
serverless-ai-pipeline-indexed-300k-scientific-papers-pl.mdx
```

But the root HTML is always:

```tsx
<html lang="en">
```

File: `src/app/layout.tsx:33-35`

That means Polish pages are still served as `lang="en"`. Also, there are no `hreflang` alternates. Google recommends `hreflang` when you have localized versions of the same content. ([Google for Developers][6])

Best fix: move to locale routes:

```txt
/en
/pl
/en/blog/[slug]
/pl/blog/[slug]
```

If you do not want that yet, at least add canonical/alternate metadata for paired articles and projects. But honestly, route-level locale is cleaner.

---

## P1 fixes

### Duplicate H1s in blog posts

Blog page already renders:

```tsx
<h1>{metadata.title}</h1>
```

File: `src/app/blog/[slug]/page.tsx:49-51`

But each blog MDX also starts with the same `# Title`.

Example:

```mdx
# How We Indexed Over 300,000 Scientific Papers with a Serverless AI Pipeline
```

So the final page likely has two H1s with the same text.

Fix: remove the `# Title` from MDX bodies and let the page template own the H1. Start MDX content at `##`.

---

### Primary navigation should use links, not buttons

Navbar uses buttons with `router.push`.

File: `src/components/layout/Navbar.tsx:126-148`

For core navigation, use `Link href="/portfolio"` etc. This improves semantics, accessibility, open-in-new-tab behavior, and crawlability.

```tsx
<Link href="/portfolio" onClick={() => setNavDirection(-1)}>
  {t.nav.portfolio}
</Link>
```

You can still animate the underline.

---

### Add Open Graph image / Twitter image

I found no `opengraph-image.*` or `twitter-image.*`.

Next supports file-based Open Graph and Twitter image conventions. ([Next.js][7])

Add at least:

```txt
src/app/opengraph-image.png
src/app/twitter-image.png
```

Or generate them dynamically later.

For your site, the OG image should probably say:

```txt
Oskar Wichtowski
AI Engineer & Fullstack Developer
LLM integrations · AI apps · automation · ecommerce
```

---

### Add structured data

For homepage, add `ProfilePage` / `Person` JSON-LD. Google has official ProfilePage structured data docs for person/organization profile pages. ([Google for Developers][8])

For blog posts, add `Article` structured data. Google’s Article structured data docs explain that structured data helps classify article pages for Search. ([Google for Developers][9])

A simple blog JSON-LD component:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: metadata.title,
      description: metadata.description,
      datePublished: metadata.date,
      author: {
        "@type": "Person",
        name: "Oskar Wichtowski",
        url: "https://oskarwichtowski.com",
      },
    }),
  }}
/>
```

---

### Stop making homepage fully dynamic just for Last.fm

Current home page:

```tsx
export const dynamic = "force-dynamic";
```

File: `src/app/page.tsx:4`

Then it fetches Last.fm on the server:

```tsx
const nowPlaying = await getLastFmNowPlaying();
```

File: `src/app/page.tsx:7`

Then the client widget immediately fetches again:

```tsx
timeoutId = window.setTimeout(refreshNowPlaying, 0);
```

File: `src/components/landingpage/hero/SpotifyNowPlaying.tsx:86`

This makes the homepage dynamic for a small widget that is not important for SEO.

Better: make the homepage static and let only the widget poll `/api/lastfm/now-playing`.

```tsx
// src/app/page.tsx
import { LandingPage } from "@components/landingpage/LandingPage";

export default function Home() {
  return <LandingPage />;
}
```

Next supports fetch-level caching/revalidation, so when something does need freshness, prefer targeted `next: { revalidate: ... }` instead of making the whole page dynamic. ([Next.js][10])

---

## Performance findings

### Too many Client Components

I counted **26 client files** under `src/`, including layout, navbar, footer, landing, portfolio, blog, GitHub, contact, explore, and not-found.

Client components are not inherently bad, but here they wrap large static sections that could mostly be server-rendered.

Big client-heavy dependencies used broadly:

```txt
framer-motion
lucide-react
react-icons
next-themes
@react-three/fiber
@react-three/rapier
three
```

The Three/Rapier stuff is only for 404, so that is less worrying. The real concern is `framer-motion`, `react-icons`, and large interactive wrappers across main routes.

Run this after dependencies are installed:

```bash
bun next experimental-analyze
```

Next’s bundle analyzer can show route-level client/server modules and import chains. ([Next.js][11])

---

### `TechStackShowcase` imports a lot of icons into the homepage

File: `src/lib/tech-stack.ts:2-73`

You import many icons from `react-icons/si`, `react-icons/gi`, `react-icons/fa`, `react-icons/lu`, plus `lucide-react`.

For a portfolio homepage, this can easily become a large client chunk. Options:

1. Keep only simple text chips on the homepage.
2. Lazy-load icon-heavy tech stack after the hero.
3. Replace brand icons with lightweight inline SVGs only for the few most important technologies.
4. Move static tech-stack rendering to a Server Component and hydrate only the filter/select behavior.

---

### The hidden slider likely hurts INP

`MainSlider` renders a `w-[500vw]` moving container and all sections inside it. That increases DOM size and hydration work. Google’s Core Web Vitals include loading, interactivity, and visual stability; they recommend achieving good Core Web Vitals for Search and UX. ([Google for Developers][12])

Simplest win: render one route at a time.

---

### Image/assets

Good: `CatsModal` uses `next/image`.

File: `src/components/landingpage/hero/CatsModal.tsx:88`

But:

```txt
public/cats.png = 738 KB
src/app/favicon.ico = 59 KB
```

`cats.png` is only a modal image, so it is not urgent, but convert it to WebP/AVIF and keep the PNG only if you need transparency. Next image optimization can serve correctly sized images and modern formats. ([Next.js][13])

Also your `public/_headers` caches `/_next/static/*`, `/assets/*`, `/*.woff2`, and `/favicon.ico`, but not `/cats.png` or the PDF. Add root asset rules:

```txt
/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable

/*.avif
  Cache-Control: public, max-age=31536000, immutable

/*.pdf
  Cache-Control: public, max-age=86400
```

Use immutable only for versioned filenames. For `cats.png`, either rename to `cats.<hash>.webp` or avoid immutable.

---

## Content / metadata copy

Your current metadata is okay:

```ts
title: "Oskar Wichtowski — AI Engineer & Fullstack Developer",
description:
  "Building AI-powered web apps, automation tools, LLM integrations, and fullstack products with a focus on practical, production-minded software.",
```

I’d make it slightly more direct:

```ts
export const metadata: Metadata = {
  title: "Oskar Wichtowski — AI Engineer & Fullstack Developer",
  description:
    "I build AI-powered applications, LLM integrations, ecommerce automations, and full-stack tools — from PoCs to production-ready systems.",
};
```

Google says meta descriptions are not limited to a fixed length, but snippets are truncated as needed and should be short, relevant summaries that make the page sound useful. ([Google for Developers][14])

Also fix this homepage bio grammar:

```ts
"An versatile tech professional...";
```

Should be:

```ts
"A versatile tech professional...";
```

File: `src/locales/dictionary.ts:159`

But I would rewrite it to sound less generic:

```ts
bio:
  "I build practical AI products, LLM-powered workflows, ecommerce integrations, and full-stack tools. I like turning rough ideas into working systems — with clean engineering and strong QA habits.",
```

---

## Recommended order

1. Remove `if (!mounted) return null` from `LandingPage`.
2. Delete/refactor `MainSlider` so each route renders only its own content.
3. Add `generateMetadata` for `/blog/[slug]` and `/portfolio/[slug]`.
4. Add `sitemap.ts`, `robots.ts`, canonical URLs, Open Graph, and Twitter metadata.
5. Fix i18n URLs or at least add `hreflang` pairs.
6. Remove duplicate H1s from MDX blog posts.
7. Convert navbar buttons to real links.
8. Run `bun next experimental-analyze` and check `framer-motion`, `react-icons`, and `tech-stack.ts`.
9. Make Last.fm client-only or revalidated instead of `force-dynamic`.
10. Convert `cats.png` and add better cache headers.

The site has good content and a strong visual direction. The main thing holding it back is that the architecture is treating a mostly-static portfolio like a fully interactive app shell. Keep the animations, but make the core content server-first.

[1]: https://nextjs.org/docs/app/getting-started/server-and-client-components?utm_source=chatgpt.com "Getting Started: Server and Client Components"
[2]: https://developers.google.com/search/docs/appearance/title-link?utm_source=chatgpt.com "Influencing your title links in search results"
[3]: https://nextjs.org/docs/app/api-reference/functions/generate-metadata?utm_source=chatgpt.com "Functions: generateMetadata"
[4]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?utm_source=chatgpt.com "Build and Submit a Sitemap | Google Search Central"
[5]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots?utm_source=chatgpt.com "robots.txt - Metadata Files"
[6]: https://developers.google.com/search/docs/specialty/international/localized-versions?utm_source=chatgpt.com "Localized Versions of your Pages | Google Search Central"
[7]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image?utm_source=chatgpt.com "opengraph-image and twitter-image - Metadata Files"
[8]: https://developers.google.com/search/docs/appearance/structured-data/profile-page?utm_source=chatgpt.com "Profile page ( ProfilePage ) structured data"
[9]: https://developers.google.com/search/docs/appearance/structured-data/article?utm_source=chatgpt.com "Learn About Article Schema Markup | Google Search Central"
[10]: https://nextjs.org/docs/app/guides/caching-without-cache-components?utm_source=chatgpt.com "Caching and Revalidating (Previous Model)"
[11]: https://nextjs.org/docs/app/guides/package-bundling?utm_source=chatgpt.com "Optimizing package bundling"
[12]: https://developers.google.com/search/docs/appearance/core-web-vitals?utm_source=chatgpt.com "Understanding Core Web Vitals and Google search results"
[13]: https://nextjs.org/docs/app/getting-started/images?utm_source=chatgpt.com "Getting Started: Image Optimization"
[14]: https://developers.google.com/search/docs/appearance/snippet?utm_source=chatgpt.com "How to Write Meta Descriptions | Google Search Central"

USER:
i guess we can make so we are renedeing only neighbouring pages to the current one as this was implemented couse as we change pages there is previous page slide to the side animation

CHAT:
Yes — **virtualizing `MainSlider`** is a good middle-ground.

I would not render all 5 pages, but I also would not render only `index - 1 / index / index + 1` blindly, because jumping from `/` to `/contact` could slide through empty space.

Use this rule:

> normally render current + neighbours, but during transition render the range between previous and next route too.

So `/portfolio` renders:

```txt
/github, /portfolio, /articles
```

But jumping `/` → `/contact` temporarily renders:

```txt
/, /github, /portfolio, /articles, /contact
```

Only for the animation.

Here’s a drop-in direction for `MainSlider.tsx`:

```tsx
"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ROUTES } from "@lib/navigation";
import { ProjectMetadata, ArticleMetadata } from "@lib/mdx";
import { LandingPage } from "@components/landingpage/LandingPage";
import GithubPageContent from "@components/github/GithubContet";
import { PortfolioSection } from "@components/portfolio/PortfolioSection";
import { BlogSection } from "@components/blog/BlogSection";
import { ContactSection } from "@components/contact/ContactSection";

interface MainSliderProps {
  projects: ProjectMetadata[];
  articles: ArticleMetadata[];
  activePathname: string;
  children?: React.ReactNode;
}

function getNeighbourIndexes(index: number) {
  return new Set([index - 1, index, index + 1].filter((i) => i >= 0 && i < ROUTES.length));
}

function getRangeIndexes(from: number, to: number) {
  const start = Math.min(from, to);
  const end = Math.max(from, to);

  return new Set(Array.from({ length: end - start + 1 }, (_, i) => start + i));
}

function getTransitionIndexes(previousIndex: number, currentIndex: number) {
  return new Set([
    ...getNeighbourIndexes(currentIndex),
    ...getRangeIndexes(previousIndex, currentIndex),
  ]);
}

export function MainSlider({ projects, articles, activePathname, children }: MainSliderProps) {
  const activeIndex = ROUTES.indexOf(activePathname);
  const index = activeIndex === -1 ? 0 : activeIndex;

  const previousIndexRef = useRef(index);

  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(() =>
    getNeighbourIndexes(index),
  );

  useLayoutEffect(() => {
    const previousIndex = previousIndexRef.current;
    setVisibleIndexes(getTransitionIndexes(previousIndex, index));
  }, [index]);

  const renderSlide = (route: string) => {
    if (route === activePathname && children) {
      return children;
    }

    switch (route) {
      case "/":
        return <LandingPage />;

      case "/github":
        return <GithubPageContent initialData={null} />;

      case "/portfolio":
        return <PortfolioSection projects={projects} />;

      case "/articles":
        return <BlogSection articles={articles} />;

      case "/contact":
        return <ContactSection />;

      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-[calc(100vh-5rem)] mt-16 md:mt-0 md:h-screen overflow-hidden relative bg-background">
      <motion.div
        initial={false}
        animate={{ x: `-${index * 100}vw` }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
        className="flex h-full"
        style={{ width: `${ROUTES.length * 100}vw` }}
        onAnimationComplete={() => {
          previousIndexRef.current = index;
          setVisibleIndexes(getNeighbourIndexes(index));
        }}
      >
        {ROUTES.map((route, slideIndex) => (
          <div key={route} className="w-screen h-full shrink-0">
            {visibleIndexes.has(slideIndex) ? renderSlide(route) : null}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
```

This keeps your existing slider concept, but avoids the worst part: mounting GitHub + portfolio + articles + contact on the homepage immediately.

One more improvement: for `/github`, your active route passes real `initialData` through `children`, but neighbour preview uses:

```tsx
<GithubPageContent initialData={null} />
```

That’s okay. It means GitHub preview may show loading/fallback when it is only a neighbouring slide. Once `/github` becomes the active route, the real page content is used.

I’d still remove the full-page `mounted` gate from `LandingPage`, because even with this slider fix, the homepage currently returns `null` before hydration. That one is separate and still important.
