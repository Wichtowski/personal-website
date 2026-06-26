"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, TranslationDict, dictionaries } from "@/locales/dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isEnglish: boolean;
  isPolish: boolean;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load saved language or default to browser language
    const savedLang = localStorage.getItem("preferred-language") as Language;
    if (savedLang === "en" || savedLang === "pl") {
      setTimeout(() => setLanguageState(savedLang), 0);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "pl") {
        setTimeout(() => setLanguageState("pl"), 0);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred-language", lang);
  };

  const toggleLanguage = () => {
    setLanguageState((current) => {
      const next = current === "en" ? "pl" : "en";
      localStorage.setItem("preferred-language", next);
      return next;
    });
  };

  const t = dictionaries[language];
  const isEnglish = language === "en";
  const isPolish = language === "pl";

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, isEnglish, isPolish, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
