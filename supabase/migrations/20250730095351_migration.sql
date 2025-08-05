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
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'subscriptions_plan_type_check' 
        AND table_name = 'subscriptions'
    ) THEN
        ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_plan_type_check 
        CHECK (plan_type IN ('day', 'week', 'month', '3months'));
    END IF;
END $$;