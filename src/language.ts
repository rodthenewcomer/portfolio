import { createContext, useContext } from "react";

export type Language = "fr" | "en";

export const languagePreference = "portfolio-language";
export const publicSite = "https://moustapha-adebigni.vercel.app";

export const LanguageContext = createContext<Language>("fr");

export function useLanguage() {
  return useContext(LanguageContext);
}

export function readPreference(): Language {
  try {
    return localStorage.getItem(languagePreference) === "en" ? "en" : "fr";
  } catch {
    return "fr";
  }
}

export function savePreference(language: Language) {
  try {
    localStorage.setItem(languagePreference, language);
  } catch {
    // The explicit language remains available in the URL when storage is blocked.
  }
}

export function localizedPath(language: Language, path = "/") {
  return path === "/" ? `/${language}/` : `/${language}${path}`;
}
