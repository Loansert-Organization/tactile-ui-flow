-- MIGRATION: fix-user-and-basket-rls
-- DATE: 2024-06-29

-- 1. FIX USERS TABLE RLS
-- GOAL: Allow users to read their own profile data to fix 400 errors.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "self_select" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "self_read_users" ON public.users;

-- Allow users to read their own user record
CREATE POLICY "self_select" ON public.users
  FOR SELECT
  USING (auth.uid() = id);


-- 2. FIX BASKETS TABLE RLS
-- GOAL: Allow users to read baskets that are public, they created, or they are a member of.
-- This fixes 406 errors on the basket detail page.

-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "creator_or_member_read" ON public.baskets;
DROP POLICY IF EXISTS "Users can view baskets" ON public.baskets;

-- Allow read access for public baskets, creators, and members
CREATE POLICY "creator_or_member_read" ON public.baskets
  FOR SELECT
  USING (
    is_private = false OR
    creator_id = auth.uid() OR
    id IN (SELECT basket_id FROM public.basket_members WHERE user_id = auth.uid())
  ); 