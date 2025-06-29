-- Fix Users RLS Policies Migration
-- This migration ensures proper RLS policies for the users table

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view public profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "admin_read_all_users" ON public.users;
DROP POLICY IF EXISTS "admin_update_all_users" ON public.users;
DROP POLICY IF EXISTS "self_read_users" ON public.users;
DROP POLICY IF EXISTS "self_update_users" ON public.users;

-- Ensure RLS is enabled on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view profiles
CREATE POLICY "Users can view profiles" ON public.users
FOR SELECT USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin users can read all user profiles
CREATE POLICY "admin_read_all_users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Admin users can update any user profile
CREATE POLICY "admin_update_all_users" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Ensure the handle_new_user trigger creates the user profile correctly
-- This should resolve cases where the user row doesn't exist after auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
      NEW.raw_user_meta_data->>'display_name',
      CASE 
        WHEN NEW.email IS NOT NULL THEN split_part(NEW.email, '@', 1)
        WHEN NEW.phone IS NOT NULL THEN 'User ' || RIGHT(NEW.phone, 4)
        ELSE 'Anonymous User'
      END
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.phone,
    NEW.phone,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'country', 'RW'), -- Default to Rwanda
    CASE 
      WHEN NEW.phone IS NOT NULL THEN 'whatsapp'
      WHEN NEW.email IS NOT NULL THEN 'google'
      ELSE 'anonymous'
    END,
    CASE 
      WHEN NEW.phone IS NOT NULL OR NEW.email IS NOT NULL THEN false
      ELSE true
    END
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, users.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    phone_number = COALESCE(EXCLUDED.phone_number, users.phone_number),
    whatsapp_number = COALESCE(EXCLUDED.whatsapp_number, users.whatsapp_number),
    mobile_money_number = COALESCE(EXCLUDED.mobile_money_number, users.mobile_money_number),
    country = COALESCE(EXCLUDED.country, users.country),
    auth_method = EXCLUDED.auth_method,
    is_anonymous = EXCLUDED.is_anonymous,
    updated_at = now();
  
  -- Create wallet for new user if it doesn't exist
  INSERT INTO public.wallets (user_id, balance_usd)
  VALUES (NEW.id, 0.0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger to ensure it's using the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for better performance on user queries
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.users TO authenticated;
GRANT UPDATE ON public.users TO authenticated;

-- Grant permissions to anonymous users (they are still authenticated in Supabase)
GRANT SELECT ON public.users TO anon; 