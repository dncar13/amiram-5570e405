-- Fix process_free_coupon_subscription to support all plan types with correct durations
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
        
        -- Calculate end date based on plan type with CORRECT durations
        v_end_date := now();
        CASE p_plan_type
            WHEN 'daily' THEN v_end_date := v_end_date + interval '1 day';
            WHEN 'weekly' THEN v_end_date := v_end_date + interval '7 days';
            WHEN 'monthly' THEN v_end_date := v_end_date + interval '30 days';
            WHEN 'quarterly' THEN v_end_date := v_end_date + interval '90 days';
            ELSE 
                RETURN QUERY SELECT false, null::uuid, 'Invalid plan type. Must be: daily, weekly, monthly, or quarterly'::text;
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