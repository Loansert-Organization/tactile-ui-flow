
import React, { useEffect, useState } from "react";
import { useSessionId } from "@/hooks/useSessionId";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";

// Match PaymentRecord fields to actual 'payments' table
interface PaymentRecord {
  id: string;
  phone_number: string;
  amount: number;
  status: string | null;
  created_at: string | null;
}

export default function HistoryScreen() {
  const sessionId = useSessionId();
  const { t } = useTranslation();
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const { data, error } = await supabase
        .from("payments")
        .select("id, phone_number, amount, status, created_at")
        .eq("session_id", sessionId);
      if (data) setHistory(data as PaymentRecord[]);
      setLoading(false);
    }
    fetchHistory();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-white/60 dark:bg-black/70">
      <h2 className="text-2xl font-bold mb-6">{t("view_history")}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500">No payments yet.</div>
      ) : (
        <ul className="w-full max-w-md">
          {history.map((item) => (
            <li key={item.id} className="mb-4 px-4 py-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 shadow flex flex-col gap-2">
              <div className="font-semibold">{item.phone_number} – {item.amount} RWF</div>
              <div className="text-xs text-gray-600">{item.created_at}</div>
              <div className="text-xs font-bold">{`Status: ${item.status}`}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
