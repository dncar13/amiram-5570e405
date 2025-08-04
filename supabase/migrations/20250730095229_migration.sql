-- First, drop the constraint temporarily to allow updates
ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_plan_type_check;

-- Update existing records to use the new plan_type values
UPDATE public.subscriptions 
SET plan_type = CASE 
    WHEN plan_type = 'daily' THEN 'day'
    WHEN plan_type = 'weekly' THEN 'week'
    WHEN plan_type = 'monthly' THEN 'month'
    WHEN plan_type = 'quarterly' THEN '3months'
    ELSE plan_type
END;

-- Add the new constraint with the correct values
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('day', 'week', 'month', '3months'));