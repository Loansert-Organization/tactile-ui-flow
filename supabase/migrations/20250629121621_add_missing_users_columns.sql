-- Add missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Create index for role column
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Update existing users to have default role
UPDATE public.users SET role = 'user' WHERE role IS NULL;
