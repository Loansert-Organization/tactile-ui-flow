
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionId } from "@/hooks/useSessionId";

export default function QRPreviewScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = useSessionId();
  const params = new URLSearchParams(location.search);
  const momo = params.get("momo") || "";
  const amount = params.get("amount") || "";

  // Production: log QR generation to Supabase
  useEffect(() => {
    async function logQR() {
      if (!momo || !amount) return;
      const ussd_string = `*182*1*1*${momo}*${amount}#`;
      await supabase.from("qr_history").insert({
        phone_number: momo,
        amount: +amount,
        session_id: sessionId,
        type: "generate",
        ussd_string,
      });
      // ignore error for user experience
    }
    logQR();
  }, [momo, amount, sessionId]);

  // USSD format: *182*1*1*momo*amount#
  const qrData = `*182*1*1*${momo}*${amount}#`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-bg px-4">
      <div className="p-6 bg-white/70 dark:bg-black/70 rounded-2xl shadow-xl flex flex-col gap-4 items-center backdrop-blur-2xl">
        <QRCodeSVG value={qrData} size={256} bgColor="transparent" fgColor="#2948ff" />
        <div className="text-lg font-bold mt-4">{`Pay ${amount} to ${momo}`}</div>
        <button
          onClick={() => navigate("/pay")}
          className="mt-2 px-6 py-2 rounded-xl border border-gray-400 hover:bg-gray-100 text-gray-700 font-semibold"
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}
