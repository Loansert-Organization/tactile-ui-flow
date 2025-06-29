
-- Fix Schema Issues Migration
-- This migration addresses specific column and constraint issues

-- ==============================================
-- PART 1: FIX MOMO TABLES (ONLY MISSING COLUMNS)
-- ==============================================

-- Fix momo_qr_history - make sure all columns exist
DO $$
BEGIN
    -- Add missing columns to momo_qr_history if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'momo_qr_history' AND column_name = 'qr_data') THEN
        ALTER TABLE public.momo_qr_history ADD COLUMN qr_data TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'momo_qr_history' AND column_name = 'ussd_string') THEN
        ALTER TABLE public.momo_qr_history ADD COLUMN ussd_string TEXT;
    END IF;
    
    -- Make reference column non-unique since it might conflict
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'momo_qr_history_reference_key') THEN
        ALTER TABLE public.momo_qr_history DROP CONSTRAINT momo_qr_history_reference_key;
    END IF;
END $$;

-- Fix momo_transactions - ensure reference column exists and is nullable
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'momo_transactions' AND column_name = 'reference') THEN
        ALTER TABLE public.momo_transactions ADD COLUMN reference TEXT;
    ELSE
        -- Make reference column nullable if it isn't already
        ALTER TABLE public.momo_transactions ALTER COLUMN reference DROP NOT NULL;
    END IF;
END $$;

-- ==============================================
-- PART 2: ADD MISSING ROLE COLUMN TO USERS
-- ==============================================

-- Update users role column constraint to include 'owner'
DO $$
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check') THEN
        ALTER TABLE public.users DROP CONSTRAINT users_role_check;
    END IF;
    
    -- Add new constraint with owner role
    ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'owner'));
END $$;

-- ==============================================
-- PART 3: FIX BASKETS TABLE COLUMN CONFLICTS
-- ==============================================

-- Rename public column to is_public to avoid keyword conflict
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'baskets' AND column_name = 'public') THEN
        ALTER TABLE public.baskets RENAME COLUMN public TO is_public;
    ELSE
        -- Add is_public column if it doesn't exist
        ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- ==============================================
-- PART 4: ENSURE PROPER INDEXES EXIST
-- ==============================================

-- Only create indexes that don't already exist
CREATE INDEX IF NOT EXISTS idx_momo_qr_history_phone ON public.momo_qr_history(phone);
CREATE INDEX IF NOT EXISTS idx_momo_transactions_phone ON public.momo_transactions(phone);
CREATE INDEX IF NOT EXISTS idx_momo_transactions_amount ON public.momo_transactions(amount);

-- ==============================================
-- PART 5: SIMPLE RLS POLICIES
-- ==============================================

-- Update RLS policies for Easy MoMo tables to allow all access for now
DROP POLICY IF EXISTS "Allow all for momo_qr_history" ON public.momo_qr_history;
CREATE POLICY "Allow all for momo_qr_history" ON public.momo_qr_history
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for momo_transactions" ON public.momo_transactions;
CREATE POLICY "Allow all for momo_transactions" ON public.momo_transactions
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for momo_events" ON public.momo_events;
CREATE POLICY "Allow all for momo_events" ON public.momo_events
    FOR ALL USING (true);

-- Grant permissions for Easy MoMo tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_qr_history TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_transactions TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_events TO authenticated, anon;
