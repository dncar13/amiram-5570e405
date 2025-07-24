-- Fix RLS policy for coupons table to include correct admin emails
-- Drop the existing policy with hardcoded admin@example.com
DROP POLICY IF EXISTS "Admins can manage all coupons" ON coupons;

-- Create new policy that includes the actual admin emails from the app
CREATE POLICY "Admins can manage all coupons" 
ON coupons 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT profiles.user_id
    FROM profiles
    WHERE profiles.email IN ('dncar13@gmail.com', 'buldir@gmail.com')
  )
);

-- Ensure the admin users have profiles in the database
-- Insert profiles for admin users if they don't exist
INSERT INTO profiles (user_id, email, display_name)
SELECT 
  auth.users.id,
  auth.users.email,
  COALESCE(auth.users.raw_user_meta_data->>'display_name', split_part(auth.users.email, '@', 1))
FROM auth.users
WHERE auth.users.email IN ('dncar13@gmail.com', 'buldir@gmail.com')
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.user_id = auth.users.id
  );

-- Update existing profiles to ensure correct email if needed
UPDATE profiles 
SET email = (
  SELECT email FROM auth.users WHERE auth.users.id = profiles.user_id
)
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('dncar13@gmail.com', 'buldir@gmail.com')
) AND email != (
  SELECT email FROM auth.users WHERE auth.users.id = profiles.user_id
);