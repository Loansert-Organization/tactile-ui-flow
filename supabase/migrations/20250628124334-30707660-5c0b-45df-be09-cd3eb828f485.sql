
-- Step 5: Backend Schema Alignment
-- Add mobile money number field to users table and ensure proper storage
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS mobile_money_number TEXT;

-- Create a trigger to set mobile money number to whatsapp number by default
CREATE OR REPLACE FUNCTION public.set_default_mobile_money()
RETURNS TRIGGER AS $$
BEGIN
  -- If mobile_money_number is null but whatsapp_number exists, set them equal
  IF NEW.mobile_money_number IS NULL AND NEW.whatsapp_number IS NOT NULL THEN
    NEW.mobile_money_number := NEW.whatsapp_number;
  END IF;
  
  -- If whatsapp_number is set and mobile_money_number was previously null, update it
  IF NEW.whatsapp_number IS NOT NULL AND OLD.mobile_money_number IS NULL THEN
    NEW.mobile_money_number := NEW.whatsapp_number;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the function
DROP TRIGGER IF EXISTS trigger_set_default_mobile_money ON public.users;
CREATE TRIGGER trigger_set_default_mobile_money
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_mobile_money();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_whatsapp_number ON public.users(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_users_mobile_money_number ON public.users(mobile_money_number);
