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

-- 🧺 CREATE MISSING basket_members TABLE
-- This table tracks which users are members of which baskets
CREATE TABLE IF NOT EXISTS public.basket_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  basket_id UUID NOT NULL REFERENCES public.baskets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_creator BOOLEAN DEFAULT false,
  UNIQUE(basket_id, user_id)
);

-- Enable RLS on basket_members table
ALTER TABLE public.basket_members ENABLE ROW LEVEL SECURITY;

-- RLS policy for basket_members: Users can view members of baskets they belong to
CREATE POLICY "Users can view basket members" ON public.basket_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.basket_members bm2 
      WHERE bm2.basket_id = basket_members.basket_id
    )
  );

-- RLS policy for basket_members: Users can add themselves to public baskets or be added by creators
CREATE POLICY "Users can join baskets" ON public.basket_members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND (
      -- Can join public baskets
      EXISTS(SELECT 1 FROM public.baskets WHERE id = basket_id AND is_private = false) OR
      -- Can be added to private baskets by creator
      auth.uid() IN (SELECT creator_id FROM public.baskets WHERE id = basket_id)
    )
  );

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
  ('11111111-0000-0000-0000-DEVUSER000001', 'Dev Test Basket', 'A test basket for development purposes', '00000000-0000-0000-0000-DEVUSER000001', 'RW', 'RWF', 'active', true, 50000, 30, 'personal', 0, 1, now()),
  ('11111111-0000-0000-0000-DEVUSER000002', 'Dev Public Basket', 'A public test basket for development', '00000000-0000-0000-0000-DEVUSER000001', 'RW', 'RWF', 'active', false, 100000, 30, 'community', 15000, 3, now())
ON CONFLICT (id) DO NOTHING;

-- Add basket membership records for the test baskets
INSERT INTO public.basket_members (basket_id, user_id, is_creator, joined_at)
VALUES
  ('11111111-0000-0000-0000-DEVUSER000001', '00000000-0000-0000-0000-DEVUSER000001', true, now()),
  ('11111111-0000-0000-0000-DEVUSER000002', '00000000-0000-0000-0000-DEVUSER000001', true, now())
ON CONFLICT (basket_id, user_id) DO NOTHING;

-- Add some test contributions
INSERT INTO public.contributions (id, basket_id, user_id, amount_local, amount_usd, currency, payment_method, momo_code, confirmed, created_at)
VALUES
  ('33333333-0000-0000-0000-DEVUSER000001', '11111111-0000-0000-0000-DEVUSER000001', '00000000-0000-0000-0000-DEVUSER000001', 5000, 4.5, 'RWF', 'ussd', '*182*1*DEV001#', true, now()),
  ('33333333-0000-0000-0000-DEVUSER000002', '11111111-0000-0000-0000-DEVUSER000002', '00000000-0000-0000-0000-DEVUSER000001', 15000, 13.5, 'RWF', 'ussd', '*182*1*DEV002#', true, now())
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

-- Add second transaction for the public basket
INSERT INTO public.transactions (id, wallet_id, amount_usd, type, related_basket, created_at)
SELECT 
  '44444444-0000-0000-0000-DEVUSER000002',
  w.id,
  -13.5,
  'contribution',
  '11111111-0000-0000-0000-DEVUSER000002',
  now()
FROM public.wallets w 
WHERE w.user_id = '00000000-0000-0000-0000-DEVUSER000001'
ON CONFLICT (id) DO NOTHING;

-- 🔒 UPDATED RLS POLICIES for baskets table with FIXED column references
-- Drop and recreate all basket policies with correct column names

-- Users can view baskets based on privacy and membership
DROP POLICY IF EXISTS "Users can view baskets in their country" ON public.baskets;
DROP POLICY IF EXISTS "Users can view baskets" ON public.baskets;
CREATE POLICY "Users can view baskets" ON public.baskets
  FOR SELECT USING (
    -- Admin users can see all baskets
    (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')) OR
    -- Users can see public baskets
    (is_private = false) OR
    -- Users can see their own created baskets
    (auth.uid() = creator_id) OR
    -- Users can see baskets they're members of
    (auth.uid() IN (SELECT user_id FROM public.basket_members WHERE basket_id = baskets.id))
  );

-- Users can create baskets (both public and private, but admin role required for special features)
DROP POLICY IF EXISTS "Users can create baskets" ON public.baskets;
DROP POLICY IF EXISTS "Authenticated users can create baskets" ON public.baskets;
CREATE POLICY "Users can create baskets" ON public.baskets
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid() = creator_id
  );

-- Users can update their own baskets (admins can update any)
DROP POLICY IF EXISTS "Basket owners can update their baskets" ON public.baskets;
DROP POLICY IF EXISTS "Creators can update their baskets" ON public.baskets;
CREATE POLICY "Basket owners can update their baskets" ON public.baskets
  FOR UPDATE USING (
    (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')) OR
    (auth.uid() = creator_id)
  );

-- Users can delete their own baskets (admins can delete any)
DROP POLICY IF EXISTS "Basket owners can delete their baskets" ON public.baskets;
DROP POLICY IF EXISTS "Creators can delete their baskets" ON public.baskets;
CREATE POLICY "Basket owners can delete their baskets" ON public.baskets
  FOR DELETE USING (
    (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')) OR
    (auth.uid() = creator_id)
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_basket_members_basket_id ON public.basket_members(basket_id);
CREATE INDEX IF NOT EXISTS idx_basket_members_user_id ON public.basket_members(user_id);
CREATE INDEX IF NOT EXISTS idx_baskets_creator_id ON public.baskets(creator_id);
CREATE INDEX IF NOT EXISTS idx_baskets_is_private ON public.baskets(is_private);

-- Add trigger to automatically add creator as member when basket is created
CREATE OR REPLACE FUNCTION public.add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Add the creator as a member of the basket
  INSERT INTO public.basket_members (basket_id, user_id, is_creator, joined_at)
  VALUES (NEW.id, NEW.creator_id, true, now())
  ON CONFLICT (basket_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_add_creator_as_member ON public.baskets;
CREATE TRIGGER trigger_add_creator_as_member
  AFTER INSERT ON public.baskets
  FOR EACH ROW
  EXECUTE FUNCTION public.add_creator_as_member();
