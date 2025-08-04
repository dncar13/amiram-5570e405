-- Fix plan_type constraint mismatch in subscriptions table
-- First, drop the existing constraint completely
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Update existing records to use new plan_type values
UPDATE public.subscriptions 
SET plan_type = CASE 
    WHEN plan_type = 'day' THEN 'daily'
    WHEN plan_type = 'week' THEN 'weekly' 
    WHEN plan_type = 'month' THEN 'monthly'
    WHEN plan_type = '3months' THEN 'quarterly'
    ELSE plan_type
END
WHERE plan_type IN ('day', 'week', 'month', '3months');

-- Add new constraint with correct ENUM values
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('daily', 'weekly', 'monthly', 'quarterly'));