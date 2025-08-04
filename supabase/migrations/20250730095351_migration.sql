-- Update existing records to use the new plan_type values
UPDATE public.subscriptions 
SET plan_type = CASE 
    WHEN plan_type = 'daily' THEN 'day'
    WHEN plan_type = 'weekly' THEN 'week'
    WHEN plan_type = 'monthly' THEN 'month'
    WHEN plan_type = 'quarterly' THEN '3months'
    ELSE plan_type
END
WHERE plan_type IN ('daily', 'weekly', 'monthly', 'quarterly');

-- Add the correct constraint with the values actually used in the code
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('day', 'week', 'month', '3months'));