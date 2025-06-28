-- Fix RLS policies for users table to allow self-read access
-- Execute this in your Supabase SQL Editor to resolve the 400 error

-- Ensure RLS is enabled on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "self_read_users" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "self_update_users" ON public.users;

-- Create comprehensive self-read policy for users
CREATE POLICY "self_read_users" ON public.users
  FOR SELECT USING (id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY "self_update_users" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- Admin users can read all user profiles
DROP POLICY IF EXISTS "admin_read_all_users" ON public.users;
CREATE POLICY "admin_read_all_users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Admin users can update any user profile
DROP POLICY IF EXISTS "admin_update_all_users" ON public.users;
CREATE POLICY "admin_update_all_users" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.users TO authenticated;
GRANT UPDATE ON public.users TO authenticated;

-- Grant permissions to anonymous users (they are still authenticated in Supabase)
GRANT SELECT ON public.users TO anon;

-- Verify the policies are working
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY policyname; 