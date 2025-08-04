-- Add payment_transactions table for tracking CardCom payments
-- This migration adds payment tracking and updates webhook URL routing

-- Create payment_transactions table
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  transaction_id TEXT NOT NULL UNIQUE, -- CardCom transaction ID
  low_profile_id TEXT, -- CardCom LowProfile ID
  payment_method TEXT NOT NULL DEFAULT 'cardcom',
  amount DECIMAL(10,2) NOT NULL,
  original_amount DECIMAL(10,2), -- Before discounts
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'ILS',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  coupon_code TEXT,
  card_last_four TEXT, -- Last 4 digits of card
  card_holder_name TEXT,
  auth_number TEXT, -- CardCom authorization number
  voucher_number TEXT, -- CardCom voucher number
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB -- Additional CardCom response data
);

-- Add RLS policies for payment_transactions
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment transactions
CREATE POLICY "Users can view their own payment transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own payment transactions (for webhook processing)
CREATE POLICY "Service role can manage payment transactions" 
ON public.payment_transactions 
FOR ALL 
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

-- Admins can view all payment transactions
CREATE POLICY "Admins can view all payment transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (auth.uid() IN (
    SELECT profiles.user_id
    FROM profiles
    WHERE profiles.email = ANY(ARRAY['dncar13@gmail.com'::text, 'buldir@gmail.com'::text])
));

-- Create indexes for better performance
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_transaction_id ON public.payment_transactions(transaction_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_date ON public.payment_transactions(transaction_date);

-- Add trigger for updated_at
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add a function to get user payment history
CREATE OR REPLACE FUNCTION public.get_user_payment_history(user_uuid UUID)
 RETURNS TABLE(
   id UUID,
   transaction_id TEXT,
   amount DECIMAL,
   currency TEXT,
   status TEXT,
   transaction_date TIMESTAMP WITH TIME ZONE,
   subscription_plan TEXT
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pt.id,
    pt.transaction_id,
    pt.amount,
    pt.currency,
    pt.status,
    pt.transaction_date,
    s.plan_type as subscription_plan
  FROM public.payment_transactions pt
  LEFT JOIN public.subscriptions s ON pt.subscription_id = s.id
  WHERE pt.user_id = user_uuid
  ORDER BY pt.transaction_date DESC;
END;
$function$;

-- Update webhook URL configuration comment
COMMENT ON TABLE public.payment_transactions IS 'Tracks all payment transactions from CardCom. Webhook URL should be configured as: https://amiram.net/api/cardcom-webhook';

-- Add constraint to ensure transaction_id uniqueness per payment method
ALTER TABLE public.payment_transactions 
ADD CONSTRAINT unique_transaction_per_method 
UNIQUE (transaction_id, payment_method);