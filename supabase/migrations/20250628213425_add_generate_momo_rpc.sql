-- MIGRATION: add_generate_momo_rpc
-- This migration creates an RPC to handle mobile money contributions.

-- 1. Create the RPC function
-- This function generates a USSD code for a mobile money payment,
-- records the pending contribution, and returns the USSD code to the client.
CREATE OR REPLACE FUNCTION public.create_contribution_and_get_momo_code(
  p_basket_id uuid,
  p_amount_local numeric,
  p_amount_usd numeric
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_momo_code text;
  v_creator_phone text;
  v_ussd_template text;
  v_user_country text;
  v_basket_currency text;
BEGIN
  -- Get basket currency and creator's phone number
  SELECT
    b.currency,
    u.mobile_money_number
  INTO v_basket_currency, v_creator_phone
  FROM public.baskets as b
  JOIN public.users as u ON b.creator_id = u.id
  WHERE b.id = p_basket_id;

  IF v_creator_phone IS NULL THEN
    RAISE EXCEPTION 'Basket creator mobile money number not found for basket_id: %', p_basket_id;
  END IF;

  -- Get user's country and the corresponding USSD template
  SELECT
    u.country,
    c.p1_send_money
  INTO v_user_country, v_ussd_template
  FROM public.users u
  JOIN public.countries c ON u.country = c.code
  WHERE u.id = v_user_id;

  IF v_ussd_template IS NULL THEN
    RAISE EXCEPTION 'USSD template for country % not found.', v_user_country;
  END IF;

  -- Generate the USSD code by replacing placeholders
  v_momo_code := replace(v_ussd_template, '[RECIPIENT]', v_creator_phone);
  v_momo_code := replace(v_momo_code, '[AMOUNT]', p_amount_local::text);

  -- Record the new contribution as unconfirmed
  INSERT INTO public.contributions(
    basket_id,
    user_id,
    amount_local,
    amount_usd,
    currency,
    payment_method,
    momo_code,
    confirmed
  ) VALUES (
    p_basket_id,
    v_user_id,
    p_amount_local,
    p_amount_usd,
    v_basket_currency,
    'ussd',
    v_momo_code,
    false
  );

  -- Return the generated USSD code
  RETURN v_momo_code;
END;
$$;

-- 2. Add RLS policy for contributions
-- This ensures that a user can only insert a contribution for themselves.
DROP POLICY IF EXISTS "user_can_insert_own_contribution" ON public.contributions;
CREATE POLICY "user_can_insert_own_contribution"
  ON public.contributions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());
