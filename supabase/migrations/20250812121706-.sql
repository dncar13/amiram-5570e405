-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Clean old policies (including any that used current_setting('role'))
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Service role can manage all transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS select_own_transactions ON public.payment_transactions;
DROP POLICY IF EXISTS service_role_all ON public.payment_transactions;

-- Authenticated users may SELECT only their own rows
CREATE POLICY select_own_transactions
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Service role full access (explicit, though SR bypasses RLS anyway)
CREATE POLICY service_role_all
ON public.payment_transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Recreate integrity/immutability triggers
DROP TRIGGER IF EXISTS guard_payment_status_text ON public.payment_transactions;
CREATE TRIGGER guard_payment_status_text
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.guard_payment_status_text();

DROP TRIGGER IF EXISTS lock_after_terminal_status ON public.payment_transactions;
CREATE TRIGGER lock_after_terminal_status
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.lock_after_terminal_status();