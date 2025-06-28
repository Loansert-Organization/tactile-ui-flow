
-- Seed dummy data for Rwanda-only users, baskets, and contributions (FINAL CORRECTED VERSION)

-- 👥 USERS (all WhatsApp-authenticated, Rwanda)
INSERT INTO public.users (id, phone_number, whatsapp_number, mobile_money_number, country, is_anonymous, auth_method, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '+250781000001', '+250781000001', '+250781000001', 'RW', false, 'whatsapp', now()),
  ('00000000-0000-0000-0000-000000000002', '+250781000002', '+250781000002', '+250781000002', 'RW', false, 'whatsapp', now()),
  ('00000000-0000-0000-0000-000000000003', '+250781000003', '+250781000003', '+250781000003', 'RW', false, 'whatsapp', now()),
  ('00000000-0000-0000-0000-000000000004', '+250781000004', '+250781000004', '+250781000004', 'RW', false, 'whatsapp', now()),
  ('00000000-0000-0000-0000-000000000005', '+250781000005', '+250781000005', '+250781000005', 'RW', false, 'whatsapp', now());

-- 🧺 BASKETS (private, all Rwanda)
INSERT INTO public.baskets (id, title, description, creator_id, country, currency, status, is_private, goal_amount, duration_days, category, current_amount, participants_count, created_at)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Wedding for Alice & Jean', 'Support our wedding plans 💍', '00000000-0000-0000-0000-000000000001', 'RW', 'RWF', 'active', true, 500000, 60, 'personal', 15000, 3, now()),
  ('11111111-0000-0000-0000-000000000002', 'School Fees for Junior', 'Helping Junior with 2025 school term', '00000000-0000-0000-0000-000000000002', 'RW', 'RWF', 'active', true, 200000, 30, 'education', 3000, 2, now()),
  ('11111111-0000-0000-0000-000000000003', 'Medical Support for Mama', 'Raising funds for surgery', '00000000-0000-0000-0000-000000000003', 'RW', 'RWF', 'active', true, 800000, 45, 'health', 10000, 3, now()),
  ('11111111-0000-0000-0000-000000000004', 'Small Business Startup', 'Help launch my tailoring business', '00000000-0000-0000-0000-000000000004', 'RW', 'RWF', 'active', true, 300000, 90, 'business', 0, 1, now()),
  ('11111111-0000-0000-0000-000000000005', 'Church Roof Repair', 'Community fundraising for church maintenance', '00000000-0000-0000-0000-000000000005', 'RW', 'RWF', 'active', true, 1000000, 120, 'community', 0, 1, now());

-- 🏦 WALLETS (for users to have wallet balances)
INSERT INTO public.wallets (id, user_id, balance_usd, last_updated)
VALUES
  ('22222222-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 50.0, now()),
  ('22222222-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 25.0, now()),
  ('22222222-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 75.0, now()),
  ('22222222-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 30.0, now()),
  ('22222222-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 40.0, now());

-- 💸 CONTRIBUTIONS (local only — all Rwanda users to Rwanda baskets)
INSERT INTO public.contributions (id, basket_id, user_id, amount_local, amount_usd, currency, payment_method, momo_code, confirmed, created_at)
VALUES
  ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 5000, 4.5, 'RWF', 'ussd', '*182*1*123456#', true, now()),
  ('33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 10000, 9.0, 'RWF', 'ussd', '*182*1*654321#', true, now()),
  ('33333333-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 3000, 2.7, 'RWF', 'ussd', '*182*1*789123#', true, now()),
  ('33333333-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 2000, 1.8, 'RWF', 'ussd', '*182*1*456789#', true, now()),
  ('33333333-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 8000, 7.2, 'RWF', 'ussd', '*182*1*987654#', true, now());

-- 📊 TRANSACTIONS (related to contributions for wallet tracking)
INSERT INTO public.transactions (id, wallet_id, amount_usd, type, related_basket, created_at)
VALUES
  ('44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', -4.5, 'contribution', '11111111-0000-0000-0000-000000000001', now()),
  ('44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', -9.0, 'contribution', '11111111-0000-0000-0000-000000000001', now()),
  ('44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', -2.7, 'contribution', '11111111-0000-0000-0000-000000000002', now()),
  ('44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000004', -1.8, 'contribution', '11111111-0000-0000-0000-000000000003', now()),
  ('44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005', -7.2, 'contribution', '11111111-0000-0000-0000-000000000003', now());

-- 🔒 RLS POLICY: Ensure users can only contribute to baskets in their own country
CREATE POLICY "Users can only contribute to baskets in same country" 
  ON public.contributions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.users u 
      JOIN public.baskets b ON b.id = basket_id 
      WHERE u.id = user_id AND u.country = b.country
    )
  );

-- 🔒 RLS POLICY: Users can only view contributions for baskets in their country
CREATE POLICY "Users can view contributions in same country" 
  ON public.contributions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.users u 
      JOIN public.baskets b ON b.id = basket_id 
      WHERE u.id = auth.uid() AND u.country = b.country
    )
  );
