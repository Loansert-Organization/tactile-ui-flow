
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

export default function PayScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [momoNumber, setMomoNumber] = useState(localStorage.getItem("lifuti-momo") || "");
  const [amount, setAmount] = useState(localStorage.getItem("lifuti-amount") || "");

  function handleGenerateQR() {
    localStorage.setItem("lifuti-momo", momoNumber);
    localStorage.setItem("lifuti-amount", amount);
    navigate(`/qr-preview?momo=${encodeURIComponent(momoNumber)}&amount=${encodeURIComponent(amount)}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 bg-white/80 dark:bg-black/70">
      <div className="w-full max-w-sm p-8 bg-white/60 dark:bg-black/50 rounded-2xl shadow-xl backdrop-blur-2xl">
        <div className="mb-4">
          <label className="block font-semibold text-base mb-2">{t("momo_number")}</label>
          <input
            className="w-full rounded-xl p-3 border focus:ring-2 focus:ring-blue-400"
            type="tel"
            value={momoNumber}
            onChange={e => setMomoNumber(e.target.value)}
            inputMode="tel"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-base mb-2">{t("amount")}</label>
          <input
            className="w-full rounded-xl p-3 border focus:ring-2 focus:ring-blue-400"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            inputMode="numeric"
            min="100"
            required
          />
        </div>
        <button
          className="bg-gradient-to-r from-[#396afc] to-[#2948ff] text-white py-3 px-8 rounded-2xl w-full font-bold text-lg shadow-md transition-all"
          onClick={handleGenerateQR}
        >
          {t("generate_qr")}
        </button>
      </div>
    </div>
  );
}
