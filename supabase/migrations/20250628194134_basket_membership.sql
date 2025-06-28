
-- =========================================
-- IKANISA · RLS SELF-ACCESS POLICIES
-- Run this in Supabase SQL Editor, then refresh the app
-- =========================================

/* ---------- USERS ---------- */
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own profile" ON users;
CREATE POLICY "Users can read their own profile"
  ON users
  FOR SELECT
  USING ( id = auth.uid() );

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING ( id = auth.uid() )
  WITH CHECK ( id = auth.uid() );

/* ---------- WALLETS ---------- */
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner can read wallet" ON wallets;
CREATE POLICY "Owner can read wallet"
  ON wallets
  FOR SELECT
  USING ( user_id = auth.uid() );

DROP POLICY IF EXISTS "Owner can update wallet" ON wallets;
CREATE POLICY "Owner can update wallet"
  ON wallets
  FOR UPDATE
  USING ( user_id = auth.uid() )
  WITH CHECK ( user_id = auth.uid() );

/* ---------- BASKETS ---------- */
ALTER TABLE baskets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creator can read basket" ON baskets;
CREATE POLICY "Creator can read basket"
  ON baskets
  FOR SELECT
  USING ( creator_id = auth.uid() OR is_private = false );

DROP POLICY IF EXISTS "Creator can update basket" ON baskets;
CREATE POLICY "Creator can update basket"
  ON baskets
  FOR UPDATE
  USING ( creator_id = auth.uid() )
  WITH CHECK ( creator_id = auth.uid() );

/* ---------- BASKET_MEMBERS (join table) ---------- */
-- First check if the table exists, create if it doesn't
CREATE TABLE IF NOT EXISTS basket_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  basket_id UUID NOT NULL REFERENCES baskets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_creator BOOLEAN DEFAULT false,
  UNIQUE(basket_id, user_id)
);

ALTER TABLE basket_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Member can read their basket link" ON basket_members;
CREATE POLICY "Member can read their basket link"
  ON basket_members
  FOR SELECT
  USING ( user_id = auth.uid() );

DROP POLICY IF EXISTS "Member can insert themselves into basket" ON basket_members;
CREATE POLICY "Member can insert themselves into basket"
  ON basket_members
  FOR INSERT
  WITH CHECK ( user_id = auth.uid() );

/* ---------- CONTRIBUTIONS ---------- */
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contributor can read their contributions" ON contributions;
CREATE POLICY "Contributor can read their contributions"
  ON contributions
  FOR SELECT
  USING ( user_id = auth.uid() );

DROP POLICY IF EXISTS "Contributor can insert contribution" ON contributions;
CREATE POLICY "Contributor can insert contribution"
  ON contributions
  FOR INSERT
  WITH CHECK ( user_id = auth.uid() );

/* ---------- TRANSACTIONS ---------- */
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Wallet owner can read transactions" ON transactions;
CREATE POLICY "Wallet owner can read transactions"
  ON transactions
  FOR SELECT
  USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

-- =========================================
-- DONE: Refresh your app and basket/profile
-- pages should load without the 400 errors.
-- =========================================
