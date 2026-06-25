import type { Language } from "@/locales/dictionary";

const LANGUAGE_TO_LOCALE: Record<Language, string> = {
  en: "en-US",
  pl: "pl-PL",
};

export function getLocaleForLanguage(language: Language) {
  return LANGUAGE_TO_LOCALE[language];
}

export function formatDate(
  value: string | number | Date,
  language: Language,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(getLocaleForLanguage(language), options).format(new Date(value));
}
