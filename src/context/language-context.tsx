
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { pt } from '@/lib/i18n/locales/pt';
import { en } from '@/lib/i18n/locales/en';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
}

const translations = { pt, en };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested keys
const getNestedValue = (obj: Record<string, unknown>, key: string): any => {
  return key.split('.').reduce((o: any, i: string) => {
    if (o && typeof o === 'object' && i in o) {
      return o[i];
    }
    return undefined;
  }, obj);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language | null;
    if (storedLang && (storedLang === 'pt' || storedLang === 'en')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
    let translation = getNestedValue(translations[language], key);

    if (translation === undefined || translation === null) {
      // Fallback to Portuguese if translation is not found
      translation = getNestedValue(translations.pt, key);
    }

    if (translation === undefined || translation === null) {
      console.warn(`Translation for key '${key}' not found.`);
      return key;
    }

    if (typeof translation !== 'string') {
      console.warn(`Translation for key '${key}' is not a string. Returning key.`);
      return key;
    }

    if (options) {
      Object.keys(options).forEach(optKey => {
        translation = (translation as string).replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }

    return translation as string;
  }, [language]);
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
