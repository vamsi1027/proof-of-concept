import * as translations from "./translations";
import i18n from 'i18next'
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: { translations: translations.en },
  es: { translations: translations.es },
  pt: { translations: translations.pt },
};

i18n.use(LanguageDetector).init({
  resources,
  fallbackLng: "en",
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  react: {
    useSuspense: true
  },
});

export default i18n;
