"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { setNavDirection } from "@/lib/navigation";
import { HeroTitle } from "./HeroTitle";
import { HeroBio } from "./HeroBio";
import { HeroActions } from "./HeroActions";

export function Hero() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const handleGoToProjects = () => {
    setNavDirection(1);
    router.push("/portfolio");
  };

  const handleGoToContact = () => {
    setNavDirection(1);
    router.push("/contact");
  };

  if (!mounted) return null;

  return (
    <section
      id="home"
      className="w-screen h-screen overflow-y-auto flex items-center justify-center relative overflow-hidden pt-32 pb-20"
    >
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] -z-10" />

      <div className="max-w-4xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center space-y-8">
        {/* Hero Intro */}
        <div className="space-y-6 flex flex-col items-center text-center hero-intro">
          {/* Title Heading */}
          <HeroTitle greeting={t.hero.greeting} role={t.hero.role} />

          {/* Biography Paragraph */}
          <HeroBio bio={t.hero.bio} />

          {/* Action CTAs */}
          <HeroActions
            ctaPrimary={t.hero.ctaPrimary}
            ctaSecondary={t.hero.ctaSecondary}
            onPrimaryClick={handleGoToProjects}
            onSecondaryClick={handleGoToContact}
          />
        </div>
      </div>
    </section>
  );
}
