-- Add refund support columns to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS refunded_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS refunded_amount decimal(10,2),
ADD COLUMN IF NOT EXISTS refunded_transaction_id text,
ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- Add refund support columns to payment_transactions table
ALTER TABLE public.payment_transactions
ADD COLUMN IF NOT EXISTS is_refund boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS original_transaction_id text,
ADD COLUMN IF NOT EXISTS refund_reason text;

-- Create refund_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.refund_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID NOT NULL,
  original_transaction_id text NOT NULL,
  refund_transaction_id text,
  original_amount decimal(10,2) NOT NULL,
  refund_amount decimal(10,2) NOT NULL,
  cancellation_fee decimal(10,2) NOT NULL,
  unused_days integer NOT NULL,
  total_days integer NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  processed_at timestamp with time zone
);

-- Enable RLS on refund_logs
ALTER TABLE public.refund_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for refund_logs
CREATE POLICY "Users can view their own refund logs"
ON public.refund_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role full access refund logs"
ON public.refund_logs
FOR ALL
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

-- Create calculate_refund_amount function
CREATE OR REPLACE FUNCTION public.calculate_refund_amount(
  p_original_amount decimal,
  p_start_date timestamp with time zone,
  p_end_date timestamp with time zone,
  p_cancel_date timestamp with time zone,
  p_plan_type text
) RETURNS TABLE(
  refund_amount decimal,
  cancellation_fee decimal,
  unused_days integer,
  total_days integer,
  eligible_for_refund boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_total_days integer;
  v_unused_days integer;
  v_refund_before_fee decimal;
  v_cancellation_fee decimal;
  v_final_refund decimal;
BEGIN
  -- Daily subscriptions are not eligible for refunds
  IF p_plan_type = 'daily' THEN
    RETURN QUERY SELECT 0::decimal, 0::decimal, 0, 1, false;
    RETURN;
  END IF;

  -- Calculate total days and unused days
  v_total_days := CEIL(EXTRACT(EPOCH FROM (p_end_date - p_start_date)) / 86400);
  v_unused_days := GREATEST(0, CEIL(EXTRACT(EPOCH FROM (p_end_date - p_cancel_date)) / 86400));

  -- If no unused days, no refund
  IF v_unused_days <= 0 THEN
    RETURN QUERY SELECT 0::decimal, 0::decimal, v_unused_days, v_total_days, false;
    RETURN;
  END IF;

  -- Calculate proportional refund before fee
  v_refund_before_fee := p_original_amount * (v_unused_days::decimal / v_total_days::decimal);
  
  -- Calculate cancellation fee (5% or ₪100, whichever is lower)
  v_cancellation_fee := LEAST(p_original_amount * 0.05, 100);
  
  -- Calculate final refund amount
  v_final_refund := GREATEST(0, v_refund_before_fee - v_cancellation_fee);
  
  -- Round to 2 decimal places
  v_final_refund := ROUND(v_final_refund, 2);
  v_cancellation_fee := ROUND(v_cancellation_fee, 2);

  -- Check if refund meets minimum threshold (₪2)
  IF v_final_refund < 2 THEN
    RETURN QUERY SELECT 0::decimal, 0::decimal, v_unused_days, v_total_days, false;
    RETURN;
  END IF;

  RETURN QUERY SELECT v_final_refund, v_cancellation_fee, v_unused_days, v_total_days, true;
END;
$$;