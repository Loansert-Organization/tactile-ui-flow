-- Fix the handle_new_user trigger function to use valid auth_method values
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
      NEW.email
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
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance_usd)
  VALUES (NEW.id, 0.0);
  
  RETURN NEW;
END;
$$;

-- Add role column to users table for admin functionality
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Seed dev test user for local QA only
-- This user is for development and testing purposes only
INSERT INTO public.users (
  id,
  email,
  phone_number,
  country,
  is_anonymous,
  auth_method,
  display_name,
  role,
  created_at
) VALUES (
  '00000000-0000-0000-0000-DEVUSER000001',
  'dev@ikanisa.test',
  '+250781000999',
  'RW',
  false,
  'email',
  'Dev Test User',
  'admin',
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  phone_number = EXCLUDED.phone_number,
  country = EXCLUDED.country,
  is_anonymous = EXCLUDED.is_anonymous,
  auth_method = EXCLUDED.auth_method,
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role;

-- Create wallet for dev test user if not exists
INSERT INTO public.wallets (user_id, balance_usd)
SELECT '00000000-0000-0000-0000-DEVUSER000001', 100.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.wallets WHERE user_id = '00000000-0000-0000-0000-DEVUSER000001'
);

-- Add some test baskets for the dev user
INSERT INTO public.baskets (id, title, description, creator_id, country, currency, status, is_private, goal_amount, duration_days, category, current_amount, participants_count, created_at)
VALUES
  ('11111111-0000-0000-0000-DEVUSER000001', 'Dev Test Basket', 'A test basket for development purposes', '00000000-0000-0000-0000-DEVUSER000001', 'RW', 'RWF', 'active', true, 50000, 30, 'personal', 0, 1, now())
ON CONFLICT (id) DO NOTHING;

-- Add some test contributions
INSERT INTO public.contributions (id, basket_id, user_id, amount_local, amount_usd, currency, payment_method, momo_code, confirmed, created_at)
VALUES
  ('33333333-0000-0000-0000-DEVUSER000001', '11111111-0000-0000-0000-DEVUSER000001', '00000000-0000-0000-0000-DEVUSER000001', 5000, 4.5, 'RWF', 'ussd', '*182*1*DEV001#', true, now())
ON CONFLICT (id) DO NOTHING;

-- Add transaction for the contribution
INSERT INTO public.transactions (id, wallet_id, amount_usd, type, related_basket, created_at)
SELECT 
  '44444444-0000-0000-0000-DEVUSER000001',
  w.id,
  -4.5,
  'contribution',
  '11111111-0000-0000-0000-DEVUSER000001',
  now()
FROM public.wallets w 
WHERE w.user_id = '00000000-0000-0000-0000-DEVUSER000001'
ON CONFLICT (id) DO NOTHING;

-- Update RLS policies to support admin role
-- Admins can see all baskets (public and private)
DROP POLICY IF EXISTS "Users can view baskets in their country" ON public.baskets;
CREATE POLICY "Users can view baskets in their country" ON public.baskets
  FOR SELECT USING (
    (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')) OR
    (country = (SELECT country FROM public.users WHERE id = auth.uid())) OR
    (is_public = true)
  );

-- Only admins can create public baskets
DROP POLICY IF EXISTS "Users can create baskets" ON public.baskets;
CREATE POLICY "Users can create baskets" ON public.baskets
  FOR INSERT WITH CHECK (
    (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')) OR
    (is_public = false AND auth.uid() = user_id)
  );

-- Only admins can update public baskets
DROP POLICY IF EXISTS "Basket owners can update their baskets" ON public.baskets;
CREATE POLICY "Basket owners can update their baskets" ON public.baskets
  FOR UPDATE USING (
    (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')) OR
    (auth.uid() = user_id)
  );

-- Only admins can delete baskets
DROP POLICY IF EXISTS "Basket owners can delete their baskets" ON public.baskets;
CREATE POLICY "Basket owners can delete their baskets" ON public.baskets
  FOR DELETE USING (
    (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')) OR
    (auth.uid() = user_id)
  );
