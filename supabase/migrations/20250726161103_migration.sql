-- Fix RLS policies and subscription handling for the premium-coupon system

-- 1. Update subscriptions table to ensure proper policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop and recreate subscription policies for better access control
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Allow users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow service role and authenticated users to manage subscriptions
CREATE POLICY "Authenticated users can manage their own subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow service role full access (for backend operations)
CREATE POLICY "Service role full access" 
ON public.subscriptions 
FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

-- 2. Fix the has_active_premium function to be more robust
CREATE OR REPLACE FUNCTION public.has_active_premium(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions 
    WHERE subscriptions.user_id = has_active_premium.user_id
    AND status = 'active' 
    AND (end_date IS NULL OR end_date > now())
  );
END;
$function$;

-- 3. Create a function to properly cancel subscriptions
CREATE OR REPLACE FUNCTION public.cancel_user_subscription(p_user_id uuid)
 RETURNS TABLE(success boolean, updated_count integer, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_updated_count integer;
BEGIN
    -- Update all active subscriptions to cancelled
    UPDATE public.subscriptions 
    SET 
        status = 'cancelled',
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
$function$;

-- 4. Ensure coupon_usage table has proper policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all coupon usage" ON public.coupon_usage;
DROP POLICY IF EXISTS "Service can insert coupon usage" ON public.coupon_usage;
DROP POLICY IF EXISTS "Users can view their own coupon usage" ON public.coupon_usage;

-- Recreate with proper access
CREATE POLICY "Users can view their own coupon usage" 
ON public.coupon_usage 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own coupon usage" 
ON public.coupon_usage 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all coupon usage" 
ON public.coupon_usage 
FOR SELECT 
USING (auth.uid() IN (
    SELECT profiles.user_id
    FROM profiles
    WHERE profiles.email = ANY(ARRAY['dncar13@gmail.com'::text, 'buldir@gmail.com'::text])
));

-- Service role gets full access
CREATE POLICY "Service role full access coupon usage" 
ON public.coupon_usage 
FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

-- 5. Create a comprehensive function to handle free coupon orders
CREATE OR REPLACE FUNCTION public.process_free_coupon_subscription(
    p_user_id uuid,
    p_coupon_id uuid,
    p_plan_type text,
    p_original_amount integer,
    p_discount_amount integer,
    p_final_amount integer
)
 RETURNS TABLE(success boolean, subscription_id uuid, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_coupon_record record;
    v_subscription_id uuid;
    v_end_date timestamp with time zone;
BEGIN
    -- Validate inputs
    IF p_user_id IS NULL OR p_coupon_id IS NULL OR p_plan_type IS NULL THEN
        RETURN QUERY SELECT false, null::uuid, 'Missing required parameters'::text;
        RETURN;
    END IF;

    -- Get coupon details
    SELECT * INTO v_coupon_record 
    FROM public.coupons 
    WHERE id = p_coupon_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, null::uuid, 'Invalid or inactive coupon'::text;
        RETURN;
    END IF;

    -- Check if coupon was already used by this user
    IF EXISTS (
        SELECT 1 FROM public.coupon_usage 
        WHERE coupon_id = p_coupon_id AND user_id = p_user_id
    ) THEN
        RETURN QUERY SELECT false, null::uuid, 'Coupon already used by this user'::text;
        RETURN;
    END IF;

    -- For 100% discount coupons with 0 final amount, create subscription
    IF p_final_amount = 0 AND v_coupon_record.discount_type = 'percent' AND v_coupon_record.discount_value = 100 THEN
        
        -- Calculate end date based on plan type
        v_end_date := now();
        CASE p_plan_type
            WHEN 'daily' THEN v_end_date := v_end_date + interval '1 day';
            WHEN 'weekly' THEN v_end_date := v_end_date + interval '7 days';
            WHEN 'monthly' THEN v_end_date := v_end_date + interval '1 month';
            WHEN 'quarterly' THEN v_end_date := v_end_date + interval '3 months';
            ELSE 
                RETURN QUERY SELECT false, null::uuid, 'Invalid plan type'::text;
                RETURN;
        END CASE;

        -- Create subscription
        INSERT INTO public.subscriptions (user_id, plan_type, status, start_date, end_date)
        VALUES (p_user_id, p_plan_type, 'active', now(), v_end_date)
        RETURNING id INTO v_subscription_id;

        -- Record coupon usage
        INSERT INTO public.coupon_usage (
            coupon_id, user_id, plan_type, original_amount, discount_amount, final_amount
        ) VALUES (
            p_coupon_id, p_user_id, p_plan_type, p_original_amount, p_discount_amount, p_final_amount
        );

        -- Update coupon usage count
        UPDATE public.coupons 
        SET used_count = used_count + 1 
        WHERE id = p_coupon_id;

        RETURN QUERY SELECT true, v_subscription_id, 'Free subscription created successfully'::text;
    ELSE
        RETURN QUERY SELECT false, null::uuid, 'This function only handles 100% discount coupons'::text;
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT false, null::uuid, ('Error: ' || SQLERRM)::text;
END;
$function$;