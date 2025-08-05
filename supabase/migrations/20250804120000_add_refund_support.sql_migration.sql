-- Add refund support for subscription cancellations
-- This migration adds refund tracking and audit capabilities

-- 1. Add refund fields to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS refunded_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS refunded_amount decimal(10,2),
ADD COLUMN IF NOT EXISTS refunded_transaction_id text,
ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- 2. Create refund_logs table for comprehensive audit trail
CREATE TABLE IF NOT EXISTS public.refund_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id),
  original_transaction_id text NOT NULL,
  refund_transaction_id text,
  original_amount decimal(10,2) NOT NULL,
  refund_amount decimal(10,2) NOT NULL,
  cancellation_fee decimal(10,2) NOT NULL DEFAULT 0,
  unused_days integer NOT NULL,
  total_days integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message text,
  cardcom_response jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  processed_at timestamp with time zone
);

-- 3. Add RLS policies for refund_logs
ALTER TABLE public.refund_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own refund logs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'refund_logs' 
        AND policyname = 'Users can view their own refund logs'
    ) THEN
        CREATE POLICY "Users can view their own refund logs" 
        ON public.refund_logs 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Service role can manage all refund logs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'refund_logs' 
        AND policyname = 'Service role can manage refund logs'
    ) THEN
        CREATE POLICY "Service role can manage refund logs" 
        ON public.refund_logs 
        FOR ALL 
        USING (current_setting('role') = 'service_role')
        WITH CHECK (current_setting('role') = 'service_role');
    END IF;
END $$;

-- Admins can view all refund logs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'refund_logs' 
        AND policyname = 'Admins can view all refund logs'
    ) THEN
        CREATE POLICY "Admins can view all refund logs" 
        ON public.refund_logs 
        FOR SELECT 
        USING (auth.uid() IN (
            SELECT profiles.user_id
            FROM profiles
            WHERE profiles.email = ANY(ARRAY['dncar13@gmail.com'::text, 'buldir@gmail.com'::text])
        ));
    END IF;
END $$;

-- 4. Create indexes for better performance
CREATE INDEX idx_refund_logs_user_id ON public.refund_logs(user_id);
CREATE INDEX idx_refund_logs_subscription_id ON public.refund_logs(subscription_id);
CREATE INDEX idx_refund_logs_status ON public.refund_logs(status);
CREATE INDEX idx_refund_logs_created_at ON public.refund_logs(created_at);

-- 5. Add trigger for updated_at on refund_logs
CREATE TRIGGER update_refund_logs_updated_at
  BEFORE UPDATE ON public.refund_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Update payment_transactions table to track refunds
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS is_refund boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS original_transaction_id text,
ADD COLUMN IF NOT EXISTS refund_reason text;

-- Create index for refund tracking
CREATE INDEX idx_payment_transactions_is_refund ON public.payment_transactions(is_refund);
CREATE INDEX idx_payment_transactions_original_transaction_id ON public.payment_transactions(original_transaction_id);

-- 7. Create function to calculate refund amount
CREATE OR REPLACE FUNCTION public.calculate_refund_amount(
  p_original_amount decimal,
  p_start_date timestamp with time zone,
  p_end_date timestamp with time zone,
  p_cancel_date timestamp with time zone,
  p_plan_type text
)
RETURNS TABLE(
  refund_amount decimal,
  cancellation_fee decimal,
  unused_days integer,
  total_days integer,
  eligible_for_refund boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_days integer;
  v_unused_days integer;
  v_refund_before_fee decimal;
  v_cancellation_fee decimal;
  v_final_refund decimal;
BEGIN
  -- Daily subscriptions are not eligible for refunds
  IF p_plan_type = 'day' THEN
    RETURN QUERY SELECT 0::decimal, 0::decimal, 0, 1, false;
    RETURN;
  END IF;
  
  -- Calculate days
  v_total_days := CEIL(EXTRACT(EPOCH FROM (p_end_date - p_start_date)) / 86400);
  v_unused_days := GREATEST(0, CEIL(EXTRACT(EPOCH FROM (p_end_date - p_cancel_date)) / 86400));
  
  -- Calculate refund before fee
  v_refund_before_fee := p_original_amount * (v_unused_days::decimal / v_total_days::decimal);
  
  -- Calculate cancellation fee (5% or ₪100, whichever is lower)
  v_cancellation_fee := LEAST(p_original_amount * 0.05, 100);
  
  -- Calculate final refund
  v_final_refund := GREATEST(0, v_refund_before_fee - v_cancellation_fee);
  
  -- Round to 2 decimal places
  v_final_refund := ROUND(v_final_refund, 2);
  v_cancellation_fee := ROUND(v_cancellation_fee, 2);
  
  -- Check if eligible for refund (minimum ₪2)
  IF v_final_refund < 2 THEN
    v_final_refund := 0;
    v_cancellation_fee := 0;
  END IF;
  
  RETURN QUERY SELECT 
    v_final_refund,
    v_cancellation_fee,
    v_unused_days,
    v_total_days,
    (v_final_refund > 0);
END;
$$;

-- 8. Create function to get user refund history
CREATE OR REPLACE FUNCTION public.get_user_refund_history(user_uuid UUID)
RETURNS TABLE(
  id UUID,
  subscription_id UUID,
  original_transaction_id text,
  refund_transaction_id text,
  original_amount decimal,
  refund_amount decimal,
  cancellation_fee decimal,
  status text,
  created_at timestamp with time zone,
  processed_at timestamp with time zone,
  plan_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rl.id,
    rl.subscription_id,
    rl.original_transaction_id,
    rl.refund_transaction_id,
    rl.original_amount,
    rl.refund_amount,
    rl.cancellation_fee,
    rl.status,
    rl.created_at,
    rl.processed_at,
    s.plan_type
  FROM public.refund_logs rl
  JOIN public.subscriptions s ON rl.subscription_id = s.id
  WHERE rl.user_id = user_uuid
  ORDER BY rl.created_at DESC;
END;
$$;

-- 9. Comment for webhook URL configuration
COMMENT ON TABLE public.refund_logs IS 'Tracks all refund operations for subscription cancellations. Israeli law compliance: pro-rated refunds with 5% or ₪100 cancellation fee (whichever is lower)';