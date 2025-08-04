-- Check if constraint exists and drop if needed
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_plan_type_check') THEN
        ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_plan_type_check;
    END IF;
END $$;

-- Update any existing records that might have old values
UPDATE public.subscriptions 
SET plan_type = CASE 
    WHEN plan_type = 'daily' THEN 'day'
    WHEN plan_type = 'weekly' THEN 'week'
    WHEN plan_type = 'monthly' THEN 'month'
    WHEN plan_type = 'quarterly' THEN '3months'
    ELSE plan_type
END
WHERE plan_type IN ('daily', 'weekly', 'monthly', 'quarterly');

-- Add the new constraint
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('day', 'week', 'month', '3months'));