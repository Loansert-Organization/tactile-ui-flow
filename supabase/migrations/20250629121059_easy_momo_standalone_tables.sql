-- Easy-Momo standalone tables migration
-- Creates additional tables needed for easy-momo feature that are separate from main IKANISA schema

-- Payment requests table for easy-momo
CREATE TABLE IF NOT EXISTS public.easy_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount INTEGER NOT NULL CHECK (amount > 0),
  phone_number TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'completed', 'failed')),
  requester_id TEXT,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table for easy-momo (different from main app transactions)
CREATE TABLE IF NOT EXISTS public.easy_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount INTEGER NOT NULL,
  phone_number TEXT NOT NULL,
  transaction_type TEXT DEFAULT 'payment',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  ussd_string TEXT,
  reference_code TEXT,
  provider TEXT DEFAULT 'MTN',
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction analytics table
CREATE TABLE IF NOT EXISTS public.easy_transaction_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.easy_transactions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  duration_ms INTEGER,
  success_rate DECIMAL(5,4),
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS public.easy_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,4) NOT NULL,
  metric_unit TEXT DEFAULT 'ms',
  tags JSONB,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session analytics table
CREATE TABLE IF NOT EXISTS public.easy_session_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_path TEXT,
  user_agent TEXT,
  duration_ms INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all easy-momo tables
ALTER TABLE public.easy_payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.easy_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.easy_transaction_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.easy_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.easy_session_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (default deny - allow session-based access)
CREATE POLICY "Session-based access for payment requests" ON public.easy_payment_requests
  FOR ALL USING (
    session_id = current_setting('app.session_id', true) OR
    user_id = auth.uid()
  );

CREATE POLICY "Session-based access for transactions" ON public.easy_transactions
  FOR ALL USING (
    session_id = current_setting('app.session_id', true) OR
    user_id = auth.uid()
  );

CREATE POLICY "Session-based access for transaction analytics" ON public.easy_transaction_analytics
  FOR ALL USING (
    session_id = current_setting('app.session_id', true) OR
    user_id = auth.uid()
  );

CREATE POLICY "Session-based access for performance metrics" ON public.easy_performance_metrics
  FOR ALL USING (
    session_id = current_setting('app.session_id', true) OR
    user_id = auth.uid()
  );

CREATE POLICY "Session-based access for session analytics" ON public.easy_session_analytics
  FOR ALL USING (
    session_id = current_setting('app.session_id', true) OR
    user_id = auth.uid()
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_easy_payment_requests_session_id ON public.easy_payment_requests(session_id);
CREATE INDEX IF NOT EXISTS idx_easy_payment_requests_user_id ON public.easy_payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_easy_payment_requests_status ON public.easy_payment_requests(status);

CREATE INDEX IF NOT EXISTS idx_easy_transactions_session_id ON public.easy_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_easy_transactions_user_id ON public.easy_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_easy_transactions_status ON public.easy_transactions(status);
CREATE INDEX IF NOT EXISTS idx_easy_transactions_phone ON public.easy_transactions(phone_number);

CREATE INDEX IF NOT EXISTS idx_easy_transaction_analytics_transaction_id ON public.easy_transaction_analytics(transaction_id);
CREATE INDEX IF NOT EXISTS idx_easy_transaction_analytics_session_id ON public.easy_transaction_analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_easy_performance_metrics_session_id ON public.easy_performance_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_easy_performance_metrics_name ON public.easy_performance_metrics(metric_name);

CREATE INDEX IF NOT EXISTS idx_easy_session_analytics_session_id ON public.easy_session_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_easy_session_analytics_event_type ON public.easy_session_analytics(event_type);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_payment_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_payment_requests TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_transactions TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_transaction_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_transaction_analytics TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_performance_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_performance_metrics TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_session_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.easy_session_analytics TO anon;
