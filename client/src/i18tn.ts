import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import config from "@/config";
const { LOAD_PATH_i18 } = config;

const detectorOptions = {
  lookupLocalStorage: "i18nextLng",
  order: ["queryString", "cookie", "localStorage"],
  caches: ["cookie", "localStorage"],
};

i18n
  .use(new LanguageDetector(null, detectorOptions))
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    detection: detectorOptions,
    backend: {
      loadPath: LOAD_PATH_i18,
    },
    ns: ["general", "about", "quizEditor", "homepage", "questions","slides"],
    defaultNS: "translation",
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
