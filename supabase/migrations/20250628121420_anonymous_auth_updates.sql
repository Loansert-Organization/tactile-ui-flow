
-- Add missing fields to baskets table for basket creation flow
ALTER TABLE public.baskets 
ADD COLUMN IF NOT EXISTS goal_amount DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS momo_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS current_amount DECIMAL(12,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS participants_count INTEGER DEFAULT 1;

-- Create RLS policies for baskets table
ALTER TABLE public.baskets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view public baskets and their own baskets
CREATE POLICY "Users can view baskets" ON public.baskets
FOR SELECT USING (
  NOT is_private OR 
  (auth.uid() IS NOT NULL AND creator_id = auth.uid())
);

-- Policy: Authenticated users can create baskets
CREATE POLICY "Authenticated users can create baskets" ON public.baskets
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  creator_id = auth.uid()
);

-- Policy: Creators can update their own baskets
CREATE POLICY "Creators can update their baskets" ON public.baskets
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  creator_id = auth.uid()
);

-- Policy: Creators can delete their own baskets
CREATE POLICY "Creators can delete their baskets" ON public.baskets
FOR DELETE USING (
  auth.uid() IS NOT NULL AND 
  creator_id = auth.uid()
);

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
