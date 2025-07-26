-- Fix plan_type constraint mismatch in subscriptions table
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

-- Drop the existing constraint if it exists
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Add new constraint with correct ENUM values
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('daily', 'weekly', 'monthly', 'quarterly'));

-- Create a summary view to verify the changes
DO $$
DECLARE
    updated_count INTEGER;
    current_plan_types TEXT[];
BEGIN
    -- Get count of records that would be updated
    SELECT COUNT(*) INTO updated_count
    FROM public.subscriptions 
    WHERE plan_type IN ('day', 'week', 'month', '3months');
    
    -- Get current distinct plan_types
    SELECT ARRAY_AGG(DISTINCT plan_type ORDER BY plan_type) INTO current_plan_types
    FROM public.subscriptions;
    
    -- Log the summary
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE 'Rows updated: %', updated_count;
    RAISE NOTICE 'Current plan_types in database: %', current_plan_types;
    RAISE NOTICE 'New ENUM constraint: daily, weekly, monthly, quarterly';
END $$;