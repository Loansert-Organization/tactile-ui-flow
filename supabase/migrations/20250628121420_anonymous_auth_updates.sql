-- Anonymous Authentication and Basket Enhancements Migration
-- This migration adds missing basket columns and updates RLS policies

-- Add missing columns to baskets table (safe additions)
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS goal_amount INTEGER;
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS momo_code TEXT;
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS current_amount INTEGER DEFAULT 0;
ALTER TABLE public.baskets ADD COLUMN IF NOT EXISTS participants_count INTEGER DEFAULT 0;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view baskets" ON public.baskets;
DROP POLICY IF EXISTS "Users can create baskets" ON public.baskets;
DROP POLICY IF EXISTS "Users can update their own baskets" ON public.baskets;
DROP POLICY IF EXISTS "Users can delete their own baskets" ON public.baskets;

-- Policy: Users can view public baskets and their own baskets
CREATE POLICY "Users can view baskets" ON public.baskets
FOR SELECT USING (
  NOT is_private OR
  (auth.uid() IS NOT NULL AND creator_id = auth.uid())
);

-- Policy: Authenticated users can create baskets
CREATE POLICY "Users can create baskets" ON public.baskets
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND creator_id = auth.uid());

-- Policy: Users can update their own baskets
CREATE POLICY "Users can update their own baskets" ON public.baskets
FOR UPDATE USING (auth.uid() IS NOT NULL AND creator_id = auth.uid());

-- Policy: Users can delete their own baskets
CREATE POLICY "Users can delete their own baskets" ON public.baskets
FOR DELETE USING (auth.uid() IS NOT NULL AND creator_id = auth.uid());

-- Create index for better performance on is_private queries
CREATE INDEX IF NOT EXISTS idx_baskets_is_private ON public.baskets(is_private);
CREATE INDEX IF NOT EXISTS idx_baskets_creator_id ON public.baskets(creator_id);

-- Create function to generate unique MOMO codes
CREATE OR REPLACE FUNCTION generate_momo_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-digit code starting with country prefix
    code := 'RW' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.baskets WHERE momo_code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate MOMO codes on basket creation
CREATE OR REPLACE FUNCTION set_basket_momo_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.momo_code IS NULL THEN
    NEW.momo_code := generate_momo_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER basket_momo_code_trigger
  BEFORE INSERT ON public.baskets
  FOR EACH ROW
  EXECUTE FUNCTION set_basket_momo_code();
