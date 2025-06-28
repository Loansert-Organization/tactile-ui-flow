
-- Fix the handle_new_user trigger function to handle missing app_metadata field
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
      WHEN NEW.email IS NOT NULL THEN 'email'
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
