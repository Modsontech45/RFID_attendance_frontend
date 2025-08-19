import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageContextType = {
  locale: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  changeLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("appLang");
    if (storedLang) setLocale(storedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    localStorage.setItem("appLang", lang);
    setLocale(lang);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
