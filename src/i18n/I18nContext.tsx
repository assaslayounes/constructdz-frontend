import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "./translations";

const LANGUAGE_KEY = "constructdz_language";

type I18nContextValue = {
  language: Language;
  direction: "rtl" | "ltr";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return stored === "en" || stored === "ar" ? stored : "ar";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const direction = language === "ar" ? "rtl" : "ltr";

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.documentElement.dataset.language = language;
  }, [direction, language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    direction,
    setLanguage,
    toggleLanguage: () => setLanguage(language === "ar" ? "en" : "ar"),
    t: (key) => translations[language][key] ?? translations.ar[key]
  }), [direction, language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
