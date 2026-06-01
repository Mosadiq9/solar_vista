'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries } from '../i18n/dict';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Check local storage for language preference
    const savedLang = localStorage.getItem('app_language');
    if (savedLang && dictionaries[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (dictionaries[newLang]) {
      setLang(newLang);
      localStorage.setItem('app_language', newLang);
      
      // Update HTML lang attribute for accessibility and SEO
      document.documentElement.lang = newLang;
    }
  };

  const t = (key) => {
    const dict = dictionaries[lang] || dictionaries['en'];
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
