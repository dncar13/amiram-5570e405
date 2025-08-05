-- Check if constraint exists before trying to drop it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'subscriptions_plan_type_check' 
        AND table_name = 'subscriptions'
    ) THEN
        ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_plan_type_check;
    END IF;
END $$;

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