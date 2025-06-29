-- Quick fix migration for Easy MoMo tables

-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users 
        ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));
    END IF;
END $$;

-- Create momo_qr_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.momo_qr_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT NOT NULL,
    phone TEXT NOT NULL,
    amount INTEGER NOT NULL,
    qr_data TEXT,
    ussd_string TEXT,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create momo_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.momo_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT,
    phone TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create momo_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.momo_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB,
    session_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.momo_qr_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.momo_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.momo_events ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies (allow all for now)
CREATE POLICY "Allow all for momo_qr_history" ON public.momo_qr_history
    FOR ALL USING (true);

CREATE POLICY "Allow all for momo_transactions" ON public.momo_transactions
    FOR ALL USING (true);

CREATE POLICY "Allow all for momo_events" ON public.momo_events
    FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON public.momo_qr_history TO authenticated, anon;
GRANT ALL ON public.momo_transactions TO authenticated, anon;
GRANT ALL ON public.momo_events TO authenticated, anon;
