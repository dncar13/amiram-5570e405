-- Add foreign key relationship between payment_transactions and subscriptions
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS subscription_id uuid;

-- Add foreign key constraint
ALTER TABLE public.payment_transactions 
ADD CONSTRAINT fk_payment_transactions_subscription_id 
FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) 
ON DELETE SET NULL;