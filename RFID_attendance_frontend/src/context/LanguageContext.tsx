import { createContext, useContext, useState, ReactNode } from "react";

type LanguageContextType = {
  locale: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  changeLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem("appLang") || "en";
  });

  const changeLanguage = (lang: string) => {
    setLocale(lang);
    localStorage.setItem("appLang", lang);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
