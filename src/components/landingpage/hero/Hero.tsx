"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@context/LanguageContext";
import { setNavDirection } from "@lib/navigation";
import { HeroTitle } from "./HeroTitle";
import { HeroBio } from "./HeroBio";
import { HeroActions } from "./HeroActions";

export function Hero() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleGoToProjects = () => {
    setNavDirection(1);
    router.push("/portfolio");
  };

  const handleGoToContact = () => {
    setNavDirection(1);
    router.push("/contact");
  };

  return (
    <div className="space-y-6 flex flex-col items-center text-center hero-intro w-full animate-fade-in">
      {/* Title Heading */}
      <HeroTitle role={t.hero.role} />

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
  );
}
