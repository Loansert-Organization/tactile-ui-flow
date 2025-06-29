
-- Corrected Schema Fixes Migration
-- This migration fixes the column reference issue

-- ==============================================
-- PART 1: ADD MISSING COLUMNS TO EXISTING TABLES
-- ==============================================

-- Add missing role column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add check constraint for role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check') THEN
        ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'owner'));
    END IF;
END $$;

-- Add missing scanned_at column to momo_transactions if it doesn't exist
ALTER TABLE public.momo_transactions ADD COLUMN IF NOT EXISTS scanned_at TIMESTAMP WITH TIME ZONE;

-- Add missing columns to momo_qr_history if they don't exist
ALTER TABLE public.momo_qr_history ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ==============================================
-- PART 2: CREATE NEW TABLES THAT DON'T EXIST
-- ==============================================

-- Create messages table if it doesn't exist (for basket chat)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    basket_id UUID NOT NULL REFERENCES public.baskets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    setting_id TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    PRIMARY KEY (user_id, setting_id)
);

-- ==============================================
-- PART 3: CREATE SAFE INDEXES
-- ==============================================

-- Create indexes only on columns that definitely exist
CREATE INDEX IF NOT EXISTS idx_momo_qr_history_session_id ON public.momo_qr_history(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_qr_history_reference ON public.momo_qr_history(reference);
CREATE INDEX IF NOT EXISTS idx_momo_qr_history_phone ON public.momo_qr_history(phone);

CREATE INDEX IF NOT EXISTS idx_momo_transactions_session_id ON public.momo_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_transactions_phone ON public.momo_transactions(phone);
CREATE INDEX IF NOT EXISTS idx_momo_transactions_amount ON public.momo_transactions(amount);

CREATE INDEX IF NOT EXISTS idx_momo_events_session_id ON public.momo_events(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_events_event_type ON public.momo_events(event_type);

-- Messages indexes (only if table was created)
CREATE INDEX IF NOT EXISTS idx_messages_basket_id ON public.messages(basket_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- ==============================================
-- PART 4: ENABLE RLS ON ALL TABLES
-- ==============================================

ALTER TABLE public.momo_qr_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.momo_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.momo_events ENABLE ROW LEVEL SECURITY;

-- Enable RLS on new tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification_preferences') THEN
        ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ==============================================
-- PART 5: CREATE SIMPLE RLS POLICIES (FIXED)
-- ==============================================

-- Simple public access policies for Easy MoMo tables
DROP POLICY IF EXISTS "Allow all for momo_qr_history" ON public.momo_qr_history;
CREATE POLICY "Allow all for momo_qr_history" ON public.momo_qr_history
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for momo_transactions" ON public.momo_transactions;
CREATE POLICY "Allow all for momo_transactions" ON public.momo_transactions
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for momo_events" ON public.momo_events;
CREATE POLICY "Allow all for momo_events" ON public.momo_events
    FOR ALL USING (true);

-- Messages policies (only if table exists) - CORRECTED to use only is_private column
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        DROP POLICY IF EXISTS "Users can read messages from accessible baskets" ON public.messages;
        CREATE POLICY "Users can read messages from accessible baskets" ON public.messages
            FOR SELECT USING (
                -- Public baskets: anyone can read (only check is_private)
                EXISTS (
                    SELECT 1 FROM public.baskets 
                    WHERE baskets.id = messages.basket_id 
                    AND baskets.is_private = false
                )
                OR
                -- Private baskets: only members can read
                EXISTS (
                    SELECT 1 FROM public.basket_members 
                    WHERE basket_members.basket_id = messages.basket_id 
                    AND basket_members.user_id = auth.uid()
                )
            );

        DROP POLICY IF EXISTS "Users can send messages to accessible baskets" ON public.messages;
        CREATE POLICY "Users can send messages to accessible baskets" ON public.messages
            FOR INSERT WITH CHECK (
                auth.uid() = user_id
                AND (
                    -- Public baskets: anyone can send messages
                    EXISTS (
                        SELECT 1 FROM public.baskets 
                        WHERE baskets.id = messages.basket_id 
                        AND baskets.is_private = false
                    )
                    OR
                    -- Private baskets: only members can send messages
                    EXISTS (
                        SELECT 1 FROM public.basket_members 
                        WHERE basket_members.basket_id = messages.basket_id 
                        AND basket_members.user_id = auth.uid()
                    )
                )
            );
    END IF;
END $$;

-- Notification preferences policies (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification_preferences') THEN
        DROP POLICY IF EXISTS "Users can manage their own notification preferences" ON public.notification_preferences;
        CREATE POLICY "Users can manage their own notification preferences" ON public.notification_preferences
            FOR ALL USING (user_id = auth.uid())
            WITH CHECK (user_id = auth.uid());
    END IF;
END $$;

-- ==============================================
-- PART 6: GRANT PERMISSIONS
-- ==============================================

-- Grant permissions for Easy MoMo tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_qr_history TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_transactions TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_events TO authenticated, anon;

-- Grant permissions for new tables (if they exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated, anon;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification_preferences') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_preferences TO authenticated;
    END IF;
END $$;

-- ==============================================
-- PART 7: CREATE HELPER FUNCTIONS AND TRIGGERS
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for momo_qr_history updated_at (only if column exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'momo_qr_history' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_momo_qr_history_updated_at ON public.momo_qr_history;
        CREATE TRIGGER update_momo_qr_history_updated_at
            BEFORE UPDATE ON public.momo_qr_history
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Add trigger for messages updated_at (only if table and column exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'updated_at') THEN
        DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
        CREATE TRIGGER update_messages_updated_at
            BEFORE UPDATE ON public.messages
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
