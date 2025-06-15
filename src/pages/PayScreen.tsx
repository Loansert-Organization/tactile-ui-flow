
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useSessionId } from "@/hooks/useSessionId";

export default function PayScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sessionId = useSessionId();
  const [momoNumber, setMomoNumber] = useState(localStorage.getItem("lifuti-momo") || "");
  const [amount, setAmount] = useState(localStorage.getItem("lifuti-amount") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateQR() {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem("lifuti-momo", momoNumber);
      localStorage.setItem("lifuti-amount", amount);

      // Infer method from momoNumber (use Supabase function if available, otherwise default to "number")
      let method: "number" | "code" = "number";
      if (/^[0-9]{4,6}$/.test(momoNumber)) method = "code";

      // Generate basic USSD string (production: use Supabase func if needed)
      const ussd = `*182*1*1*${momoNumber}*${amount}#`;

      // Insert new payment
      const { error: insertError } = await supabase.from("payments").insert({
        phone_number: momoNumber,
        amount: parseInt(amount, 10),
        session_id: sessionId,
        ussd_string: ussd,
        method,
        status: "pending",
      });
      if (insertError) {
        setError("Failed to create payment record. Please try again.");
        setLoading(false);
        return;
      }
      navigate(`/qr-preview?momo=${encodeURIComponent(momoNumber)}&amount=${encodeURIComponent(amount)}`);
    } catch (e) {
      setError("Error creating payment. Please try again.");
    }
    setLoading(false);
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
            type="text"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            min="100"
            required
          />
        </div>
        {error && <div className="text-red-600 font-medium mb-2">{error}</div>}
        <button
          className="bg-gradient-to-r from-[#396afc] to-[#2948ff] text-white py-3 px-8 rounded-2xl w-full font-bold text-lg shadow-md transition-all"
          onClick={handleGenerateQR}
          disabled={loading}
        >
          {loading ? "Processing..." : t("generate_qr")}
        </button>
      </div>
    </div>
  );
}
