"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  type?: string;
  rel?: string;
}

const socials: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/Wichtowski",
    icon: FaGithub,
    color: "hover:text-primary hover:border-primary/40",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/oskar-wichtowski/",
    icon: FaLinkedin,
    color: "hover:text-blue-500 hover:border-blue-500/40",
  },
  {
    name: "Email",
    url: "mailto:oskar.wichtowski3@gmail.com",
    icon: Mail,
    color: "hover:text-green-500 hover:border-green-500/40",
  },
  {
    name: "RSS",
    url: "/rss.xml",
    icon: FaBarsStaggered,
    color: "hover:text-orange-500 hover:border-orange-500/40",
    type: "application/rss+xml",
    rel: "alternate",
  },
];

export function Footer() {
  const pathname = usePathname();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  useEffect(() => {
    const syncNotFoundState = () => {
      setIsNotFoundPage(document.body.classList.contains("not-found-page"));
    };

    syncNotFoundState();

    const observer = new MutationObserver(syncNotFoundState);
    observer.observe(document.body, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  if (pathname === "/contact") return null;
  if (isNotFoundPage) return null;

  return (
    <footer className="w-full border-t border-border/30 bg-background/80 pt-4 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <span className="text-xs font-mono text-muted-foreground">
          &copy; {new Date().getFullYear()} Oskar Wichtowski. All rights reserved.
        </span>
        <div className="flex items-center gap-4">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel={s.rel ?? "noopener noreferrer"}
                title={s.name}
                type={s.type ?? undefined}
                className={`p-3 rounded-xl border border-border/40 bg-background text-muted-foreground transition-all duration-300 ${s.color}`}
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
