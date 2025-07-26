-- Task 5: Fix RLS Policies and Ensure Subscription Cancellation Works Correctly

-- 1. Add cancelled_at column to subscriptions table if it doesn't exist
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone;

-- 2. Update the status constraint to include 'cancelled'
ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_status_check;

ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_status_check
CHECK (status IN ('active', 'expired', 'cancelled'));

-- 3. Update the cancel_user_subscription function to include cancelled_at
CREATE OR REPLACE FUNCTION public.cancel_user_subscription(p_user_id uuid)
RETURNS TABLE(success boolean, updated_count integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    v_updated_count integer;
BEGIN
    -- Update all active subscriptions to cancelled
    UPDATE public.subscriptions 
    SET 
        status = 'cancelled',
        cancelled_at = now(),
        updated_at = now()
    WHERE user_id = p_user_id 
    AND status = 'active';
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    
    IF v_updated_count > 0 THEN
        RETURN QUERY SELECT true, v_updated_count, 'Subscription cancelled successfully'::text;
    ELSE
        RETURN QUERY SELECT false, 0, 'No active subscription found'::text;
    END IF;
END;
$$;

-- 4. Ensure RLS policies are correct for subscription cancellation
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Authenticated users can manage their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'active')
WITH CHECK (auth.uid() = user_id AND status IN ('cancelled', 'expired'));

-- 5. Ensure service role maintains full access
-- (This policy already exists and should remain unchanged)

-- 6. Create an index for better performance on cancellation queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
ON public.subscriptions (user_id, status) 
WHERE status = 'active';