-- up migration: add_generate_momo_rpc
-- 1. Add public column to baskets if not exists
ALTER TABLE baskets
ADD COLUMN IF NOT EXISTS public BOOLEAN DEFAULT FALSE;

-- 2. Create/replace RPC to generate mobile-money USSD code
CREATE OR REPLACE FUNCTION public.generate_momo_code(
    p_basket_id uuid,
    p_amount numeric
) RETURNS text
    SECURITY DEFINER
    LANGUAGE sql
AS $$
    SELECT format(
        '*%s*1*1*%s*%s#',
        (SELECT momo_prefix
         FROM countries
         WHERE code = (SELECT country FROM users WHERE id = auth.uid())
        ),
        (SELECT phone_number
         FROM users
         WHERE id = (SELECT creator_id FROM baskets WHERE id = p_basket_id)
        ),
        p_amount
    );
$$;

-- 3. Enable RLS and policy on contributions
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Only allow user to insert their own contributions
DROP POLICY IF EXISTS "insert_own_contributions" ON contributions;
CREATE POLICY "insert_own_contributions" ON contributions
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- down migration intentionally left blank 