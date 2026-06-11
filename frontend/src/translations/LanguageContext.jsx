import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

function parseTranslations(obj, lang) {
  if (obj && typeof obj === "object" && ("en" in obj || "es" in obj)) {
    return obj[lang] || obj["en"] || "";
  }

  const parsed = {};
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      parsed[key] = parseTranslations(obj[key], lang);
    } else {
      parsed[key] = obj[key];
    }
  }
  return parsed;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) return savedLanguage;
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang && browserLang.startsWith("es")) return "es";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const t = useMemo(() => parseTranslations(translations, language), [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}