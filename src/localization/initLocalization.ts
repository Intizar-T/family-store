import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import russian from "./ru.json";
import english from "./en.json";
import charjew from "./charjew.json";

export type Languages = "en" | "ru" | "charjew";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: english,
    },
    charjew: {
      translation: charjew,
    },
    ru: {
      translation: russian,
    },
  },
  lng: "charjew",
  fallbackLng: "en",
});

export const changeLanguage = (lng: Languages) => {
  i18n.changeLanguage(lng);
};
