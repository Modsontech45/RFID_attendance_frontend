import { useState, useEffect } from 'react';

interface Translations {
  [key: string]: any;
}

export const useTranslation = () => {
  const [translations, setTranslations] = useState<Translations>({});
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('lang') || 'en';
  });
  const [loading, setLoading] = useState(true);

  const getNestedValue = (obj: any, path: string): string => {
    const parts = path.split('.');
    return parts.reduce((acc, part) => {
      return acc && acc[part];
    }, obj) || path; // Return the key if translation not found
  };

  const t = (key: string): any => {
    return getNestedValue(translations, key);
  };

  const changeLanguage = async (lang: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/locales/${lang}.json`);
      const newTranslations = await response.json();

      setTranslations(newTranslations);
      setCurrentLanguage(lang);
      localStorage.setItem('lang', lang);

      // Update floating comments if present
      if (newTranslations.home?.floating_comments) {
        (window as any).floatingComments = newTranslations.home.floating_comments;
      }
    } catch (error) {
      console.error('Error loading language:', error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        changeLanguage('en');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    changeLanguage(currentLanguage);
  }, []);

  return {
    t,
    currentLanguage,
    changeLanguage,
    loading,
    translations
  };
};