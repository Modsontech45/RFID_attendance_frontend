import React, { createContext, useContext, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import 'flag-icon-css/css/flag-icons.min.css'; // Import flag icons CSS
// Import locale messages
import enMessages from "../locales/en.json";
import frMessages from "../locales/fr.json";

// Flatten messages object structure
const flattenMessages = (
  nestedMessages: Record<string, string | Record<string, unknown>>,
  prefix = ""
): Record<string, string> => {
  return Object.keys(nestedMessages).reduce(
    (acc: Record<string, string>, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        acc[prefixedKey] = value;
      } else if (typeof value === "object" && value !== null) {
        Object.assign(
          acc,
          flattenMessages(
            value as Record<string, string | Record<string, unknown>>,
            prefixedKey
          )
        );
      }

      return acc;
    },
    {}
  );
};

const messages = {
  en: flattenMessages(enMessages),
  fr: flattenMessages(frMessages),
};

export type Locale = keyof typeof messages;

interface IntlContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  availableLocales: { code: Locale; name: string; flag: string }[];
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

export const useIntl = () => {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error("useIntl must be used within an IntlContextProvider");
  }
  return context;
};

interface IntlContextProviderProps {
  children: React.ReactNode;
}

export const IntlContextProvider: React.FC<IntlContextProviderProps> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Get saved locale from localStorage or default to English
    const savedLocale = localStorage.getItem("locale") as Locale;
    return savedLocale && messages[savedLocale] ? savedLocale : "en";
  });

const availableLocales = [
  { code: "en" as Locale, name: "English", flag: "🇬🇧" },
  { code: "fr" as Locale, name: "Français", flag: "🇫🇷" },
];


  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  useEffect(() => {
    // Update document language attribute
    document.documentElement.lang = locale;
  }, [locale]);

  const contextValue: IntlContextType = {
    locale,
    setLocale,
    availableLocales,
  };

  return (
    <IntlContext.Provider value={contextValue}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale="en"
        onError={(err) => {
          console.error(err)
          // Silently ignore missing translation errors in production
        }}
      >
        {children}
      </IntlProvider>
    </IntlContext.Provider>
  );
};
