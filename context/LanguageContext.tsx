import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UI_TRANSLATIONS, EXCHANGE_RATE } from '../constants';

type Language = 'en' | 'ar';
type Currency = 'USD' | 'AED';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  currency: Currency;
  toggleCurrency: () => void;
  t: (key: keyof typeof UI_TRANSLATIONS.en) => string;
  dir: 'ltr' | 'rtl';
  formatPrice: (amountInUsd: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    // Set text direction based on language
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'AED' : 'USD');
  };

  const t = (key: keyof typeof UI_TRANSLATIONS.en) => {
    return UI_TRANSLATIONS[language][key] || UI_TRANSLATIONS['en'][key];
  };

  const formatPrice = (amountInUsd: number) => {
    if (currency === 'USD') {
      return `$${amountInUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else {
      const amountInAed = amountInUsd * EXCHANGE_RATE;
      return `AED ${Math.round(amountInAed).toLocaleString()}`;
    }
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, currency, toggleCurrency, t, dir, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};