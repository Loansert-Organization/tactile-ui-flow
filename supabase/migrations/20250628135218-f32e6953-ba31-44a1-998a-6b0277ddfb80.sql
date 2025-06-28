
-- First, let's ensure we have proper user roles support
CREATE TYPE public.app_role AS ENUM ('admin', 'owner', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- Insert a dummy user for testing (this will be a fallback anonymous user)
INSERT INTO public.users (
  id,
  display_name,
  country,
  auth_method,
  is_anonymous,
  mobile_money_number,
  whatsapp_number,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  'Project Owner',
  'RW',
  'anonymous',
  true,
  '+250781234567',
  '+250781234567',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Assign owner role to dummy user
INSERT INTO public.user_roles (user_id, role)
VALUES ('00000000-0000-0000-0000-000000000099', 'owner')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create wallet for dummy user if not exists (using WHERE NOT EXISTS instead of ON CONFLICT)
INSERT INTO public.wallets (user_id, balance_usd)
SELECT '00000000-0000-0000-0000-000000000099', 150.0
WHERE NOT EXISTS (
  SELECT 1 FROM public.wallets 
  WHERE user_id = '00000000-0000-0000-0000-000000000099'
);

-- Add some transaction history for the dummy user using only 'contribution' type
INSERT INTO public.transactions (wallet_id, amount_usd, type, created_at)
SELECT w.id, -25.0, 'contribution', now() - INTERVAL '2 days'
FROM public.wallets w 
WHERE w.user_id = '00000000-0000-0000-0000-000000000099'
AND NOT EXISTS (
  SELECT 1 FROM public.transactions t 
  WHERE t.wallet_id = w.id 
  AND t.amount_usd = -25.0 
  AND t.type = 'contribution'
);

INSERT INTO public.transactions (wallet_id, amount_usd, type, created_at)
SELECT w.id, -15.0, 'contribution', now() - INTERVAL '5 days'
FROM public.wallets w 
WHERE w.user_id = '00000000-0000-0000-0000-000000000099'
AND NOT EXISTS (
  SELECT 1 FROM public.transactions t 
  WHERE t.wallet_id = w.id 
  AND t.amount_usd = -15.0 
  AND t.type = 'contribution'
);
