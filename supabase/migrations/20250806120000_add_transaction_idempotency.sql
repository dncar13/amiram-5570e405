-- Add full idempotency constraints for payment transactions
-- This ensures that duplicate webhooks are properly handled at the database level

-- First, create a unique constraint on transaction_id + checksum combination
-- This prevents duplicate transactions even with the same ID but different checksums
ALTER TABLE public.payment_transactions 
ADD CONSTRAINT unique_transaction_checksum 
UNIQUE (transaction_id, checksum) DEFERRABLE INITIALLY DEFERRED;

-- Add a partial unique constraint for backward compatibility
-- This handles cases where checksum might not be present
CREATE UNIQUE INDEX CONCURRENTLY unique_transaction_id_when_checksum_null
ON public.payment_transactions (transaction_id) 
WHERE checksum IS NULL;

-- Add checksum column if it doesn't exist
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS checksum TEXT;

-- Add an index for faster checksum lookups
CREATE INDEX CONCURRENTLY idx_payment_transactions_checksum 
ON public.payment_transactions(checksum) 
WHERE checksum IS NOT NULL;

-- Create a function to handle idempotent transaction creation
CREATE OR REPLACE FUNCTION create_idempotent_transaction(
  p_user_id UUID,
  p_subscription_id UUID,
  p_low_profile_code TEXT,
  p_plan_type TEXT,
  p_amount INTEGER,
  p_currency TEXT,
  p_status TEXT,
  p_transaction_id TEXT,
  p_checksum TEXT,
  p_metadata JSONB
) RETURNS TABLE (
  transaction_id BIGINT,
  created BOOLEAN,
  message TEXT
) 
LANGUAGE plpgsql
AS $$
DECLARE
  existing_id BIGINT;
  new_id BIGINT;
BEGIN
  -- First, try to find existing transaction
  SELECT pt.id INTO existing_id
  FROM public.payment_transactions pt
  WHERE pt.low_profile_code = p_low_profile_code
     OR (pt.transaction_id = p_transaction_id AND pt.checksum = p_checksum)
     OR (pt.transaction_id = p_transaction_id AND p_checksum IS NULL AND pt.checksum IS NULL);
  
  IF existing_id IS NOT NULL THEN
    -- Transaction already exists
    RETURN QUERY SELECT existing_id, FALSE, 'Transaction already exists'::TEXT;
    RETURN;
  END IF;
  
  -- Create new transaction
  BEGIN
    INSERT INTO public.payment_transactions (
      user_id,
      subscription_id, 
      low_profile_code,
      plan_type,
      amount,
      currency,
      status,
      transaction_id,
      checksum,
      metadata,
      created_at,
      updated_at
    ) VALUES (
      p_user_id,
      p_subscription_id,
      p_low_profile_code, 
      p_plan_type,
      p_amount,
      p_currency,
      p_status,
      p_transaction_id,
      p_checksum,
      p_metadata,
      NOW(),
      NOW()
    ) RETURNING id INTO new_id;
    
    RETURN QUERY SELECT new_id, TRUE, 'Transaction created successfully'::TEXT;
    
  EXCEPTION 
    WHEN unique_violation THEN
      -- Handle race condition - transaction was created by another process
      SELECT pt.id INTO existing_id
      FROM public.payment_transactions pt
      WHERE pt.low_profile_code = p_low_profile_code
         OR (pt.transaction_id = p_transaction_id AND pt.checksum = p_checksum)
         OR (pt.transaction_id = p_transaction_id AND p_checksum IS NULL AND pt.checksum IS NULL);
      
      IF existing_id IS NOT NULL THEN
        RETURN QUERY SELECT existing_id, FALSE, 'Transaction created by concurrent process'::TEXT;
      ELSE
        -- This should not happen, but handle it gracefully
        RAISE EXCEPTION 'Unique violation but no existing transaction found';
      END IF;
  END;
END;
$$;

-- Grant execute permissions to the service role
GRANT EXECUTE ON FUNCTION create_idempotent_transaction TO service_role;

-- Add a comment explaining the idempotency strategy
COMMENT ON FUNCTION create_idempotent_transaction IS 
'Idempotent transaction creation function that prevents duplicate payment records. 
Uses low_profile_code, transaction_id, and checksum for uniqueness validation.';

-- Create an audit table for failed idempotency attempts
CREATE TABLE IF NOT EXISTS public.transaction_idempotency_log (
  id BIGSERIAL PRIMARY KEY,
  low_profile_code TEXT,
  transaction_id TEXT,
  checksum TEXT,
  user_id UUID,
  attempt_timestamp TIMESTAMPTZ DEFAULT NOW(),
  failure_reason TEXT,
  request_data JSONB
);

-- Add RLS policies for the audit table
ALTER TABLE public.transaction_idempotency_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access transaction_idempotency_log" ON public.transaction_idempotency_log
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for the audit table
CREATE INDEX idx_transaction_idempotency_log_timestamp ON public.transaction_idempotency_log(attempt_timestamp);
CREATE INDEX idx_transaction_idempotency_log_low_profile ON public.transaction_idempotency_log(low_profile_code);