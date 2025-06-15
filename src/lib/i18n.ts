
import { useEffect, useState } from "react";

export type SupportedLanguage = "rw" | "en" | "fr";
export const defaultLanguage: SupportedLanguage = "en";

const translations = {
  rw: {
    home_banner: "Parking yizewe hamwe na Lifuti",
    find_parking: "Shaka Ahantu Hapakiye",
    pay_with_momo: "Kwishura ukoresheje MoMo",
    view_history: "Reba Amateka",
    momo_number: "Nomero ya MoMo",
    amount: "Amafaranga (RWF)",
    generate_qr: "Kora QR Code",
    back: "Subira inyuma",
  },
  fr: {
    home_banner: "Garez plus malin avec Lifuti",
    find_parking: "Trouver un parking",
    pay_with_momo: "Payer avec MoMo",
    view_history: "Voir l'historique",
    momo_number: "Numéro MoMo",
    amount: "Montant (RWF)",
    generate_qr: "Générer le QR code",
    back: "Retour",
  },
  en: {
    home_banner: "Park Smarter with Lifuti",
    find_parking: "Find Parking",
    pay_with_momo: "Pay with MoMo",
    view_history: "View History",
    momo_number: "MoMo Number",
    amount: "Amount (RWF)",
    generate_qr: "Generate QR Code",
    back: "Back",
  },
};

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem("lifuti-lang") as SupportedLanguage) || defaultLanguage;
  });

  function t(key: keyof typeof translations["en"]) {
    return translations[lang][key] || translations[defaultLanguage][key];
  }

  function changeLang(newLang: SupportedLanguage) {
    setLang(newLang);
    localStorage.setItem("lifuti-lang", newLang);
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return { t, lang, changeLang, translations };
}
