-- Fix coupon admin policies and add is_admin field to profiles

-- Add is_admin field to profiles table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create index for better performance on admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- Drop existing admin policies for coupons
DROP POLICY IF EXISTS "Admins can manage all coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can view all coupon usage" ON public.coupon_usage;

-- Create new admin policies using is_admin field
CREATE POLICY "Admins can manage all coupons" ON public.coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can view all coupon usage" ON public.coupon_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Update current user to admin if they are the first admin
-- This assumes the first user in profiles is the admin
UPDATE public.profiles 
SET is_admin = true 
WHERE user_id = (
  SELECT user_id FROM public.profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);