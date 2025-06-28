
-- Update users table to support Google authentication
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Update the trigger function to handle Google auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user into public.users table
  INSERT INTO public.users (
    id,
    email,
    display_name,
    avatar_url,
    phone_number,
    whatsapp_number,
    mobile_money_number,
    country,
    auth_method,
    is_anonymous
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.email
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.phone,
    NEW.phone,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'country', 'RW'), -- Default to Rwanda
    CASE 
      WHEN NEW.phone IS NOT NULL THEN 'whatsapp'
      WHEN NEW.email IS NOT NULL AND NEW.app_metadata->>'provider' = 'google' THEN 'google'
      ELSE 'anonymous'
    END,
    CASE 
      WHEN NEW.phone IS NOT NULL OR NEW.email IS NOT NULL THEN false
      ELSE true
    END
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance_usd)
  VALUES (NEW.id, 0.0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
