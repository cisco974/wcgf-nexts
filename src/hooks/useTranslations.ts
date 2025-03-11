// src/hooks/useTranslations.ts
import { useRouter } from "next/router";

export function useTranslations() {
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;

  // Fonction pour changer de langue
  const changeLocale = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  // Liste des langues disponibles avec leurs noms localisés
  const availableLocales = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
  ];

  return {
    currentLocale: locale,
    defaultLocale,
    availableLocales,
    locales,
    changeLocale,
  };
}
