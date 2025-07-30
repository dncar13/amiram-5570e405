-- Fix plan_type constraint to match the actual values used in the application
-- Remove the old constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Add the correct constraint with the values actually used in the code
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('day', 'week', 'month', '3months'));