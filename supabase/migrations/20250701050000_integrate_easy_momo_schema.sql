-- Integration of Easy-Momo database schema into main IKANISA database
-- This migration adds all easy-momo tables, functions, and policies (conflict-free)

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for easy-momo functionality (safe creation)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('number', 'code');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('pending', 'sent', 'confirmed');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'qr_type') THEN
        CREATE TYPE qr_type AS ENUM ('scan', 'generate');
    END IF;
END $$;

-- Create easy-momo payments table (safe creation)
CREATE TABLE IF NOT EXISTS public.momo_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  momo_code TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0),
  method payment_method NOT NULL,
  ussd_string TEXT NOT NULL,
  status payment_status DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create easy-momo QR history table (safe creation)
CREATE TABLE IF NOT EXISTS public.momo_qr_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  type qr_type NOT NULL,
  ussd_string TEXT NOT NULL,
  qr_image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create easy-momo shared links table (safe creation)
CREATE TABLE IF NOT EXISTS public.momo_shared_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  link_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create easy-momo events table for analytics (safe creation)
CREATE TABLE IF NOT EXISTS public.momo_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create easy-momo transactions table for QR scan logging (safe creation)
CREATE TABLE IF NOT EXISTS public.momo_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scanned_code TEXT NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    launched_ussd BOOLEAN DEFAULT false,
    payment_status TEXT DEFAULT 'scanned',
    payer_number TEXT,
    session_id TEXT DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security on all easy-momo tables (safe)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_payments') THEN
        ALTER TABLE public.momo_payments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_qr_history') THEN
        ALTER TABLE public.momo_qr_history ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_shared_links') THEN
        ALTER TABLE public.momo_shared_links ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_events') THEN
        ALTER TABLE public.momo_events ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_transactions') THEN
        ALTER TABLE public.momo_transactions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies for easy-momo tables (safe creation with IF NOT EXISTS pattern)

-- Momo Payments policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'momo_payments' AND policyname = 'Users can access their own momo payments') THEN
        CREATE POLICY "Users can access their own momo payments" ON public.momo_payments
          FOR ALL USING (
            session_id = current_setting('app.session_id', true) OR
            user_id = auth.uid()
          );
    END IF;
END $$;

-- Momo QR History policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'momo_qr_history' AND policyname = 'Users can access their own momo QR history') THEN
        CREATE POLICY "Users can access their own momo QR history" ON public.momo_qr_history
          FOR ALL USING (
            session_id = current_setting('app.session_id', true) OR
            user_id = auth.uid()
          );
    END IF;
END $$;

-- Momo Shared Links policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'momo_shared_links' AND policyname = 'Users can access their own momo shared links') THEN
        CREATE POLICY "Users can access their own momo shared links" ON public.momo_shared_links
          FOR ALL USING (
            session_id = current_setting('app.session_id', true) OR
            user_id = auth.uid()
          );
    END IF;
END $$;

-- Public access for non-expired shared links
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'momo_shared_links' AND policyname = 'Public can view non-expired momo shared links') THEN
        CREATE POLICY "Public can view non-expired momo shared links" ON public.momo_shared_links
          FOR SELECT USING (expires_at > NOW());
    END IF;
END $$;

-- Momo Events policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'momo_events' AND policyname = 'Users can access their own momo events') THEN
        CREATE POLICY "Users can access their own momo events" ON public.momo_events
          FOR ALL USING (
            session_id = current_setting('app.session_id', true) OR
            user_id = auth.uid()
          );
    END IF;
END $$;

-- Momo Transactions policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'momo_transactions' AND policyname = 'Users can access their own momo transactions') THEN
        CREATE POLICY "Users can access their own momo transactions" ON public.momo_transactions
          FOR ALL USING (
            session_id = current_setting('app.session_id', true) OR
            user_id = auth.uid()
          );
    END IF;
END $$;

-- Allow anonymous users to insert/update transaction records
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'momo_transactions' AND policyname = 'Allow anonymous momo transaction operations') THEN
        CREATE POLICY "Allow anonymous momo transaction operations" ON public.momo_transactions
            FOR ALL USING (true);
    END IF;
END $$;

-- Create indexes for performance (safe creation)
CREATE INDEX IF NOT EXISTS idx_momo_payments_session_id ON public.momo_payments(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_payments_user_id ON public.momo_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_momo_qr_history_session_id ON public.momo_qr_history(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_qr_history_user_id ON public.momo_qr_history(user_id);
CREATE INDEX IF NOT EXISTS idx_momo_shared_links_session_id ON public.momo_shared_links(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_shared_links_token ON public.momo_shared_links(link_token);
CREATE INDEX IF NOT EXISTS idx_momo_shared_links_user_id ON public.momo_shared_links(user_id);
CREATE INDEX IF NOT EXISTS idx_momo_events_session_id ON public.momo_events(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_events_user_id ON public.momo_events(user_id);
CREATE INDEX IF NOT EXISTS idx_momo_transactions_session_id ON public.momo_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_momo_transactions_scanned_at ON public.momo_transactions(scanned_at DESC);

-- Create storage bucket for easy-momo QR codes (safe creation)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'momo-qr-codes') THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('momo-qr-codes', 'momo-qr-codes', true);
    END IF;
END $$;

-- Create storage policies for easy-momo QR codes (safe creation)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow public read access to momo QR codes') THEN
        CREATE POLICY "Allow public read access to momo QR codes" ON storage.objects
          FOR SELECT USING (bucket_id = 'momo-qr-codes');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow authenticated upload to momo QR codes') THEN
        CREATE POLICY "Allow authenticated upload to momo QR codes" ON storage.objects
          FOR INSERT WITH CHECK (bucket_id = 'momo-qr-codes');
    END IF;
END $$;

-- Create utility functions for easy-momo (safe creation)
CREATE OR REPLACE FUNCTION public.generate_ussd_string(
  input_value TEXT,
  amount INTEGER
) RETURNS TEXT AS $$
BEGIN
  -- Phone number pattern (07xxxxxxxx)
  IF input_value ~ '^07[2-9][0-9]{7}$' THEN
    RETURN '*182*1*1*' || input_value || '*' || amount || '#';
  -- Agent code pattern (4-6 digits)
  ELSIF input_value ~ '^[0-9]{4,6}$' THEN
    RETURN '*182*8*1*' || input_value || '*' || amount || '#';
  ELSE
    -- Default to phone format
    RETURN '*182*1*1*' || input_value || '*' || amount || '#';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.detect_payment_method(
  input_value TEXT
) RETURNS payment_method AS $$
BEGIN
  IF input_value ~ '^07[2-9][0-9]{7}$' THEN
    RETURN 'number'::payment_method;
  ELSIF input_value ~ '^[0-9]{4,6}$' THEN
    RETURN 'code'::payment_method;
  ELSE
    RETURN 'number'::payment_method; -- Default
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create set_config function for session management (safe creation)
CREATE OR REPLACE FUNCTION public.set_config(
  setting_name TEXT,
  setting_value TEXT,
  is_local BOOLEAN DEFAULT false
) RETURNS TEXT AS $$
BEGIN
  PERFORM pg_catalog.set_config(setting_name, setting_value, is_local);
  RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function (safe creation)
CREATE OR REPLACE FUNCTION update_momo_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to momo_payments table (safe creation)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_payments') THEN
        DROP TRIGGER IF EXISTS update_momo_payments_updated_at ON public.momo_payments;
        CREATE TRIGGER update_momo_payments_updated_at
            BEFORE UPDATE ON public.momo_payments
            FOR EACH ROW
            EXECUTE FUNCTION update_momo_updated_at_column();
    END IF;
END $$;

-- Grant necessary permissions (safe grants)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_payments') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_payments TO authenticated;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_payments TO anon;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_qr_history') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_qr_history TO authenticated;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_qr_history TO anon;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_shared_links') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_shared_links TO authenticated;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_shared_links TO anon;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_events') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_events TO authenticated;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_events TO anon;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'momo_transactions') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_transactions TO authenticated;
        GRANT SELECT, INSERT, UPDATE, DELETE ON public.momo_transactions TO anon;
    END IF;
END $$; 