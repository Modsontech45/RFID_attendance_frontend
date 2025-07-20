import { useLanguage } from "../context/LanguageProvider";
import { useIntl } from "../context/IntlContext";
import { FormattedMessage } from "react-intl";

const LanguageSwitcher = () => {
  const { locale, setLocale, availableLocales } = useIntl();

  const currentLocale = availableLocales.find((l) => l.code === locale);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e?.target.value);
    setLocale(e.target.value as "en" | "fr");
  };
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="language-select" className="text-sm text-white">
        {/* <FormattedMessage id="home.languageLabel" defaultMessage="Select Language" /> */}
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={handleLanguageChange}
        className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableLocales.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-gray-900">
            {lang.name} {lang.flag}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
