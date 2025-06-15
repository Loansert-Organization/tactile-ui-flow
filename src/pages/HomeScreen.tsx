
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MapPin, Qr, Clock } from "lucide-react";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { t, changeLang, lang } = useTranslation();

  const buttonStyle = "rounded-2xl w-full py-4 my-2 text-lg font-bold text-white shadow-lg transition-all duration-300";
  const gradients = {
    "find": "bg-gradient-to-r from-[#396afc] to-[#2948ff]",
    "pay": "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b]",
    "history": "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col gap-8 items-center justify-center px-4 py-10",
        "bg-gradient-to-br from-[#396afc]/30 via-white/70 to-[#ff416c]/30 animate-background-blur"
      )}
    >
      <div className="w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-6 drop-shadow">
          {t("home_banner")}
        </h1>
        <button
          className={cn(buttonStyle, gradients.find)}
          onClick={() => navigate("/map")}
        >
          <MapPin className="inline-block mr-2" /> {t("find_parking")}
        </button>
        <button
          className={cn(buttonStyle, gradients.pay)}
          onClick={() => navigate("/pay")}
        >
          <Qr className="inline-block mr-2" /> {t("pay_with_momo")}
        </button>
        <button
          className={cn(buttonStyle, gradients.history)}
          onClick={() => navigate("/history")}
        >
          <Clock className="inline-block mr-2" /> {t("view_history")}
        </button>
        <div className="flex gap-2 justify-center mt-8">
          <button onClick={() => changeLang("rw")} className={lang === "rw" ? "underline" : ""}>Kinyarwanda</button>
          <button onClick={() => changeLang("en")} className={lang === "en" ? "underline" : ""}>English</button>
          <button onClick={() => changeLang("fr")} className={lang === "fr" ? "underline" : ""}>Français</button>
        </div>
      </div>
    </div>
  );
}
