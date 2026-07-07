"use client";

import React, { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  label: string;
}

export function TableOfContents({ label }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = [];

    const titleElement = document.querySelector("main h1");
    if (titleElement) {
      if (titleElement instanceof HTMLElement) {
        titleElement.style.scrollMarginTop = "100px";
      }
      if (!titleElement.id) {
        const text = titleElement.textContent || "";
        const slug = text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_]+/g, "-");
        titleElement.id = slug || "article-title";
      }
      items.push({
        id: titleElement.id,
        text: titleElement.textContent || "",
        level: 1,
      });
    }

    headingElements.forEach((el, index) => {
      const text = el.textContent || "";
      if (el instanceof HTMLElement) {
        el.style.scrollMarginTop = "100px";
      }
      if (!el.id) {
        const slug = text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_]+/g, "-");
        const finalSlug = slug ? `${slug}-${index}` : `heading-${index}`;
        el.id = finalSlug;
      }
      items.push({
        id: el.id,
        text,
        level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
      });
    });

    // Defer state update to avoid synchronous cascading render warning in useEffect
    const timeoutId = setTimeout(() => {
      setHeadings(items);
    }, 0);

    // Track active item with IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -40% 0px", // checks when heading is near the upper middle portion of the page
      threshold: [0, 1.0],
    };

    const activeElements = new Set<HTMLElement>();

    const trackedElements: HTMLElement[] = [];
    if (titleElement instanceof HTMLElement) {
      trackedElements.push(titleElement);
    }
    headingElements.forEach((node) => {
      if (node instanceof HTMLElement) {
        trackedElements.push(node);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          activeElements.add(el);
        } else {
          activeElements.delete(el);
        }
      });

      // Find the element with the highest position in activeElements
      let currentActive: HTMLElement | null = null;
      let minTop = Infinity;

      activeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < minTop) {
          minTop = rect.top;
          currentActive = el;
        }
      });

      if (currentActive) {
        const activeItem = currentActive as HTMLElement;
        setActiveId(activeItem.id);
      } else if (activeElements.size === 0) {
        // Fallback: If no headings are currently intersecting (e.g. user scrolled past everything, or between headings)
        // figure out which heading is closest above the viewport
        let closestAbove: HTMLElement | null = null;
        let maxTop = -Infinity;

        trackedElements.forEach((node) => {
          const el = node as HTMLElement;
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.top > maxTop) {
            maxTop = rect.top;
            closestAbove = el;
          }
        });

        if (closestAbove) {
          const activeItem = closestAbove as HTMLElement;
          setActiveId(activeItem.id);
        }
      }
    }, observerOptions);

    trackedElements.forEach((el) => {
      if (el.id) observer.observe(el);
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 w-full">
      <nav className="space-y-4 py-2">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <ul className="space-y-3.5 text-sm font-mono border-l border-border/40 pl-0.5">
          {headings.map((item) => (
            <li
              key={item.id}
              className="relative"
              style={{ paddingLeft: item.level === 3 ? "1.25rem" : "0.75rem" }}
            >
              {/* Active vertical bar marker */}
              {activeId === item.id && (
                <div className="absolute left-0 top-0.5 bottom-0.5 w-[2px] bg-primary rounded-full" />
              )}
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    setActiveId(item.id);
                    window.history.pushState(null, "", `#${item.id}`);
                  }
                }}
                className={`block transition-colors duration-200 hover:text-primary leading-snug text-xs ${
                  activeId === item.id
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground font-semibold"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
